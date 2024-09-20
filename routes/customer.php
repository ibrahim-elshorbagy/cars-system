<?php

use App\Http\Controllers\Admin\Customer\CustomerController;
use App\Http\Controllers\Customer\ReportController;
use App\Http\Controllers\Customer\StockReleaseOrderController;
use App\Http\Controllers\Product\CategoryController;
use Illuminate\Support\Facades\Route;


//--------------------------------------------------------------------------------------------- customers

// Create customer routes with permission checks
Route::group(['middleware' => ['permission:create-customer']], function () {
    Route::get('/customer/create', [CustomerController::class, 'create'])->name('customer.create');
    Route::post('/customer', [CustomerController::class, 'store'])->name('customer.store');
});

Route::group(['middleware' => ['permission:read-customer']], function () {
    Route::get('/customer', [CustomerController::class, 'index'])->name('customer.index');
    // Optional show route for viewing a single customer
});

Route::group(['middleware' => ['permission:update-customer']], function () {
    Route::get('/customer/{customer}/edit', [CustomerController::class, 'edit'])->name('customer.edit');
    Route::put('/customer/{customer}', [CustomerController::class, 'update'])->name('customer.update');
});

Route::group(['middleware' => ['permission:delete-customer']], function () {
    Route::delete('/customer/{customer}', [CustomerController::class, 'destroy'])->name('customer.destroy');
});


