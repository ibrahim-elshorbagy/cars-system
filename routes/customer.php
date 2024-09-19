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


//--------------------------------------------------------------------------------------------- My Products Report

Route::group(['middleware' => ['permission:for-customer-my-products-report']], function () {
    Route::get('/customer/dashboard/my-products-report', [ReportController::class, 'MyProductRport'])->name('for-customer-my-products-report');

});

//--------------------------------------------------------------------------------------------- My Products Release Request

Route::group(['middleware' => ['permission:for-customer-make-release-repuest']], function () {

    Route::get('/customers/dashboard/release-order/add',[StockReleaseOrderController::class,'MakeReleaseOrder'])->name('customer.make-release-order');
    Route::post('/customers/dashboard/release-order/save',[StockReleaseOrderController::class,'ReleaseOrderStore'])->name('customer.store-release-order');

    Route::get('/customers/dashboard/my-release-orders',[StockReleaseOrderController::class,'MyOrders'])->name('customer.show.my-requests');

    Route::get('/customers/dashboard/release-order/edit/{id}',[StockReleaseOrderController::class,'EditReleaseOrder'])->name('customer.edit-release-order');
    Route::put('/customers/dashboard/release-order/update/{id}',[StockReleaseOrderController::class,'UpdateReleaseOrder'])->name('customer.update-release-order');

    Route::delete('/customers/dashboard/release-order/delete/{id}', [StockReleaseOrderController::class, 'destroyReleaseRequest'])->name('customer.destroy-release-order');

    Route::get('/customers/dashboard/release-order/show/{id}',[StockReleaseOrderController::class,'ShowMyorder'])->name('customer.show-release-order');

});
