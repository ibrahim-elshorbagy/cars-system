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

            // ------------------------------ Admin CRUD ------------------------------

            'user',
            'customer',
            'customer-credit',

            'box',
            'box-transfer',

            'vendor',
            'destination',
            'terminal',
            'line',
            'facility',
            'make',
            'model',

            'car',
            'billPayment',

            // ------------------------------ End Admin CRUD ------------------------------


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

            //Only System Admin
            //permisions
            'view-admin-dashboard',
            'for-SystemAdmin-manage-roles-permissions',

            //Reports
            'read-box-transaction', //موجودات الصندوق

            //Site settings
            'for-SystemAdmin-manage-site-settings',

            //customer
            'for-customer-view-dashboard',
            'read-my-cars',
            'read-my-credits',
            'read-my-bills',

            //bills
            'read-bill',
            'customers-bills', //customers bills  report
            'reverse-customer-credit',
        ];

        // Create additional permissions
        foreach ($additionalPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        //----------------------------------------------------------------------------------------------------------------

        // Define roles
        $SystemAdminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);
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

        // Manually assign specific permissions to the 'data entry' role



        $AccountantPermissions = [
            'view-admin-dashboard',
        ];
        $AccountantRole->syncPermissions($AccountantPermissions);



        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'customer' role


        $customerPermissions = [

            "for-customer-view-dashboard",
            'read-my-cars',
            'read-my-credits',
            'read-my-bills',


        ];
        $customerRole->syncPermissions($customerPermissions);


        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'customer' role


        $userPermissions = [

            "view-admin-dashboard",

        ];
        $userRole->syncPermissions($userPermissions);


    }





}
