<?php

namespace Database\Seeders;


use App\Models\User;
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

        $user->assignRole('SystemAdmin');


    }
}
