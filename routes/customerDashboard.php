<?php

use App\Http\Controllers\Customer\CustomerDashboardController;
use Illuminate\Support\Facades\Route;


//--------------------------------------------------------------------------------------------- customers CRUD

Route::group(['prefix' => 'Customer/Dashboard'], function () {

    Route::group(['middleware' => ['permission:read-my-cars']], function () {
        Route::get('/cars', [CustomerDashboardController::class, 'CarsIndex'])->name('customer-my-cars.index');
        Route::get('/cars/show/{car}', [CustomerDashboardController::class, 'CarShow'])->name('customer-my-car.show');

    });

    Route::group(['middleware' => ['permission:read-my-credits']], function () {
        Route::get('/credits', [CustomerDashboardController::class, 'CreditsIndex'])->name('customer-my-credits.index');
    });

    Route::group(['middleware' => ['permission:read-my-bills']], function () {
        Route::get('/bills', [CustomerDashboardController::class, 'BillsIndex'])->name('customer-my-bills.index');
    });

});
