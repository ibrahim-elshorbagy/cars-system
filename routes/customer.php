<?php

use App\Http\Controllers\Admin\Customer\CustomerController;
use App\Http\Controllers\Customer\ReportController;
use App\Http\Controllers\Customer\StockReleaseOrderController;
use App\Http\Controllers\Product\CategoryController;
use Illuminate\Support\Facades\Route;


//--------------------------------------------------------------------------------------------- customers

// Create customer routes with permission checks
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
