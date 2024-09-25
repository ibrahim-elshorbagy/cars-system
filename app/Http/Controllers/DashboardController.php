<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Warehouse\Stock;
use App\Models\Warehouse\StockReleaseOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{

    // public function markAsRead($id,$order)
    // {
    //     $user = Auth::user();

    //     $notification= $user->notifications()->where('id', $id)->first();

    //     $notification->markAsRead();

    //     return to_route('admin.show.order',$order);
    // }



    public function AdminDashboard()
    {



        // Passing data to the frontend
        return inertia('Admin/Dashboard', [

        ]);
    }






    public function CustomerDashboard()
    {

        return inertia('Customer/Dashboard',[]);
    }



}
