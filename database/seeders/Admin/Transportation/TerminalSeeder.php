<?php

namespace Database\Seeders\Admin\Transportation;

use App\Models\Admin\Transportation\Terminal;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TerminalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $terminals = [
            ['id' => 2, 'name' => 'NEWARK NJ A'],
            ['id' => 3, 'name' => 'Savannah GA'],
            ['id' => 4, 'name' => 'Houston TX'],
            ['id' => 5, 'name' => 'COMPTON CA'],
            ['id' => 6, 'name' => 'Seattle WA'],
            ['id' => 7, 'name' => 'Miami FL'],
            ['id' => 8, 'name' => 'Toronto ON'],
            ['id' => 9, 'name' => 'Montreal QC'],
            ['id' => 10, 'name' => 'None'],
            ['id' => 11, 'name' => 'Jacksonville FL'],
            ['id' => 12, 'name' => 'Mersin'],
            ['id' => 13, 'name' => 'Iskenderun'],
            ['id' => 14, 'name' => 'USA'],
            ['id' => 15, 'name' => 'Oakland CA'],
            ['id' => 16, 'name' => 'NEWARK NJ B'],
            ['id' => 17, 'name' => 'NEWARK NJ C'],
            ['id' => 18, 'name' => 'DUBAI-JEBEL ALI'],
            ['id' => 19, 'name' => 'Chicago IL'],
            ['id' => 20, 'name' => 'French'],
            ['id' => 21, 'name' => 'Auckland New Zealand'],
            ['id' => 22, 'name' => 'Auckland Netherlands NZ'],
            ['id' => 23, 'name' => 'Australia VIC'],
        ];

        foreach ($terminals as $terminal) {
            Terminal::create($terminal);
        }
    }

}
