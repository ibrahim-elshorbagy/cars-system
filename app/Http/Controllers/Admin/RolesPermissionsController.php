<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesPermissionsController extends Controller
{
    public function index()
    {
        $roles = Role::select()
            ->get();

        return inertia('Admin/RolesPermissions/Index', [
            'roles' => $roles,
        ]);
    }

   public function edit(Role $role)
    {
        // Group permissions based on their entity prefix
        $groupedPermissions = Permission::all();
        // Fetch the role's current permissions
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        return inertia('Admin/RolesPermissions/Edit', [
            'role' => $role,
            'groupedPermissions' => $groupedPermissions,
            'rolePermissions' => $rolePermissions, // Preload current permissions of the role
        ]);
    }

    /**
     * Update the role's permissions in storage.
     */
    public function update(Request $request, Role $role)
    {
        // Validate the request
        $data = $request->validate([
            'permissions' => 'array|required', // Expecting an array of permissions
        ]);

        // Sync the role's permissions with the selected ones
        $role->syncPermissions($data['permissions']);

        return redirect()->route('admin.roles-permissions.index')->with('success', 'Permissions updated successfully.');
    }

}
