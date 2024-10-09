<?php


// use App\Http\Controllers\Product\ModelController;

use App\Http\Controllers\Admin\CarBill\Bill\BillController;
use App\Http\Controllers\Admin\CarBill\Car\CarController;
use Illuminate\Support\Facades\Route;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

//--------------------------------------------------------------------------------------------- Cars

Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:create-car']], function () {
        Route::post('/car', [CarController::class, 'store'])->name('car.store');
    });

    Route::group(['middleware' => ['permission:read-car']], function () {
        Route::get('/car', [CarController::class, 'index'])->name('car.index');
        Route::get('/car/show/{car}', [CarController::class, 'show'])->name('car.show');
    });

    Route::group(['middleware' => ['permission:update-car']], function () {
        Route::put('/car/update/{car}', [CarController::class, 'update'])->name('car.update');  //create car + bill
    });

    Route::group(['middleware' => ['permission:delete-car']], function () {
        Route::delete('/car/delete/{car}', [CarController::class, 'destroy'])->name('car.destroy'); //destroy car + No bill destory
    });

});


//--------------------------------------------------------------------------------------------- Bill Payments

Route::group(['prefix' => 'admin/bills'], function () {

    Route::group(['middleware' => ['permission:read-bill']], function () {

        Route::get('/bill-Payments', [BillController::class, 'index'])->name('bill-payment.index');

    });

    Route::group(['middleware' => ['permission:create-billPayment']], function () {
        Route::post('/bill-Payment', [BillController::class, 'store'])->name('bill-payment.store');
    });

    Route::group(['middleware' => ['permission:update-billPayment']], function () {
        Route::put('/bill-Payment/update/{payment}', [BillController::class, 'update'])->name('bill-payment.update');
    });

    Route::group(['middleware' => ['permission:delete-billPayment']], function () {
        Route::delete('/bill-Payment/delete/{payment}', [BillController::class, 'destroy'])->name('bill-payment.destroy');
    });


    Route::group(['middleware' => ['permission:customers-bills']], function () {

        Route::get('/report/customers-bills/', [BillController::class, 'CustomersBills'])->name('customers-bills.index');
        Route::get('/report/customers-bills/{user}/Details', [BillController::class, 'BillsDetails'])->name('customers-bills.details');
        Route::get('/report/customers-bills/{user}/Details/print', [BillController::class, 'BillsDetailsPrint'])->name('customers-bills.details-print');

    });
});
//--------------------------------------------------------------------------------------------- For  Cars to Get THe car info with VIN


Route::post('/api/get-car-info', function (Request $request) {
    $vin = $request->input('vin');

    if (empty($vin)) {
        return response()->json(['success' => false, 'message' => 'VIN is required.'], 400);
    }
    try {
        $postData = [
            'format' => 'json',
            'data' => $vin,
        ];

        // Send the request to the VIN decoding API with SSL verification disabled
        $response = Http::asForm()
            ->withoutVerifying()  // Disable SSL verification temporarily
            ->post('https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVINValuesBatch/', $postData);

        if ($response->failed()) {

            return response()->json(['success' => false, 'message' => 'Failed to retrieve data from VIN API.'], 500);
        }

        $data = $response->json();

        if (!isset($data['Results']) || empty($data['Results'])) {
            return response()->json(['success' => false, 'message' => 'No results found for the provided VIN.'], 404);
        }

        $fields = ["VIN", "ModelYear", "Make", "Model"];
        $return = [];
        $keys = array_flip($fields);
        foreach ($data["Results"] as $dataset) {
            $isolated = array_intersect_key($dataset, $keys);
            $sorted = array_replace($keys, $isolated);
            $return[] = $sorted;
        }

        return response()->json(['success' => true, 'response' => $return]);
    } catch (\Exception $e) {

        return response()->json(['success' => false, 'message' => 'Server error while processing VIN.'], 500);
    }
})->name('get-car-info');

