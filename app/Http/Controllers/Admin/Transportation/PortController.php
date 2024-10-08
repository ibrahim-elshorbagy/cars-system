<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\PortResource;
use App\Models\Admin\Transportation\Port;

class PortController extends Controller
{
    public function index()
    {
        $query = Port::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $ports = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Port/Index", [
            "ports" => PortResource::collection($ports),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:ports,name'],
        ]);

        Port::create($data);


        return back()->with('success', "تم انشاء الميناء بنجاح");

    }

    public function update(Request $request, Port $port)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('ports')->ignore($port->id, 'id')],
        ];

        $data = $request->validate($rules);

        $port->update($data);

        return back()->with('success', "تم تحديث الميناء بنجاح");
    }


    public function destroy(Port $port)
    {

        // if ($port->cars()->count() > 0) {
        // return back()->with('danger', 'لا يمكن حذف الميناء لأنها مرتبطة بسيارات');
        // }
        $port->delete();
        return back()->with('success', "تم حذف الميناء بنجاح");

    }
}
