<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;


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




//--------------------------------------------------------------------------------------------- Top permissions



//--------------------------------------------------------------------------------------------- Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updateProfileImage'])->name('profile.update-photo');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
//---------------------------------------------------------------------------------------------

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/transportation.php';
require __DIR__.'/carbill.php';
require __DIR__.'/box.php';
require __DIR__.'/customer.php';
require __DIR__.'/customerDashboard.php';
