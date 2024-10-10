<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\VendorResource;
use App\Models\Admin\Transportation\Vendor;

class VendorController extends Controller
{
    public function index()
    {
        $query = Vendor::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $vendors = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Vendor/Index", [
            "vendors" => VendorResource::collection($vendors),
            'queryParams' => request()->query() ?: null,


        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:vendors,name'],
        ]);

        $vendor= Vendor::create($data);


        return back()->with('success', "تم انشاء المزاد بنجاح");

    }

    public function update(Request $request, Vendor $vendor)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('vendors')->ignore($vendor->id, 'id')],
        ];

        $data = $request->validate($rules);

        $vendor->update($data);

        return back()->with('success', "تم تحديث المزاد بنجاح");
    }


    public function destroy(Vendor $vendor)
    {

        if ($vendor->cars()->count() > 0) {
        return back()->with('danger', 'لا يمكن حذف المزاد لأنها مرتبطة بسيارات');
        }

        $vendor->delete();
        return back()->with('success', "تم حذف المزاد بنجاح");

    }
}
