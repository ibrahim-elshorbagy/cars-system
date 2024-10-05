<?php


// use App\Http\Controllers\Product\ModelController;


use App\Http\Controllers\Admin\Transportation\VendorController;
use App\Http\Controllers\Admin\Transportation\DestinationController;
use App\Http\Controllers\Admin\Transportation\LineController;
use App\Http\Controllers\Admin\Transportation\FacilityController;
use App\Http\Controllers\Admin\Transportation\MakeController;
use App\Http\Controllers\Admin\Transportation\ModellController;
use App\Http\Controllers\Admin\Transportation\ShippingFeeTypeController;
use App\Http\Controllers\Admin\Transportation\TerminalController;
use Illuminate\Support\Facades\Route;





Route::group(['prefix' => 'admin/transportation'], function () {

//---------------------------------------------------------------------------------------------
    // Routes for Vendors (المزادات)

    Route::group(['middleware' => ['permission:create-vendor']], function () {
        Route::post('/vendor', [VendorController::class, 'store'])->name('vendor.store');
    });

    Route::group(['middleware' => ['permission:read-vendor']], function () {
        Route::get('/vendor', [VendorController::class, 'index'])->name('vendor.index');
    });

    Route::group(['middleware' => ['permission:update-vendor']], function () {
        Route::put('/vendor/{vendor}', [VendorController::class, 'update'])->name('vendor.update');
    });

    Route::group(['middleware' => ['permission:delete-vendor']], function () {
        Route::delete('/vendor/{vendor}', [VendorController::class, 'destroy'])->name('vendor.destroy');
    });

//---------------------------------------------------------------------------------------------
    // Routes for Destinations (الوجهات)

    Route::group(['middleware' => ['permission:create-destination']], function () {
        Route::post('/destination', [DestinationController::class, 'store'])->name('destination.store');
    });

    Route::group(['middleware' => ['permission:read-destination']], function () {
        Route::get('/destination', [DestinationController::class, 'index'])->name('destination.index');
    });

    Route::group(['middleware' => ['permission:update-destination']], function () {
        Route::put('/destination/{destination}', [DestinationController::class, 'update'])->name('destination.update');
    });

    Route::group(['middleware' => ['permission:delete-destination']], function () {
        Route::delete('/destination/{destination}', [DestinationController::class, 'destroy'])->name('destination.destroy');
    });

//---------------------------------------------------------------------------------------------
    // Routes for Terminal (محطات الشحن)

    Route::group(['middleware' => ['permission:create-terminal']], function () {
        Route::post('/terminal', [TerminalController::class, 'store'])->name('terminal.store');
    });

    Route::group(['middleware' => ['permission:read-terminal']], function () {
        Route::get('/terminal', [TerminalController::class, 'index'])->name('terminal.index');
    });

    Route::group(['middleware' => ['permission:update-terminal']], function () {
        Route::put('/terminal/{terminal}', [TerminalController::class, 'update'])->name('terminal.update');
    });

    Route::group(['middleware' => ['permission:delete-terminal']], function () {
        Route::delete('/terminal/{terminal}', [TerminalController::class, 'destroy'])->name('terminal.destroy');
    });

//---------------------------------------------------------------------------------------------
    // Routes for Lines (line)

    Route::group(['middleware' => ['permission:create-line']], function () {
        Route::post('/line', [LineController::class, 'store'])->name('line.store');
    });

    Route::group(['middleware' => ['permission:read-line']], function () {
        Route::get('/line', [LineController::class, 'index'])->name('line.index');
    });

    Route::group(['middleware' => ['permission:update-line']], function () {
        Route::put('/line/{line}', [LineController::class, 'update'])->name('line.update');
    });

    Route::group(['middleware' => ['permission:delete-line']], function () {
        Route::delete('/line/{line}', [LineController::class, 'destroy'])->name('line.destroy');
    });

//---------------------------------------------------------------------------------------------
    // Routes for Facilities (facility)
    Route::group(['middleware' => ['permission:create-facility']], function () {
        Route::post('/facility', [FacilityController::class, 'store'])->name('facility.store');
    });

    Route::group(['middleware' => ['permission:read-facility']], function () {
        Route::get('/facility', [FacilityController::class, 'index'])->name('facility.index');
    });

    Route::group(['middleware' => ['permission:update-facility']], function () {
        Route::put('/facility/{facility}', [FacilityController::class, 'update'])->name('facility.update');
    });

    Route::group(['middleware' => ['permission:delete-facility']], function () {
        Route::delete('/facility/{facility}', [FacilityController::class, 'destroy'])->name('facility.destroy');
    });

//---------------------------------------------------------------------------------------------
    // Routes for  (makes)
    Route::group(['middleware' => ['permission:create-make']], function () {
        Route::post('/make', [MakeController::class, 'store'])->name('make.store');
    });

    Route::group(['middleware' => ['permission:read-make']], function () {
        Route::get('/make', [MakeController::class, 'index'])->name('make.index');
    });

    Route::group(['middleware' => ['permission:update-make']], function () {
        Route::put('/make/{make}', [MakeController::class, 'update'])->name('make.update');
    });

    Route::group(['middleware' => ['permission:delete-make']], function () {
        Route::delete('/make/{make}', [MakeController::class, 'destroy'])->name('make.destroy');
    });


    //---------------------------------------------------------------------------------------------
    // Routes for  (models)
    Route::group(['middleware' => ['permission:create-model']], function () {
        Route::post('/model', [ModellController::class, 'store'])->name('model.store');
    });

    Route::group(['middleware' => ['permission:read-model']], function () {
        Route::get('/model', [ModellController::class, 'index'])->name('model.index');
    });

    Route::group(['middleware' => ['permission:update-model']], function () {
        Route::put('/model/{model}', [ModellController::class, 'update'])->name('model.update');
    });

    Route::group(['middleware' => ['permission:delete-model']], function () {
        Route::delete('/model/{model}', [ModellController::class, 'destroy'])->name('model.destroy');
    });

    //---------------------------------------------------------------------------------------------
    // Routes for  (ShippingFee)
    Route::group(['middleware' => ['permission:create-ShippingFee']], function () {
        Route::post('/ShippingFee', [ShippingFeeTypeController::class, 'store'])->name('ShippingFee.store');
    });

    Route::group(['middleware' => ['permission:read-ShippingFee']], function () {
        Route::get('/ShippingFee', [ShippingFeeTypeController::class, 'index'])->name('ShippingFee.index');
    });

    Route::group(['middleware' => ['permission:update-ShippingFee']], function () {
        Route::put('/ShippingFee/{ShippingFee}', [ShippingFeeTypeController::class, 'update'])->name('ShippingFee.update');
    });

    Route::group(['middleware' => ['permission:delete-ShippingFee']], function () {
        Route::delete('/ShippingFee/{ShippingFee}', [ShippingFeeTypeController::class, 'destroy'])->name('ShippingFee.destroy');
    });

});


