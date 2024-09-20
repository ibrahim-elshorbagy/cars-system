<?php

namespace App\Http\Controllers\Admin\Box;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Box\BoxResource;
use App\Models\Admin\Box\Box;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BoxController extends Controller
{
    public function index()
    {
        $query = Box::query();


        if (request("name")) {
            request()->merge(['page' => 1]);
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $boxes = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Box/Index", [
            "boxes" => BoxResource::collection($boxes),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:boxes,name'],
        ]);

        $box= Box::create($data);


        return to_route('box.index')->with('success', "تم انشاء الصندوق بنجاح");

    }

    public function update(Request $request, Box $box)
    {

        $rules = [
            'name' => ['required', 'string', Rule::unique('boxes')->ignore($box->id, 'id')],
        ];

        $data = $request->validate($rules);

        $box->update($data);

        return to_route('box.index')
            ->with('success', "تم تحديث الصندوق بنجاح");
    }


    public function destroy(Box $box)
    {

        $box->delete();
        return to_route('box.index')
            ->with('success', "تم حذف الصندوق بنجاح");

    }
}
