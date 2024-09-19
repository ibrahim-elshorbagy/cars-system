<?php

use App\Http\Controllers\Warehouse\StockController;
use App\Http\Controllers\Warehouse\WarehouseController;
use Illuminate\Support\Facades\Route;



//--------------------------------------------------------------------------------------------- warehouses CRUD

Route::group(['middleware' => ['permission:create-warehouse']], function () {
    Route::get('/warehouse/create', [WarehouseController::class, 'create'])->name('warehouse.create');
    Route::post('/warehouse', [WarehouseController::class, 'store'])->name('warehouse.store');
});

Route::group(['middleware' => ['permission:read-warehouse']], function () {
    Route::get('/warehouse', [WarehouseController::class, 'index'])->name('warehouse.index');             //Show all warehouses
    Route::get('/warehouse/{warehouse}', [WarehouseController::class, 'show'])->name('warehouse.show');   //Show The Full List of products inside the warehouse
});

Route::group(['middleware' => ['permission:update-warehouse']], function () {
    Route::get('/warehouse/{warehouse}/edit', [WarehouseController::class, 'edit'])->name('warehouse.edit');
    Route::put('/warehouse/{warehouse}', [WarehouseController::class, 'update'])->name('warehouse.update');
});

Route::group(['middleware' => ['permission:delete-warehouse']], function () {
    Route::delete('/warehouse/{warehouse}', [WarehouseController::class, 'destroy'])->name('warehouse.destroy');
});

//--------------------------------------------------------------------------------------------- stock // addition-order the route called stock. But Relase order called order

Route::group(['middleware' => ['permission:add-stock-order']], function () {                 // make product order for admin / data entry
    Route::get('/stock/addition-order/add/{customer}', [StockController::class, 'addPage'])->name('stock.add.page');
    Route::post('/stock/addition-order/save', [StockController::class, 'addProduct'])->name('stock.add');
});

Route::group(['middleware' => ['permission:all-stock-orders']], function () {               // Show product orders for admin / data entry
    Route::get('/stock/addition-order/all-orders', [StockController::class, 'ShowAllOrders'])->name('stock.all.orders');
    Route::get('/stock/addition-order/show/{customer}/orders', [StockController::class, 'ShowOrders'])->name('stock.customer.orders');

});

Route::group(['middleware' => ['permission:show-stock-order']], function () {               // Show  order's product Details for admin / data entry

    Route::get('/stock/addition-order/show/customer/{order}/details', [StockController::class, 'ShowOrderDetails'])->name('stock.show.order');

});
Route::group(['middleware' => ['permission:edit-stock-order']], function () {        // Edit the order's products for admin / data entry

    Route::get('/stock/addition-order/edit/customer/{order}', [StockController::class, 'EditOrderPage'])->name('stock.edit.page');
    Route::put('/stock/addition-order/update/customer/{order}', [StockController::class, 'updateOrder'])->name('stock.update.order');

});

Route::group(['middleware' => ['permission:confirme-stock-order']], function () {                // Change the status of the order for admin

    Route::post('/stock/customer/order/changeStatus/{order}', [StockController::class, 'ChangeStatus'])->name('stock.change.status');

});

Route::group(['middleware' => ['permission:delete-stock-order']], function () {             // Delete the order + it's images


    Route::delete('/stock/addition-order/destory/{order}', [StockController::class, 'destroyOrder'])->name('stock.destroy.order');

});

Route::group(['middleware' => ['permission:read-stock']], function () {                     //for a customer + print the stock

    Route::get('/stock/{customer}', [StockController::class, 'showStock'])->name('customer.stock.show');
    Route::get('/stock/print/{customer}', [StockController::class, 'printAll'])->name('customer.stock.print');

});

