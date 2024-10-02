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



class CustomerCreditController extends Controller
{
    public function index(){

            $customers = User::role('customer')->with('customer')->select('id','name')->get();
            $boxes = Box::all();
            $query = CustomerCredit::query()->with('user');

            if (request("name")) {
                $query->whereHas('user.customer', function($q) {
                    $q->where("customer_company", "like", "%" . request("name") . "%");
                });
            }
            $records = $query->orderBy('created_at','desc')->paginate(25)->onEachSide(1);

            return inertia("Admin/Customer/CustomerCredit/Index", [
                "records" => CustomerCreditResource::collection($records),
                'customers'=>CustomerResource::collection($customers),
                'boxes'=>$boxes,
                'success' => session('success'),
                'danger'=>session('danger'),

        ]);

    }

    public function show(CustomerCredit $record){

        $record->with('user');

        return inertia("Admin/Customer/CustomerCredit/Show",
            [
                'record'=>new CustomerCreditResource($record),
            ]
        );
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

            $data['description'] = "تم خصم المبلغ " . $data['used_credit']. " $ ". " من " . $customer_company . " نتيجه عمليه رصيد عكسيه ";
            $data['created_by']=Auth::user()->id;
            CustomerCredit::create($data);

            BoxTransaction::create([
                'box_id' => $data['box_id'],
                'outcome' => $data['used_credit'],
                'description' => 'تم خصم ' . $data['used_credit']. " $ " . ' من ' . $customer_company . ' نتيجه عمليه رصيد عكسيه ',
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



    // public function update(Request $request, CustomerCredit $record)//we won't use it
    // {
    //     // Validate the request
    //     $rules = [
    //         'user_id' => ['required'],
    //         'added_credit' => ['required', 'numeric', 'min:1'],
    //     ];

    //     if (!Auth::user()->hasRole('Accountant')) {
    //         $rules['box_id'] = 'required|exists:boxes,id';
    //     }

    //     $data = $request->validate($rules);

    //     // If the user has the Accountant role, set their specific box_id
    //     if (Auth::user()->hasRole('Accountant')) {
    //         $data['box_id'] = Auth::user()->accountant->box_id;

    //         // Check if the user's box_id matches the record's box_id
    //         if ($record->box_id !== Auth::user()->accountant->box_id) {
    //             return back()->with('danger', 'ليس لديك الصلاحية لتعديل هذا الرصيد.');
    //         }
    //     }

    //         if ($record->used_credit > 0) {
    //             return back()->with('danger', ' لا يمكن تعديل خصم رصيد');
    //         }
    //     // Start a transaction
    //     DB::beginTransaction();

    //     try {
    //         // Clone the old record to preserve the original values
    //         $oldRecord = clone $record;

    //         // Get the name of the customer to whom the new credit is being added
    //         $to_customer_name = User::find($data['user_id'])->name;

    //         // Create a BoxTransaction for the income (addition) to the new box and new customer
    //         BoxTransaction::create([
    //             'box_id' => $data['box_id'],
    //             'income' => $data['added_credit'],
    //             'description' => ' تم اضافة الرصيد ' . $data['added_credit'] . ' إلى العميل ' . $to_customer_name . " نتيجة عملية تعديل رصيد ",
    //             'created_by' => Auth::user()->id,
    //         ]);

    //         // Update the description and the record itself
    //         $data['description'] = " تم اضافة المبلغ " . $data['added_credit'];
    //         $data['updated_by']=Auth::user()->id;
    //         $record->update($data);




    //         // Get the name of the customer from whom the credit is being removed (from the old record)
    //         $from_customer_name = User::find($oldRecord->user_id)->name;

    //         // Create a BoxTransaction for the outcome (removal) from the old box and old user
    //         BoxTransaction::create([
    //             'box_id' => $oldRecord->box_id,
    //             'outcome' => $oldRecord->added_credit,
    //             'description' => 'تم خصم الرصيد ' . $oldRecord->added_credit . ' من العميل ' . $from_customer_name . " نتيجة عملية تعديل رصيد ",
    //             'created_by' => Auth::user()->id,

    //         ]);
    //         // Commit the transaction if everything is successful
    //         DB::commit();

    //         // Return a success message
    //         return back()->with('success', "تم تحديث الرصيد بنجاح");

    //     } catch (\Exception $e) {
    //         // Rollback the transaction in case of any failure
    //         DB::rollBack();


    //         return back()->with('danger', 'حدث خطأ أثناء تحديث الرصيد: ' . $e->getMessage());
    //     }
    // }







    // public function destroy(CustomerCredit $record) //we won't use it
    // {
    //     if ($record->used_credit > 0) {
    //             return back()->with('danger', ' لا يمكن حذف خصم رصيد');
    //         }

    //       DB::beginTransaction();


    //     try {
    //     $from_customer_name = User::find($record->user_id)->name;

    //     BoxTransaction::create([  //first outcome for the box and  user
    //         'box_id' => $record->box_id,
    //         'outcome'=> $record->added_credit,
    //         'description'=> ' تم خصم الرصيد ' . $record->added_credit . ' من الصندوق نتيجه عمليه حذف رصيد من ' . $from_customer_name
    //     ]);
    //     $record->delete();

    //         DB::commit();

    //     return back()->with('success', "تم حذف الرصيد بنجاح");
    //     }
    //      catch (\Exception $e) {
    //         // Rollback the transaction in case of any failure
    //         DB::rollBack();


    //         return back()->with('danger', ' حدث خطأ أثناء حذف رصيد عميل : ' . $e->getMessage());
    //     }
    // }

}
