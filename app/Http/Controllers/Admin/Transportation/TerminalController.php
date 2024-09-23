<?php

namespace App\Http\Controllers\Admin\Transportation;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Resources\Admin\Transportation\TerminalResource;
use App\Models\Admin\Transportation\Terminal;

class TerminalController extends Controller
{
    public function index()
    {
        $query = Terminal::query();


        if (request("name")) {

            $query->where("name", "like", "%" . request("name") . "%");
        }
        $terminals = $query->paginate(25)->onEachSide(1);

        return inertia("Admin/Transportation/Terminal/Index", [
            "terminals" => TerminalResource::collection($terminals),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'unique:terminals,name'],
        ]);

        $terminal= Terminal::create($data);


        return back()->with('success', "تم انشاء المحطه بنجاح");

    }

    public function update(Request $request, Terminal $terminal)
    {
        $rules = [
            'name' => ['required', 'string', Rule::unique('terminals')->ignore($terminal->id, 'id')],
        ];

        $data = $request->validate($rules);

        $terminal->update($data);

        return back()->with('success', "تم تحديث المحطه بنجاح");
    }


    public function destroy(Terminal $terminal)
    {

        $terminal->delete();
        return back()->with('success', "تم حذف المحطه بنجاح");

    }
}
