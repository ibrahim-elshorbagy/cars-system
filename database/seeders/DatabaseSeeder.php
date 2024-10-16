<?php

namespace Database\Seeders;

use App\Models\Admin\Box\Box;
use App\Models\Admin\Transportation\ShipStatus;
use App\Models\User;
use CarSeeder;
use Database\Seeders\Admin\SiteSetting\SettingSeeder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Database\Seeders\Admin\Transportation\VendorSeeder;
use Database\Seeders\Admin\Transportation\DestinationSeeder;
use Database\Seeders\Admin\Transportation\TerminalSeeder;
use Database\Seeders\Admin\Transportation\LineSeeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {



        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(SettingSeeder::class);
        $this->call(VendorSeeder::class);
        $this->call(DestinationSeeder::class);
        $this->call(TerminalSeeder::class);
        $this->call(LineSeeder::class);
        $this->call(ShippingFeeTypesSeeder::class);
        $this->call(ShippingFeeTypesSeeder::class);

        //admin
        $user = User::factory()->create([
            'id'=>1,
            'user_name' => 'a',
            'name' => 'System Admin',
            'email' => 'a@a.a',
            'password' =>Hash::make('a'),
        ]);

        $user->assignRole('admin');

        $user = User::factory()->create([
            'user_name' => 'ibrahim',
            'name' => 'c ',
            'email' => 'c@c.c',
            'password' =>Hash::make('c'),
        ]);
        $user->customer()->create([
            'customer_company' => 'شركه العالميه',
        ]);
        $user->assignRole('customer');



        //---------------------------------------------

          DB::table('makes')->insert([
            ["id"=>1,'name' => 'Toyota'],
            ]);

         DB::table('models')->insert([
            ['name' => 'Corolla', 'make_id' => 1],  // Assuming Toyota's ID is 1
        ]);

        DB::table('cars')->insert([
            [
                'color' => 'Red',
                'year' => '2020',
                'chassis' => '1HGCM82633A123456',

                // Foreign keys
                'user_id' => 2,
                'make_id' => 1,
                'model_id' => 1,

                'created_by' => 1,
                'updated_by' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        DB::table('bills')->insert([
            [
                'car_id' => 1,
                'user_id' => 2,
                'won_price' => 0,
                'shipping_cost' => 0,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        //---------------------------------------------
        Box::create(
            [
                'id' => 1,
                'name'=>'الصندوق الاساسي'
            ]
        );
        Box::create(
            [
                'id' => 2,
                'name'=>'الصندوق الثانوي'
            ]
        );
                Box::create(
            [
                'id' => 3,
                'name'=>'االحمداني'
            ]
        );
        //---------------------------------------------




    $statuses = [
            ['id' => 1, 'name' => 'Purchased'],
            ['id' => 2, 'name' => 'Payment done'],
            ['id' => 3, 'name' => 'Dispached'],
            ['id' => 4, 'name' => 'Picked up'],
            ['id' => 5, 'name' => 'At warehouse'],
            ['id' => 6, 'name' => 'Loading'],
            ['id' => 7, 'name' => 'Booked'],
            ['id' => 8, 'name' => 'Shipped'],
            ['id' => 9, 'name' => 'Delivered'],
        ];


        // Seed the ship statuses into the database
        foreach ($statuses as $status) {
            ShipStatus::updateOrCreate(['id' => $status['id']], $status);
        }

        //---------------------------------------------

        $ports = [
            ['name' => 'Port of Alexandria'],
            ['name' => 'Port of Suez'],
            ['name' => 'Port of Damietta'],
        ];

        DB::table('ports')->insert($ports);

        // Insert Cities with corresponding Port IDs
        $cities = [
            ['name' => 'Alexandria', 'code' => 'ALX', 'port_id' => 1],
            ['name' => 'Suez', 'code' => 'SUZ', 'port_id' => 2],
            ['name' => 'Damietta', 'code' => 'DAM', 'port_id' => 3],
        ];

        DB::table('cities')->insert($cities);
        //---------------------------------------------

    }
}
