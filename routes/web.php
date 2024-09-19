<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Admin\User\UserCRUDController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;


//--------------------------------------------------------------------------------------------- guest

Route::get('/', function () {
    if (Auth::check()) {
        $user = Auth::user();

        if ($user->can('view-admin-dashboard')) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->can('for-customer-view-dashboard')) {
            return redirect()->route('customer.dashboard');
        }
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
})->name('/');

//--------------------------------------------------------------------------------------------- Site Essentials

Route::group(['middleware' => ['permission:view-admin-dashboard']], function () {

Route::get('admins/dashboard', [DashboardController::class, 'adminDashboard'])->middleware(['auth'])->name('admin.dashboard');

});
Route::group(['middleware' => ['permission:for-customer-view-dashboard']], function () {

Route::get('customers/dashboard', [DashboardController::class, 'CustomerDashboard'])->middleware(['auth'])->name('customer.dashboard');

});

Route::post('/change-language', [DashboardController::class, 'changeLanguage'])->name('language.change');


Route::post('/notifications/{id}/markAsRead/{order}', [DashboardController::class, 'markAsRead'])->name('notifications.markAsRead');


//--------------------------------------------------------------------------------------------- Top permissions
Route::group(['middleware' => ['permission:for-SystemAdmin-manage-users']], function () {
    Route::resource('admin/user', UserCRUDController::class);
});


//--------------------------------------------------------------------------------------------- Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updateProfileImage'])->name('profile.update-photo');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
//---------------------------------------------------------------------------------------------

require __DIR__.'/auth.php';
require __DIR__.'/product.php';
require __DIR__.'/customer.php';
require __DIR__.'/warehouse.php';
require __DIR__.'/admin.php';
