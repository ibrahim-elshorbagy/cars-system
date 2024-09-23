<?php


// use App\Http\Controllers\Product\ModelController;

use App\Http\Controllers\Admin\Box\BoxController;
use App\Http\Controllers\Admin\Box\BoxTransactionController;
use App\Http\Controllers\Admin\Box\BoxTransferController;
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

//--------------------------------------------------------------------------------------------- transactions

Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:read-box-transaction']], function () {

        Route::get('/box/transactions', [BoxTransactionController::class, 'index'])->name('box.index.transaction');

    });


});

//--------------------------------------------------------------------------------------------- transfers
Route::group(['prefix' => 'admin'], function () {

    Route::group(['middleware' => ['permission:create-box-transfer']], function () {

        Route::post('/box-transfer', [BoxTransferController::class, 'store'])->name('box-transfer.store');

    });

    Route::group(['middleware' => ['permission:read-box-transfer']], function () {

        Route::get('/box-transfer', [BoxTransferController::class, 'index'])->name('box-transfer.index');

    });

    Route::group(['middleware' => ['permission:update-box-transfer']], function () {

        Route::put('/box-transfer/{record}', [BoxTransferController::class, 'update'])->name('box-transfer.update');

    });

    Route::group(['middleware' => ['permission:delete-box-transfer']], function () {

        Route::delete('/box-transfer/{record}', [BoxTransferController::class, 'destroy'])->name('box-transfer.destroy');

    });

});
