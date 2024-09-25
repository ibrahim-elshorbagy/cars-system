<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\DestinationResource;
use App\Models\Admin\Transportation\Destination;

class DestinationController extends Controller
{
    public function index()
    {
        $query = Destination::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $destinations = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Destination/Index", [
            "destinations" => DestinationResource::collection($destinations),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:destinations,name'],
        ]);

        $destination= Destination::create($data);


        return back()->with('success', "تم انشاء الوجه بنجاح");

    }

    public function update(Request $request, Destination $destination)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('destinations')->ignore($destination->id, 'id')],
        ];

        $data = $request->validate($rules);

        $destination->update($data);

        return back()->with('success', "تم تحديث الوجه بنجاح");
    }


    public function destroy(Destination $destination)
    {

        if ($destination->cars()->count() > 0) {
        return back()->with('danger', 'لا يمكن حذف الوجه لأنها مرتبطة بسيارات');
        }
        $destination->delete();
        return back()->with('success', "تم حذف الوجه بنجاح");

    }
}
