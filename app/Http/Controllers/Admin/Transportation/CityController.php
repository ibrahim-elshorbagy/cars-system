<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\CityResource;
use App\Http\Resources\Admin\Transportation\PortResource;
use App\Models\Admin\Transportation\City;
use App\Models\Admin\Transportation\Port;

class CityController extends Controller
{
    public function index()
    {
        $query = City::query()->with('port');
        $ports = Port::all();

        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $cities = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/City/Index", [
            "cities" => CityResource::collection($cities),
            "ports" => PortResource::collection($ports),
            'queryParams' => request()->query() ?: null,


        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:cities,name'],
            'code' => ['required', 'string'],
            'port_id' => ['required', 'exists:ports,id'],
        ]);

        City::create($data);


        return back()->with('success', "تم انشاء المدينة بنجاح");

    }

    public function update(Request $request, City $city)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('cities')->ignore($city->id, 'id')],
            'code' => ['required', 'string'],
            'port_id' => ['required', 'exists:ports,id'],
        ];

        $data = $request->validate($rules);

        $city->update($data);

        return back()->with('success', "تم تحديث المدينة بنجاح");
    }


    public function destroy(City $city)
    {

        // if ($city->cars()->count() > 0) {
        // return back()->with('danger', 'لا يمكن حذف المدينة لأنها مرتبطة بسيارات');
        // }
        $city->delete();
        return back()->with('success', "تم حذف المدينة بنجاح");

    }
}
