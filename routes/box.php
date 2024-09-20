<?php


// use App\Http\Controllers\Product\ModelController;

use App\Http\Controllers\Admin\Box\BoxController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



//--------------------------------------------------------------------------------------------- Box

Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:create-box']], function () {
        Route::post('/box', [BoxController::class, 'store'])->name('box.store');
    });

    Route::group(['middleware' => ['permission:read-box']], function () {
        Route::get('/box', [BoxController::class, 'index'])->name('box.index');
    });

    Route::group(['middleware' => ['permission:update-box']], function () {
        Route::put('/box/{box}', [BoxController::class, 'update'])->name('box.update');
    });

    Route::group(['middleware' => ['permission:delete-box']], function () {
        Route::delete('/box/{box}', [BoxController::class, 'destroy'])->name('box.destroy');
    });

});

