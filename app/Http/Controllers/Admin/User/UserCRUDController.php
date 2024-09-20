<?php

namespace App\Http\Controllers\Admin\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\UserCRUD\StoreUserRequest;
use App\Http\Requests\Admin\User\UserCRUD\UpdateUserRequest;
use App\Http\Resources\Admin\User\UserCRUDResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Spatie\Permission\Models\Role;

class UserCRUDController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::whereDoesntHave('roles', function ($q) {$q->where('name', 'customer'); });

        $roles = Role::whereNotIn('name', ['customer'])->get();

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }
        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query->paginate(10)->onEachSide(1);

        return inertia("Admin/User/UserCURD/Index", [
            "users" => UserCRUDResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'roles' => $roles,


        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {

        $data = $request->validated();
        $data['email_verified_at'] = time();
        $data['password'] = bcrypt($data['password']);
        $user= User::create($data);

        if (isset($data['role'])) {
        $role = Role::findById($data['role']);
        $user->assignRole($role);
        }


        return to_route('user.index')
            ->with('success', "تم انشاء المستخدم بنجاح");

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
         $roles = Role::whereIn('name', ['admin', 'systemadmin'])->get();

        return inertia('Admin/User/UserCURD/Edit', [
            'user' => new UserCrudResource($user),
            'roles' => $roles,

        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {

        $data = $request->validated();
        $password = $data['password'] ?? null;
        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }
            if (isset($data['role'])) {
            $role = Role::findById($data['role']);
            $user->syncRoles([$role]);  // This will replace any existing roles with the new one
        }
        $user->update($data);




        // Return the success message and redirect
        return to_route('user.index')
            ->with('success', "تم تحديث المستخدم بنجاح");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $name = $user->name;
        $user->delete();



        return to_route('user.index')
            ->with('success', "تم حذف المستخدم بنجاح"); 
    }

}
