<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\MakeResource;
use App\Models\Admin\Transportation\Make;

class MakeController extends Controller
{
    public function index()
    {
        $query = Make::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $makes = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Make/Index", [
            "makes" => MakeResource::collection($makes),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:makes,name'],
        ]);

        $make= Make::create($data);


        return back()->with('success', "تم انشاء ماركه بنجاح");

    }

    public function update(Request $request, Make $make)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('makes')->ignore($make->id, 'id')],
        ];

        $data = $request->validate($rules);

        $make->update($data);

        return back()->with('success', "تم تحديث الماركه بنجاح");
    }


    public function destroy(Make $make)
    {

        $make->delete();
        return back()->with('success', "تم حذف الماركه بنجاح");

    }
}
