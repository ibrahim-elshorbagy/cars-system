<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function changeLanguage(Request $request)
    {
        $language = $request->input('language');

        if (in_array($language, ['en', 'ar'])) {

            session(['app_locale' => $language]);

        }

        return back();
    }

    public function markAsRead($id,$order)
    {
        $user = Auth::user();

        $notification= $user->notifications()->where('id', $id)->first();

        $notification->markAsRead();

        return to_route('admin.show.order',$order);
    }



    public function AdminDashboard()
    {
        // Counting Admin and System Admin users
        $adminsAndSystemAdminsCount = User::role(['admin', 'SystemAdmin'])->count();

        // Counting Customers
        $customersCount = User::role('customer')->count();


        // Passing data to the frontend
        return inertia('Admin/Dashboard', [
            'adminsAndSystemAdminsCount' => $adminsAndSystemAdminsCount,
            'customersCount' => $customersCount,
        ]);
    }






    public function CustomerDashboard()
    {
        $userId = auth()->id();


        return inertia('Customer/Dashboard',[]);
    }



}
