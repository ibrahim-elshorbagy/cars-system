<?php

namespace Database\Seeders\Admin\Transportation;

use App\Models\Admin\Transportation\Vendor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $vendors = [
            ['id' => 1, 'name' => 'COPART'],
            ['id' => 2, 'name' => 'IAAI'],
            ['id' => 3, 'name' => 'MANHEIM'],
            ['id' => 4, 'name' => 'TRA AUCTIONS'],
            ['id' => 5, 'name' => 'Impact'],
            ['id' => 6, 'name' => 'Adesa'],
            ['id' => 7, 'name' => 'Berpa'],
            ['id' => 8, 'name' => 'Jordan (Free Zone)'],
            ['id' => 9, 'name' => 'Turkey (Mersin)'],
            ['id' => 10, 'name' => 'Turkey (Iskenderun)'],
            ['id' => 11, 'name' => 'Bel Air Auto'],
            ['id' => 12, 'name' => 'EDGE PIPELINE'],
            ['id' => 13, 'name' => 'Ritchie Bros'],
        ];

        foreach ($vendors as $vendor) {
            Vendor::create($vendor);
        }
    }

}
