<?php

namespace App\Http\Controllers\Admin\Box;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Box\BoxTransactionResource;
use App\Models\Admin\Box\Box;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BoxTransactionController extends Controller
{
    public function index()
    {
        $query = Box::query();

        // If box filter is applied
        if (request('box') ) {
            $query->where('id', request('box'));
        }

        // If the user is an accountant, restrict to their box
        if (Auth::user()->hasRole('Accountant')) {
            $box_id = Auth::user()->accountant->box_id;
            $query->where('id', $box_id);
        }

        // Get the selected box with paginated transactions
        $box = $query->with(['transactions' => function ($q) {
            $q->orderBy('created_at', 'desc');
        }])->firstOrFail();

        // Paginate transactions for this box
        $paginatedTransactions = $box->transactions()->orderBy('created_at', 'desc')->paginate(25);

        // Get all boxes for dropdown
        $boxeslist = Box::all();

        // Pass the box, paginated transactions, and boxes list to the view
        return inertia("Admin/Box/Transactions/Index", [
            "box" => new BoxTransactionResource($box, $paginatedTransactions), // Pass the resource
            'boxeslist' => $boxeslist,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }





}
