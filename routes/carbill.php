<?php


// use App\Http\Controllers\Product\ModelController;

use App\Http\Controllers\Admin\CarBill\Bill\BillController;
use App\Http\Controllers\Admin\CarBill\Car\CarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



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

    });
});
