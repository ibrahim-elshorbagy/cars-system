<?php

namespace App\Http\Controllers\Admin\CarBill\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Car\CarStore;
use App\Http\Requests\Admin\car\CarUpdate;
use App\Http\Resources\Admin\CarBill\Car\CarResource;
use App\Http\Resources\Admin\CarBill\Car\ShowCarResource;
use Illuminate\Support\Facades\Storage;

use App\Models\Admin\Car\Car;
use App\Models\Admin\Car\CarImage;
use Illuminate\Http\Request;
use App\Models\Admin\Transportation\Vendor;
use App\Models\Admin\Transportation\Destination;
use App\Models\Admin\Transportation\Line;
use App\Models\Admin\Transportation\Facility;
use App\Models\Admin\Transportation\Make;
use App\Models\Admin\Transportation\Modell;
use App\Models\Admin\Transportation\ShipStatus;
use App\Models\Admin\Transportation\Terminal;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CarController extends Controller
{
    public function index()
    {

        $query = Car::with('user')->orderBy("id", "desc");

        if (request("chassis")) {
            $query->where("chassis", "like", "%" . request("chassis") . "%");
        }

        if (request("customer_name")) {
            $query->whereHas('user', function($q) {
                $q->where("name", "like", "%" . request("customer_name") . "%");
            });
        }
        $cars = $query->paginate(25)->onEachSide(1);


        $vendors = Vendor::all();
        $destinations = Destination::all();
        $lines = Line::all();
        $facilities = Facility::all();
        $terminals = Terminal::all();
        $makes = Make::all();
        $models = Modell::all();
        $shipStatus =ShipStatus::all();
        $customers = User::role('customer')->select('id','name')->get();

        return inertia("Admin/CarBill/Car/Index", [

            "cars" => ShowCarResource::collection($cars),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),

            'vendors'   =>$vendors,
            'destinations'=>$destinations,
            'lines'=>$lines,
            'facilities'=>$facilities,
            'terminals'=>$terminals,
            'makes'=>$makes,
            'models'=>$models,
            'customers'=>$customers,

            'shipStatus'=>$shipStatus,

            'ErrorAlert'=>session('ErrorAlert'),
        ]);
    }
    public function show(Car $car){

        return inertia("Admin/CarBill/Car/Show", [
            'car' => new ShowCarResource($car),
        ]);

    }

    public function store(CarStore $request){
        DB::beginTransaction();
        try {
            // Save the Car
            $car = Car::create($request->validated());

            // Handle Carfax report upload
            if ($request->hasFile('carfax_report')) {
                $carfaxReportPath = $request->file('carfax_report')->store('/cars/'.$car->user_id .'/'. $car->id . '/carfax_report', 'public');
                $car->update(['carfax_report' => $carfaxReportPath]);
            }

            // Handle images upload
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    // Store the image and get its path
                    $imagePath = $image->store('/cars/'. $car->user_id . '/' . $car->id . '/images', 'public');

                    // Get the public URL of the stored image
                    $imageUrl = Storage::url($imagePath);

                    // Save the image URL in the database
                    CarImage::create([
                        'car_id' => $car->id,
                        'image_url' => $imageUrl,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('car.index')->with('success', 'تم اضافة السياره بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['ErrorAlert' => 'حدث خطأ غير متوقع: ' . $e->getMessage()]);
        }

    }

    public function update(CarUpdate $request, Car $car)
    {
        DB::beginTransaction();
        $data =$request->validated();
        try {


            // 1. Handle Carfax report upload
            if ($request->hasFile('carfax_report')) {
                // Delete the old Carfax report if it exists
                if ($car->carfax_report && Storage::disk('public')->exists($car->carfax_report)) {
                    Storage::disk('public')->delete($car->carfax_report);
                }

                // Store the new Carfax report and update the car record
                $carfaxReportPath = $request->file('carfax_report')->store('/cars/'.$car->user_id. '/'. $car->id. '/carfax_report', 'public');
                $car->update(['carfax_report' => $carfaxReportPath]);
            }
                unset($data['carfax_report']);

            // 2. Handle image updates
            if ($request->hasFile('images') || $request->filled('old_images_url')) {
                // Get the existing images from the database
                $existingImages = $car->carImages()->pluck('image_url')->toArray();

                // If old_images_url is present, keep those, otherwise delete from the server
                if ($request->filled('old_images_url')) {
                    $oldImagesUrl = $request->input('old_images_url');
                    // dd($oldImagesUrl);
                    // Find images that are in the database but not in the old_images_url array (i.e., deleted by the user)
                    $imagesToDelete = array_diff($existingImages, $oldImagesUrl);
                    // Delete these images from the storage and the database
                    foreach ($imagesToDelete as $imageUrl) {

                            $DeleteimagePath = str_replace('/storage', '', $imageUrl);
                        if (Storage::disk('public')->exists($DeleteimagePath)) {
                            Storage::disk('public')->delete($DeleteimagePath);
                        }
                        CarImage::where('image_url', $imageUrl)->delete();
                    }
                } else {
                    // If no old images were passed, delete all images

                    // Define the folder path where the specific car's images are stored
                    $imageFolderPath = '/cars/'. $car->user_id . '/' . $car->id . '/images';
                    // Check if the folder exists, then delete the entire folder for that car

                    if (Storage::disk('public')->exists($imageFolderPath)) {

                        Storage::disk('public')->deleteDirectory($imageFolderPath);
                    }

                    CarImage::where('car_id', $car->id)->delete();
                }

                // 3. Update the Car with validated data
                $car->update($data);

                // 4. Store new images (if any)
                if ($request->hasFile('images')) {
                    foreach ($request->file('images') as $image) {
                        $imagePath = $image->store('/cars/'.$car->user_id . '/' . $car->id . '/images', 'public');
                        CarImage::create([
                            'car_id' => $car->id,
                            'image_url' => Storage::url($imagePath),
                        ]);
                    }
                }
            }


            // Commit the transaction
            DB::commit();

            return back()->with('success', 'تم تحديث السياره بنجاح');
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            return back()->withErrors(['ErrorAlert' => 'حدث خطأ غير متوقع: ' . $e->getMessage()]);
        }
    }

    public function destroy(Car $car)
    {

        // Define the folder path where the specific car's images are stored
        $imageFolderPath = '/cars/'. $car->user_id . '/' . $car->id;
        // Check if the folder exists, then delete the entire folder for that car
        if (Storage::disk('public')->exists($imageFolderPath)) {
            Storage::disk('public')->deleteDirectory($imageFolderPath);
        }

        // Delete associated car images
        $car->carImages()->delete();

        $car->delete();

        return back()->with('success', ' تم حذف السيارة بنجاح ');
    }

}
