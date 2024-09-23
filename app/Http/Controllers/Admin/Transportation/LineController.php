<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\LineResource;
use App\Models\Admin\Transportation\Line;

class LineController extends Controller
{
    public function index()
    {
        $query = Line::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $lines = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Line/Index", [
            "lines" => LineResource::collection($lines),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:lines,name'],
            'line_website'=>['required', 'string'],
        ]);

        $line= Line::create($data);


        return back()->with('success', "تم انشاء الخط الملاحي بنجاح");

    }

    public function update(Request $request, Line $line)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('lines')->ignore($line->id, 'id')],
            'line_website'=>['required', 'string'],

        ];

        $data = $request->validate($rules);

        $line->update($data);

        return back()->with('success', "تم تحديث الخط الملاحي بنجاح");
    }


    public function destroy(Line $line)
    {

        $line->delete();
        return back()->with('success', "تم حذف الخط الملاحي بنجاح");

    }
}
