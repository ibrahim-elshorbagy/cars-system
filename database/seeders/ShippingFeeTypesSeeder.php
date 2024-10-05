<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingFeeTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shippingFeeTypes = [
            ['name' => 'Shipping Costs', 'ar_name' => 'تكاليف الشحن'],
            ['name' => 'Port Fees', 'ar_name' => 'رسوم الميناء'],
            ['name' => 'Insurance', 'ar_name' => 'التأمين'],
            ['name' => 'Storage Costs', 'ar_name' => 'تكاليف التخزين'],
            ['name' => 'Customs Duties', 'ar_name' => 'المعاملات الجمركية'],
            ['name' => 'Container Packing', 'ar_name' => 'تعبئة الحاويات'],
            ['name' => 'Documentation Costs', 'ar_name' => 'تكاليف الوثائق'],
            ['name' => 'Inspection Fees', 'ar_name' => 'رسوم الفحص'],
            ['name' => 'Logistics Fees', 'ar_name' => 'رسوم الخدمات اللوجستية'],
            ['name' => 'Inland Transportation Costs', 'ar_name' => 'تكاليف النقل الداخلي'],
            ['name' => 'Handling Fees', 'ar_name' => 'رسوم المعالجة'],
        ];

        DB::table('shipping_fee_types')->insert($shippingFeeTypes);

    }
}
