<?php

use App\Http\Controllers\Admin\RolesPermissionsController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\User\UserCRUDController;




//--------------------------------------------------------------------------------------------- Only SystemAdmin
Route::group(['prefix' => 'admin'], function () {

    // Create User Route
    Route::group(['middleware' => ['permission:create-user']], function () {
        Route::post('/user', [UserCRUDController::class, 'store'])->name('user.store');
    });

    // Read Users Route
    Route::group(['middleware' => ['permission:read-user']], function () {
        Route::get('/user', [UserCRUDController::class, 'index'])->name('user.index');
    });

    // Update User Route
    Route::group(['middleware' => ['permission:update-user']], function () {
        Route::put('/user/{user}', [UserCRUDController::class, 'update'])->name('user.update');
    });

    // Delete User Route
    Route::group(['middleware' => ['permission:delete-user']], function () {
        Route::delete('/user/{user}', [UserCRUDController::class, 'destroy'])->name('user.destroy');
    });

});
//--------------------------------------------------------------------------------------------- Only SystemAdmin

Route::group(['middleware' => ['permission:for-SystemAdmin-manage-roles-permissions']], function () {
    Route::get('/admin/roles-permissions', [RolesPermissionsController::class, 'index'])->name('admin.roles-permissions.index');
    Route::get('/admin/roles-permissions/{role}/edit', [RolesPermissionsController::class, 'edit'])->name('admin.roles-permissions.edit');
    Route::put('/admin/roles-permissions/{role}', [RolesPermissionsController::class, 'update'])->name('admin.roles-permissions.update');
});
