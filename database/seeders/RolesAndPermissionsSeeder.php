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
            'main-category',
            'sub-category',

            'customer',
            'warehouse',
            'stock',
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
            'for-customer-my-products-report',
            'for-customer-make-release-repuest',

            //admin or data entry  for addition-orders
            "confirme-stock-order",

            "add-stock-order",
            "all-stock-orders", //all orders
            "show-stock-order", // details about the order
            "edit-stock-order",
            "delete-stock-order",

            // Roles for release-orders
            "release-order-confirme",

            'admin-orders-index',
            'admin-orders-change-status',
            'admin-orders-make',
            "admin-orders-update",
            "admin-orders-delete",
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
        $dataEntryRole = Role::firstOrCreate(['name' => 'dataEntry']);


        //----------------------------------------------------------------------------------------------------------------


        //System admin

        $permissionsForSystemAdmin = Permission::whereNotIn('name', [
            'for-customer-view-dashboard',
            'for-customer-my-products-report',
            'for-customer-make-release-repuest',
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
            'create-main-category',
            'read-main-category',
            'update-main-category',
            "delete-main-category",

            'create-sub-category',
            'read-sub-category',
            'update-sub-category',
            "delete-sub-category",

            'create-customer',
            'read-customer',
            'update-customer',
            "delete-customer",

            'create-warehouse',
            'read-warehouse',
            'update-warehouse',
            "delete-warehouse",

            //for making addition order + confirme addition order
            "confirme-stock-order",

            "add-stock-order",
            "all-stock-orders",
            "show-stock-order",
            "delete-stock-order",
            'read-stock', //index all products

            //for making release order + confirme release order

            "release-order-confirme",

            'admin-orders-index',
            'admin-orders-change-status',
            'admin-orders-make',
            "admin-orders-update",

        ];
        $adminRole->syncPermissions($adminPermissions);


        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'data entry' role



        $dataEntryPermissions = [

            'view-admin-dashboard', //dashbaord

            //for making addition order
            "read-customer",

            "add-stock-order",
            "all-stock-orders",
            "delete-stock-order",
            "show-stock-order",
            "edit-stock-order",
            'read-stock', //index all products

            //for making release order

            'admin-orders-index',
            'admin-orders-change-status',
            'admin-orders-make',
            "admin-orders-update",

        ];
        $dataEntryRole->syncPermissions($dataEntryPermissions);



        //----------------------------------------------------------------------------------------------------------------

        // Manually assign specific permissions to the 'customer' role



        $customerPermissions = [

            "for-customer-view-dashboard",
            'for-customer-my-products-report',
            'for-customer-make-release-repuest',

        ];
        $customerRole->syncPermissions($customerPermissions);





    }





}
