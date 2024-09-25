<?php

use App\Http\Controllers\Admin\Customer\CustomerController;
use App\Http\Controllers\Admin\Customer\CustomerCreditController;
use App\Http\Controllers\Customer\ReportController;
use App\Http\Controllers\Customer\StockReleaseOrderController;
use App\Http\Controllers\Product\CategoryController;
use Illuminate\Support\Facades\Route;


//--------------------------------------------------------------------------------------------- customers CRUD

Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:create-customer']], function () {
        Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');
    });

    Route::group(['middleware' => ['permission:read-customer']], function () {
        Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    });

    Route::group(['middleware' => ['permission:update-customer']], function () {
        Route::put('/customer/{customer}', [CustomerController::class, 'update'])->name('customer.update');
    });

    Route::group(['middleware' => ['permission:delete-customer']], function () {
        Route::delete('/customer/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');
    });


});


//--------------------------------------------------------------------------------------------- customers Credit CRUD

Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:create-customer-credit']], function () {
        Route::post('/customer-credit', [CustomerCreditController::class, 'store'])->name('customer-credit.store');
    });

    Route::group(['middleware' => ['permission:read-customer-credit']], function () {
        Route::get('/customer-credit', [CustomerCreditController::class, 'index'])->name('customer-credit.index');
    });

    Route::group(['middleware' => ['permission:reverse-customer-credit']], function () {
        Route::post('/reverse-customer-credit', [CustomerCreditController::class, 'reverse'])->name('reverse-customer-credit.store');
    });

    // Route::group(['middleware' => ['permission:update-customer-credit']], function () {
    //     Route::put('/customer-credit/{record}', [CustomerCreditController::class, 'update'])->name('customer-credit.update');
    // });

    // Route::group(['middleware' => ['permission:delete-customer-credit']], function () {
    //     Route::delete('/customer-credit/{record}', [CustomerCreditController::class, 'destroy'])->name('customer-credit.destroy');
    // });


});
