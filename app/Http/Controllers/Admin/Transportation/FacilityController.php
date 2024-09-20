<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\FacilityResource;
use App\Models\Admin\Transportation\Facility;

class FacilityController extends Controller
{
  public function index()
    {
        $query = Facility::query();


        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        $facilities = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Facility/Index", [
            "facilities" => FacilityResource::collection($facilities),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:facilities,name'],
        ]);

        $facility= Facility::create($data);


        return back()->with('success', "تم انشاء المرفق بنجاح");

    }

    public function update(Request $request, Facility $facility)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('facilities')->ignore($facility->id, 'id')],
        ];

        $data = $request->validate($rules);

        $facility->update($data);

        return back()->with('success', "تم تحديث المرفق بنجاح");
    }


    public function destroy(Facility $facility)
    {

        $facility->delete();
        return back()->with('success', "تم حذف المرفق بنجاح");

    }
}
