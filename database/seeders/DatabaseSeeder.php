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

        //admin
        $user = User::factory()->create([
            'id'=>1,
            'name' => 'System Admin',
            'email' => 'a@a.a',
            'password' =>Hash::make('a'),
        ]);

        $user->assignRole('admin');

        $user = User::factory()->create([
            'name' => 'ibrahim ',
            'email' => 'c@c.c',
            'password' =>Hash::make('c'),
        ]);

        $user->assignRole('customer');

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

    $statuses = [
            ['id' => 1, 'name' => 'Pending'],
            ['id' => 2, 'name' => 'Loading'],
            ['id' => 3, 'name' => 'Shipped'],
            ['id' => 4, 'name' => 'Delivered'],
            ['id' => 5, 'name' => 'Dispatch'],
            ['id' => 6, 'name' => 'Picked up'],
            ['id' => 7, 'name' => 'Booked'],
        ];

        // Seed the ship statuses into the database
        foreach ($statuses as $status) {
            ShipStatus::updateOrCreate(['id' => $status['id']], $status);
        }
    }
}
