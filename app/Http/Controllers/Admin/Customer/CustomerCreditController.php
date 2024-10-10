<?php

namespace App\Http\Controllers\Admin\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Customer\CustomerCreditResource;
use App\Models\Admin\Box\Box;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\Box\BoxTransaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


use App\Http\Resources\Admin\CarBill\Car\CustomerResource;
use App\Http\Resources\Admin\Customer\CustomerBalanceIndexResource;
use App\Http\Resources\Admin\Customer\CustomerCreditShowResource;

class CustomerCreditController extends Controller
{
    public function index(){
        // Build the initial query
        $query = User::role('customer')
            ->select('id', 'name')
            ->with('customer')
            ->withSum('credits as added_credit', 'added_credit')
            ->withSum('credits as used_credit', 'used_credit');

        // Apply conditional filtering based on the 'name' parameter
        if ($name = request("name")) {
            $query->whereHas('customer', function($q) use ($name) {
                $q->where("customer_company", "like", "%" . $name . "%");
            });
        }

        // Execute the query with pagination
        $customers = $query->paginate(25)->onEachSide(1);

        // Return the paginated and filtered customers to the view
        return inertia("Admin/Customer/CustomerCredit/Index", [
            'customers' => CustomerBalanceIndexResource::collection($customers),
            'queryParams' => request()->query() ?: null,

        ]);
    }

    public function indexRecords(User $customer){

            $customer->select('id','name')->with('customer')->get();
            $boxes = Box::all();
            $query = CustomerCredit::query()->where('user_id', $customer->id)->with('user');

            $records = $query->orderBy('created_at','asc')->paginate(25)->onEachSide(1);

            return inertia("Admin/Customer/CustomerCredit/indexRecords", [
                "records" => CustomerCreditResource::collection($records),
                'customer'=>$customer,
                'boxes'=>$boxes,



        ]);

    }

    public function show(CustomerCredit $record)
    {
        // Load the user relation for the current record
        $record->load('user');

        // Calculate the sum of `added_credit` and `used_credit` before the current record
        $initialBalance = CustomerCredit::where('user_id', $record->user_id)
            ->where('created_at', '<', $record->created_at)
            ->selectRaw('SUM(added_credit) - SUM(used_credit) as balance')
            ->value('balance') ?? 0;
        // Pass the calculated balance to the resource
        return inertia("Admin/Customer/CustomerCredit/Show", [
            'record' => new CustomerCreditShowResource($record, $initialBalance),
        ]);
    }


    public function store(Request $request) {
        // Validate the request
        $rules = [
            'user_id' => ['required'],
            'added_credit' => ['required', 'numeric', 'min:1'],
        ];

        if (!Auth::user()->hasRole('Accountant')) {
            $rules['box_id'] = 'required|exists:boxes,id';
        }

        $data = $request->validate($rules);

        // If the user has the Accountant role, set their specific box_id
        if (Auth::user()->hasRole('Accountant')) {
            $data['box_id'] = Auth::user()->accountant->box_id;
        }

        // Begin the database transaction
        DB::beginTransaction();

        try {

            // Create the CustomerCredit record
            $data['created_by']=Auth::user()->id;
            $data['description'] = "تم اضافه المبلغ " . $data['added_credit'] . " $ ";

            CustomerCredit::create($data);

            // Fetch customer name
            $customer_company = User::find($data['user_id'])->customer->customer_company;

            // Create a BoxTransaction record
            BoxTransaction::create([
                'box_id' => $data['box_id'],
                'income' => $data['added_credit'],
                'description' => 'تم اضافه رصيد ' . $data['added_credit'] . " $ ". ' الي العميل ' . $customer_company,
                'created_by' => Auth::user()->id,
            ]);

            // Commit the transaction after successful operations
            DB::commit();

            // Return success message
            return back()->with('success', "تم اضافة الرصيد بنجاح");

        } catch (\Exception $e) {

            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء إضافة الرصيد: ' . $e->getMessage());
        }
    }


    public function reverse(Request $request) {
        // Validate the request
        $rules = [
            'user_id' => ['required'],
            'used_credit' => ['required', 'numeric', 'min:1'],
            'description' => ['nullable', 'string'],
        ];

        if (!Auth::user()->hasRole('Accountant')) {
            $rules['box_id'] = 'required|exists:boxes,id';
        }

        $data = $request->validate($rules);
        // Prepare the description field

        // If the user has the Accountant role, set their specific box_id
        if (Auth::user()->hasRole('Accountant')) {
            $data['box_id'] = Auth::user()->accountant->box_id;
        }

        // Fetch the box transactions to check the available balance
        $box = BoxTransaction::where('box_id', $data['box_id'])
            ->selectRaw('SUM(income) - SUM(outcome) as balance')
            ->first();
            $boxBalance = $box->balance ?? 0;

        // Check if the box has enough balance for the requested used_credit
        if ($boxBalance < $data['used_credit']) {
            return back()->withErrors([
                'box_balance' => 'الصندوق لا يحتوي على أموال كافية لتنفيذ العملية.'
            ]);
        }

        // Begin the database transaction
        DB::beginTransaction();

        try {
            // Create the CustomerCredit record
            $customer_company = User::find($data['user_id'])->customer->customer_company;

            $data['description'] = "تم خصم المبلغ " . $data['used_credit']. " $ ". " من " . $customer_company . " نتيجه عمليه رصيد عكسيه " . " , " . $data['description'];
            $data['created_by']=Auth::user()->id;
            CustomerCredit::create($data);

            BoxTransaction::create([
                'box_id' => $data['box_id'],
                'outcome' => $data['used_credit'],
                'description' => 'تم خصم ' . $data['used_credit']. " $ " . ' من ' . $customer_company . ' نتيجه عمليه رصيد عكسيه ' . " , " . $data['description'],
                'created_by' => Auth::id(),

            ]);

            // Commit the transaction after successful operations
            DB::commit();

            // Return success message
            return back()->with('success', "تم خصم الرصيد بنجاح");

        } catch (\Exception $e) {

            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء خصم الرصيد: ' . $e->getMessage());
        }
    }


}
