<?php

namespace App\Http\Controllers\Admin\CarBill\Bill;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Bill\StorePaymentRequest;
use App\Http\Requests\Admin\Bill\UpdatePaymentRequest;
use App\Http\Resources\Admin\CarBill\Bill\PaymentsResource;
use App\Http\Resources\Admin\CarBill\Bill\Reports\BillsDetailsResource;
use App\Http\Resources\Admin\CarBill\Bill\Reports\CustomersBillsResource;
use App\Http\Resources\Admin\CarBill\Bill\UserPaymentsResource;
use App\Models\Admin\Bill\Bill;
use App\Models\Admin\Bill\Payment;
use App\Models\Admin\Bill\PaymentBill;
use App\Models\Admin\Box\Box;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Admin\Customer\CustomerCredit;
use App\Models\Admin\Box\BoxTransaction;

class BillController extends Controller
{
    public function index()
    {

        $query = Payment::with(['box','createdBy','updatedBy'])->orderBy("id", "desc");

        // Paginate the results
        $payments = $query->paginate(25)->onEachSide(1);

        // Load customers and boxes list
       $customers = User::role('customer')
        ->select('id', 'name')
        ->with([
            'credits',
            'bills.car.model',
            'bills.car.make'
        ])
        ->get();

        $boxeslist = Box::all();

        // Return data to the frontend
        return inertia("Admin/CarBill/Bill/Index", [
            'customers' => UserPaymentsResource::collection($customers),
            'boxeslist' => $boxeslist,

            "payments" => PaymentsResource::collection($payments),

            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),
        ]);
    }


    public function store(StorePaymentRequest $request) {
        // Validate the request
        $data = $request->validated();

        // Begin the transaction
        DB::beginTransaction();

        try {

            $customer_company = User::find($data['customer_id'])->customer->customer_company;

        $data['description'] = " تم خصم المبلغ " . $data['total_used'] . " $ " . " من العميل " . $customer_company ." نتيجه عملية تسديد ذمم "; ;

            CustomerCredit::create([
                'user_id'=> $data['customer_id'],
                'used_credit'=> $data['total_used'],
                'description'=> $data['description'],
                'box_id'=> $data['box_id'],
                'created_by'=>Auth::user()->id,
            ]);

            // If the user has the Accountant role, set their specific box_id
            if (Auth::user()->hasRole('Accountant')) {
                $data['box_id'] = Auth::user()->accountant->box_id;
            }
            // Store the full payment transaction in `payments`
            $payment = Payment::create([
                'user_id' => $data['customer_id'],
                'total_amount' => $data['total_used'],
                'box_id' => $data['box_id'],
                'created_by'=>Auth::user()->id,
            ]);

            // Store individual bill payments in `bill_payments`
            foreach ($data['payments'] as $paymentData) {
                // If there's a won_price_payment, add it to the payment_bills table
                if ($paymentData['won_price_payment'] > 0) {
                    PaymentBill::create([
                        'bill_id' => $paymentData['bill_id'],
                        'payment_id' => $payment->id,
                        'won_price_amount' => $paymentData['won_price_payment'],
                        'shipping_cost_amount' =>  $paymentData['shipping_cost_payment'],
                    ]);
                }
            }

            // Commit the transaction
            DB::commit();

            // Return success message
            return back()->with('success', "تم تسديد الذمم بنجاح");

        } catch (\Exception $e) {
            // Rollback if there's an error
            DB::rollBack();
            return back()->with('danger', 'حدث خطأ أثناء تسديد الذمم: ' . $e->getMessage());
        }

    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $data = $request->validated();

        // If the user has the Accountant role, set their specific box_id
        if (Auth::user()->hasRole('Accountant')) {
            $data['box_id'] = Auth::user()->accountant->box_id;
        }

        // Start a transaction
        DB::beginTransaction();

        try {

            // Get the name of the customer new credit is being Return And then take from him

            $customer_company = User::find($data['customer_id'])->customer->customer_company;

            // Create a CustomerCredit used_credit he takes
            CustomerCredit::create([
                'user_id'=> $data['customer_id'],
                'box_id' => $data['box_id'],
                'used_credit' => $data['total_used'],
                'description' => 'تم خصم الرصيد ' . $data['total_used'] . " $ ". ' من العميل ' . $customer_company . " نتيجة عملية تعديل تسديد ذمم  ",
                'created_by' => Auth::user()->id,

            ]);


            // Create a CustomerCredit for retun all credit then take the new value
            CustomerCredit::create([
                'user_id'=> $data['customer_id'],
                'box_id' => $data['box_id'],
                'added_credit' => $payment->total_amount,
                'description' => ' تم اضافة الرصيد ' . $payment->total_amount . " $ ". ' إلى العميل ' . $customer_company . " نتيجة عملية تعديل تسديد ذمم  ",
                'created_by' => Auth::user()->id,
            ]);

            // Update the payment total amount and box_id
            $data['updated_by']=Auth::user()->id;

            $payment->update([
                'total_amount' => $data['total_used'],
                'box_id' => $data['box_id'],
                'updated_by'=>Auth::user()->id,
            ]);




            foreach ($data['payments'] as $paymentData) {
                // Check if the payment_bill_id exists, if so, update, otherwise create a new record
                if (!empty($paymentData['payment_bill_id'])) {
                    // Find the existing payment bill record by ID and update it
                    $paymentBill = PaymentBill::find($paymentData['payment_bill_id']);
                    if ($paymentBill) {
                        $paymentBill->update([
                            'bill_id' => $paymentData['bill_id'],
                            'payment_id' => $payment->id,
                            'won_price_amount' => $paymentData['won_price_payment'],
                            'shipping_cost_amount' => $paymentData['shipping_cost_payment'],
                        ]);
                    }
                } else {
                    // Create a new payment bill record if payment_bill_id is null
                    PaymentBill::create([
                        'bill_id' => $paymentData['bill_id'],
                        'payment_id' => $payment->id,
                        'won_price_amount' => $paymentData['won_price_payment'],
                        'shipping_cost_amount' => $paymentData['shipping_cost_payment'],
                    ]);
                }
            }

            // Commit the transaction if everything is successful
            DB::commit();

            // Return a success message
            return back()->with('success', "تم تحديث الرصيد بنجاح");

        } catch (\Exception $e) {
            // Rollback the transaction in case of any failure
            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء تحديث الرصيد: ' . $e->getMessage());
        }

    }

    public function destroy(Payment $payment)
    {

         DB::beginTransaction();

        try {

            $customer_company =User::find($payment->user_id)->customer->customer_company;
            CustomerCredit::create([
                'user_id'=> $payment->user_id,
                'box_id' => $payment->box_id,
                'added_credit' => $payment->total_amount,
                'description' => ' تم ارجاع ' . $payment->total_amount. " $ " . ' الي العميل ' . $customer_company . " نتيجه عمليه حذف عملية تسديد  ",
            ]);

        $payment->delete();
        DB::commit();

        return back()->with('success', "تم حذف عملية تسديد ذمم بنجاح");
        }
         catch (\Exception $e) {
            // Rollback the transaction in case of any failure
            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء حذف عملية تسديد ذمم: ' . $e->getMessage());
        }
    }



    public function CustomersBills(){

            $query = User::role('customer');

            if (request("customer_company")) {
                $query->whereHas('customer', function($q) {
                    $q->where("customer_company", "like", "%" . request("customer_company") . "%");
                });
            }

            if (request("email")) {
                $query->where("email", "like", "%" . request("email") . "%");
            }

            $customers = $query->with('credits', 'bills.paymentBills', 'customer')->paginate(25)->onEachSide(1);


            return inertia("Admin/CarBill/Bill/Reports/CustomersBills", [
                "users" => CustomersBillsResource::collection($customers),
                'queryParams' => request()->query() ?: null,

            ]);


    }



    public function BillsDetails(User $user){

            $bills = $user->load([
                'cars' => function ($query) {
                    $query->select('id', 'chassis', 'user_id');
                },
                'cars.bill.paymentBills.payment'
            ]);

            return inertia("Admin/CarBill/Bill/Reports/BillsDetails", [
                "bills" => new BillsDetailsResource($bills),
            ]);

    }
}
