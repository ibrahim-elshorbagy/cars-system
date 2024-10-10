<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Admin\Transportation\ModellResource;
use App\Models\Admin\Transportation\Modell;

use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\MakeResource;
use App\Models\Admin\Transportation\Make;

class ModellController extends Controller
{
    public function index()
    {
        $query = Modell::query();
        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $models = $query->with('make')->paginate(25)->onEachSide(1);

        $makes = Make::all();

        return inertia("Admin/Transportation/Model/Index", [
            "models" => ModellResource::collection($models),
            "makes" => MakeResource::collection($makes),
            'queryParams' => request()->query() ?: null,


        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:models,name'],
            'make_id' => ['required', 'exists:makes,id'],
        ]);

        Modell::create($data);


        return back()->with('success', "تم انشاء موديل بنجاح");

    }

    public function update(Request $request, Modell $model)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('models')->ignore($model->id, 'id')],
            'make_id' => ['required', 'exists:makes,id'],

        ];

        $data = $request->validate($rules);

        $model->update($data);

        return back()->with('success', "تم تحديث الموديل بنجاح");
    }


    public function destroy(Modell $model)
    {

        if ($model->cars()->count() > 0) {
        return back()->with('danger', 'لا يمكن حذف الموديل لأنها مرتبطة بسيارات');
        }
        $model->delete();
        return back()->with('success', "تم حذف الموديل بنجاح");

    }

}
