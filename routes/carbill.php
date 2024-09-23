<?php


// use App\Http\Controllers\Product\ModelController;

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
        Route::put('/car/update/{car}', [CarController::class, 'update'])->name('car.update');
    });

    Route::group(['middleware' => ['permission:delete-car']], function () {
        Route::delete('/car/delete/{car}', [CarController::class, 'destroy'])->name('car.destroy');
    });

});

//--------------------------------------------------------------------------------------------- Cars

