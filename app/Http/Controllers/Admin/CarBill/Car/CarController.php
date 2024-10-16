<?php

namespace App\Http\Controllers\Admin\CarBill\Car;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Car\CarStore;
use App\Http\Requests\Admin\Car\CarUpdate;
use App\Http\Resources\Admin\CarBill\Car\CustomerResource;
use App\Http\Resources\Admin\CarBill\Car\ShowCarResource;


use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Bill\Fees\ShippingExpens;
use App\Models\Admin\Bill\Fees\ShippingFeeType;
use App\Models\Admin\Box\Box;
use Illuminate\Support\Facades\Auth;


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
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;


use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;


class CarController extends Controller
{
    public function index()
    {

        $query = Car::with('user.customer','bill.shippingExpenses.shippingFeeType',"carImages.createdBy")->orderBy("id", "desc");

        if (request("chassis")) {
            $query->where("chassis", "like", "%" . request("chassis") . "%");
        }
        if (request("ship_status")) {
            $query->where('ship_status', request("ship_status"));
        }

        if (request("customer_company")) {
            $query->whereHas('user.customer', function($q) {
                $q->where("customer_company", "like", "%" . request("customer_company") . "%");
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
        $customers = User::role('customer')->select('id','name')->with('customer')->get();
        $boxeslist = Box::all();

       $shippingFeeTypes = ShippingFeeType::all()->map(function ($feeType) {
            return [
                'id' => $feeType->id,
                'name' => " $feeType->name ( $feeType->ar_name )",
            ];
        });




        return inertia("Admin/CarBill/Car/Index", [

            "cars" => ShowCarResource::collection($cars),
            'queryParams' => request()->query() ?: null,



            'customers'=>CustomerResource::collection($customers),
            'boxeslist' => $boxeslist,

            'vendors'   =>$vendors,
            'destinations'=>$destinations,
            'lines'=>$lines,
            'facilities'=>$facilities,
            'terminals'=>$terminals,
            'makes'=>$makes,
            'models'=>$models,

            'shipStatus'=>$shipStatus,
            'shippingFeeTypes'=>$shippingFeeTypes,

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
        $data = $request->validated();

        try {
            // Save the Car
            $data['created_by']=Auth::user()->id;
            $car = Car::create($data);


            $bill = Bill::create([
                'car_id'=>$car->id,
                'user_id'=>$data['user_id'],
                'won_price'=>$data['won_price'] ?? 0,
                'shipping_cost'=> 0,
                'created_by'=>Auth::user()->id
            ]);


            $totalAmount = 0;
            if(!empty($data['shipping_expenses']))
            {
                foreach ($data['shipping_expenses'] as $expense) {

                        $totalAmount += $expense['amount'];
                        // Only create a StockReleaseRequest if the quantity is provided and valid
                            ShippingExpens::create([
                                'bill_id' => $bill->id,
                                'shipping_fee_type_id' => $expense['fee_id'],
                                'amount' => $expense['amount'],
                                'created_by'=>Auth::user()->id,
                                'created_at'=>$expense['created_at'],
                            ]);
                    }
            }

            $bill->update(['shipping_cost' => $totalAmount]);

            // Handle Carfax report upload
            if ($request->hasFile('carfax_report')) {
                $carfaxReportPath = $request->file('carfax_report')->store('/cars/'.$car->user_id .'/'. $car->id . '/carfax_report', 'public');
                $car->update(['carfax_report' => $carfaxReportPath]);
            }




            // Handle images upload
            $manager = new ImageManager(new Driver());
            if ($request->hasFile('images')) {

                    foreach ($request->file('images') as $image) {
                            // Generate the directory path
                            $directoryPath = 'cars/' . $car->user_id . '/' . $car->id . '/images';

                            // Ensure the directory exists
                            if (!Storage::disk('public')->exists($directoryPath)) {
                                Storage::disk('public')->makeDirectory($directoryPath, 0755, true);
                            }

                            // Generate the full image path
                            $imagePath = $directoryPath . '/' . uniqid('car_') . '.' . $image->getClientOriginalExtension();

                            // Read the image using Intervention Image
                            $img = $manager->read($image);


                            // Save the image with compression
                            $fullPath = Storage::disk('public')->path($imagePath);
                            $img->save($fullPath, 80);

                            // Get the public URL of the stored image
                            $imageUrl = Storage::url($imagePath);

                            // Save the image URL in the database
                            CarImage::create([
                                'car_id' => $car->id,
                                'image_url' => $imageUrl,
                                'created_at' => now(),
                                'created_by' => Auth::user()->id,
                            ]);
                    }
            }


            DB::commit();

            return redirect()->route('car.index')->with('success', 'تم اضافة السيارة بنجاح');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->with('ErrorAlert' , $e->getMessage());
        }

    }

    public function update(CarUpdate $request, Car $car)
    {

        DB::beginTransaction();
        $data =$request->validated();
        $data['updated_by']=Auth::user()->id;
        $bill = $car->bill;
        try {

            $bill->update([
                'user_id'=>$data['user_id'],
                'won_price'=>$data['won_price'],
                'shipping_cost'=>$data['shipping_cost'],
                'updated_by'=>Auth::user()->id

            ]);

            if (isset($data['shipping_expenses']) && is_array($data['shipping_expenses'])) {
                $existingExpenseIds = $bill->shippingExpenses()->pluck('id')->toArray();
                $processedExpenseIds = [];
                $totalAmount = 0;
                foreach ($data['shipping_expenses'] as $expense) {

                    $totalAmount += $expense['amount'];

                    if (!empty($expense['expense_id']) && in_array($expense['expense_id'], $existingExpenseIds)) {

                        $existingExpense = ShippingExpens::find($expense['expense_id']);

                        if ($existingExpense->amount != $expense['amount']) {
                            $existingExpense->update([
                                'amount'     => $expense['amount'],
                                'updated_by' => Auth::user()->id,
                            ]);
                        }

                        $processedExpenseIds[] = $existingExpense->id;
                    } else {

                        $newExpense = ShippingExpens::create([
                            'bill_id'               => $bill->id,
                            'shipping_fee_type_id'  => $expense['fee_id'],
                            'amount'                => $expense['amount'],
                            'created_by'            => Auth::user()->id,
                            'created_at'            => $expense['create_date']
                        ]);
                        $processedExpenseIds[] = $newExpense->id;
                    }
                }
                $bill->update(['shipping_cost' => $totalAmount]);
                $bill->shippingExpenses()->whereNotIn('id', $processedExpenseIds)->delete();

            } else {

                $bill->shippingExpenses()->delete();
                $bill->update(['shipping_cost' => 0]);
            }








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
                    $oldImagesData = $request->input('old_images_url');
                    $oldImagesUrl = collect($oldImagesData)->pluck('image_url')->toArray();
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

                    $manager = new ImageManager(new Driver());

                    foreach ($request->file('images') as $image) {
                        // Generate the directory path
                        $directoryPath = 'cars/' . $car->user_id . '/' . $car->id . '/images';

                        // Ensure the directory exists
                        if (!Storage::disk('public')->exists($directoryPath)) {
                            Storage::disk('public')->makeDirectory($directoryPath, 0755, true);
                        }

                        // Generate the full image path
                        $imagePath = $directoryPath . '/' . uniqid('car_') . '.' . $image->getClientOriginalExtension();

                        // Read the image using Intervention Image
                        $img = $manager->read($image);

                        // Save the image with compression
                        $fullPath = Storage::disk('public')->path($imagePath);
                        $img->save($fullPath, 80);

                        // Get the public URL of the stored image
                        $imageUrl = Storage::url($imagePath);

                        // Save the image URL in the database
                        CarImage::create([
                            'car_id' => $car->id,
                            'image_url' => $imageUrl,
                            'created_at' => now(),
                            'created_by' => Auth::user()->id,

                        ]);
                    }
                }
            }


            // Commit the transaction
            DB::commit();

            return back()->with('success', 'تم تحديث السيارة بنجاح');
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();

            return back()->with('ErrorAlert' , $e->getMessage());
        }
    }

    public function destroy(Car $car)
    {
        // Check if the car has any payments associated with its bills
        $hasPayments = $car->bill->paymentBills()->exists();

        if ($hasPayments) {
            return back()->with('danger', 'لا يمكن حذف السيارة لأنها تحتوي على مدفوعات.');
        }

        // If no payments are found, first delete associated bills
        $car->bill()->delete();

        // Define the folder path where the specific car's images are stored
        $imageFolderPath = '/cars/'. $car->user_id . '/' . $car->id;

        // Check if the folder exists, then delete the entire folder for that car
        if (Storage::disk('public')->exists($imageFolderPath)) {
            Storage::disk('public')->deleteDirectory($imageFolderPath);
        }

        // Delete associated car images
        $car->carImages()->delete();

        // Finally, delete the car
        $car->delete();

        return back()->with('success', 'تم حذف السيارة بنجاح.');
    }


}
