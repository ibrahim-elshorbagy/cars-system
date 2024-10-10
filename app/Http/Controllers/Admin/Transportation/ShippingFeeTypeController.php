<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Transportation\ShippingFeeTypeResource;
use App\Models\Admin\Bill\Fees\ShippingFeeType;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ShippingFeeTypeController extends Controller
{
    public function index()
    {
        $query = ShippingFeeType::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("ar_name")) {

            $query->where("ar_name", "like", "%" . request("ar_name") . "%");
        }
        $feeTypes = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/ShippingFeeType/Index", [
            "feeTypes" => ShippingFeeTypeResource::collection($feeTypes),
            'queryParams' => request()->query() ?: null,


        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:shipping_fee_types,name'],
            'ar_name' => ['required', 'string', 'unique:shipping_fee_types,name'],
        ]);

        ShippingFeeType::create($data);


        return back()->with('success', "تم انشاء التكلفة بنجاح");

    }

    public function update(Request $request, ShippingFeeType $ShippingFee)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('shipping_fee_types')->ignore($ShippingFee->id, 'id')],
            'ar_name' => ['required', 'string', Rule::unique('shipping_fee_types')->ignore($ShippingFee->id, 'id')],
        ];

        $data = $request->validate($rules);

        $ShippingFee->update($data);

        return back()->with('success', "تم تحديث التكلفة بنجاح");
    }


    public function destroy(ShippingFeeType $ShippingFee)
    {

        if ($ShippingFee->expenses()->count() > 0) {
        return back()->with('danger', 'لا يمكن حذف التكلفة لأنها مرتبطة بسيارات');
        }
        $ShippingFee->delete();
        return back()->with('success', "تم حذف التكلفة بنجاح");

    }
}
