<?php

namespace Database\Seeders\Admin\SiteSetting;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            DB::table('settings')->insert([
            ['name' => 'site_name', 'value' => 'My Website'],
            ['name' => 'company_logo', 'value' => 'https://cdn-icons-png.flaticon.com/512/1023/1023757.png'],
            ['name' => 'support_email', 'value' => 'support@mywebsite.com'],
            ['name' => 'support_phone', 'value' => '+1234567890'],
            ['name' => 'site_cover', 'value' => 'https://cdn.pixabay.com/photo/2015/01/20/11/09/black-605334_1280.jpg'],
        ]);
    }
}
