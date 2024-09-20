<?php

namespace Database\Seeders\Admin\Transportation;

use App\Models\Admin\Transportation\Destination;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $destinations = [
            ['id' => 1, 'name' => 'Aqaba Jordan'],
            ['id' => 2, 'name' => 'Mersin Turkey'],
            ['id' => 3, 'name' => 'Iraq (Erbil)'],
            ['id' => 4, 'name' => 'Iraq (Baghdad)'],
            ['id' => 5, 'name' => 'Iraq (Kirkuk)'],
            ['id' => 6, 'name' => 'Iraq- Basrah'],
            ['id' => 7, 'name' => 'Jebel Ali UAE'],
            ['id' => 8, 'name' => 'Iraq (Duhok)'],
            ['id' => 9, 'name' => 'USA'],
            ['id' => 10, 'name' => 'Zarqa - Free Zone'],
            ['id' => 11, 'name' => 'Georgia'],
            ['id' => 12, 'name' => 'Oman -Muscat'],
        ];

        foreach ($destinations as $destination) {
            Destination::create($destination);
        }
    }
}
