<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Clear cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Base entities for CRUD operations
        $basePermissions = [
            'box',
            'user',
            'customer',

            'vendor',
            'destination',
            'terminal',
            'line',
            'facility',
            'make',
            'model',

        ];

        // Insert CRUD permissions for each entity
        foreach ($basePermissions as $basePermission) {
            Permission::firstOrCreate(['name' => 'create-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'read-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'update-' . $basePermission]);
            Permission::firstOrCreate(['name' => 'delete-' . $basePermission]);
        }

        // Additional permissions for specific roles
        $additionalPermissions = [

            //system admin
            'view-admin-dashboard',
            'for-SystemAdmin-manage-users',
            'for-SystemAdmin-manage-roles-permissions',

            //customer
            'for-customer-view-dashboard',
            // 'for-customer-my-products-report',
            // 'for-customer-make-release-repuest',



        ];

        // Create additional permissions
        foreach ($additionalPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        //----------------------------------------------------------------------------------------------------------------

        // Define roles
        $SystemAdminRole = Role::firstOrCreate(['name' => 'SystemAdmin']);
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);
        $AccountantRole = Role::firstOrCreate(['name' => 'Accountant']);


        //----------------------------------------------------------------------------------------------------------------


        //System admin

        $permissionsForSystemAdmin = Permission::whereNotIn('name', [
            'for-customer-view-dashboard',
        ])->get();

        // Assign the filtered permissions to the SystemAdmin role
        $SystemAdminRole->syncPermissions($permissionsForSystemAdmin);

        // Assign SystemAdmin role to a specific user (you can adjust the user id)
        $systemAdminUser = User::find(1);  // assuming user with ID 1 is SystemAdmin
        if ($systemAdminUser) {
            $systemAdminUser->assignRole('SystemAdmin');
        }



        //----------------------------------------------------------------------------------------------------------------



        // Manually assign specific permissions to the 'admin' role

        $adminPermissions = [

            'view-admin-dashboard',

            // Main CRUD permissions
            'create-box',
            'read-box',
            'update-box',
            "delete-box",



        ];
        $adminRole->syncPermissions($adminPermissions);


        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'data entry' role



        $AccountantPermissions = [

        ];
        $AccountantRole->syncPermissions($AccountantPermissions);



        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'customer' role


        $customerPermissions = [

            "for-customer-view-dashboard",

        ];
        $customerRole->syncPermissions($customerPermissions);





    }





}
