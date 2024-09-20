<?php

namespace Database\Seeders\Admin\Transportation;

use App\Models\Admin\Transportation\Line;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lines = [
            ['id' => 1, 'name' => 'msc', 'line_website' => 'http://www.mscgva.ch/tracking/'],
            ['id' => 2, 'name' => 'MAERSK', 'line_website' => 'http://www.maerskline.com/appmanager/maerskline/public?_nfpb=true&_pageLabel=page_tracking3_trackSimple'],
            ['id' => 3, 'name' => 'United Arab Shipping', 'line_website' => 'http://www.uasc.net/'],
            ['id' => 4, 'name' => 'PIL', 'line_website' => 'https://www.pilship.com/en-our-track-and-trace-pil-pacific-international-lines/120.html'],
            ['id' => 5, 'name' => 'Turkon', 'line_website' => 'http://www.queenautoshipping.com'],
            ['id' => 6, 'name' => 'EVERGREEN', 'line_website' => 'http://www.shipmentlink.com/servlet/TDB1_CargoTracking.do'],
            ['id' => 7, 'name' => 'SAFMARINE ( MAERSK )', 'line_website' => 'http://mysaf2.safmarine.com/wps/portal/Safmarine/etrackUnregistered?linktype=unreg&queryorigin=Header&queryoriginauto=HeaderNonSecure&searchType=Container&searchNumberString='],
            ['id' => 8, 'name' => 'HAPAG-LLOYD', 'line_website' => 'http://www.hapag-lloyd.com/en/tracing/by_container.html'],
            ['id' => 9, 'name' => 'APL', 'line_website' => 'http://www.apl.com/wps/portal/apl'],
            ['id' => 10, 'name' => 'cosco line', 'line_website' => 'http://elines.coscoshipping.com/NewEBWeb/public/cargoTracking/cargoTracking.xhtml?token=F3523C7084EF2E820DE91455BACEF4F8&uid=&language=en&page=null'],
            ['id' => 11, 'name' => 'MOL liner', 'line_website' => 'http://cms.molpower.com/'],
            ['id' => 12, 'name' => 'ONE NETWORK EXPRESS', 'line_website' => 'https://www.one-line.com'],
            ['id' => 13, 'name' => 'CMA CGM', 'line_website' => 'https://www.cma-cgm.com/eBusiness/Tracking'],
            ['id' => 14, 'name' => 'ZIM', 'line_website' => 'https://www.zim.com'],
            ['id' => 15, 'name' => 'YANG MING', 'line_website' => 'https://www.yangming.com/'],
            ['id' => 17, 'name' => 'HMM Hyundai', 'line_website' => '#'],
            ['id' => 18, 'name' => 'CMA', 'line_website' => 'https://www.cma-cgm.com/ebusiness/tracking'],
            ['id' => 19, 'name' => 'TURKON LINE', 'line_website' => 'https://my.turkon.com/container-tracking'],
        ];

        foreach ($lines as $line) {
            Line::create($line);
        }

    }
}
