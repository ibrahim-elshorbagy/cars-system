<?php

namespace App\Http\Controllers\Admin\Box;

use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\Box\BoxTransferResource;
use App\Models\Admin\Box\Box;
use App\Models\Admin\Box\BoxTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Admin\Box\BoxTransaction;


class BoxTransferController extends Controller
{
    public function index()
    {
        $query = BoxTransfer::query();

        // If a specific box filter is applied
        // if (request('box') && request('box') !== 'all') {
        //     $query->where(function ($q) {
        //         $q->where('from_box_id', request('box'));
        //     });
        // }

        // If the user is an accountant, restrict them to only their box
        if (Auth::user()->hasRole('Accountant')) {
            $box_id = Auth::user()->accountant->box_id;
            $query->where(function ($q) use ($box_id) {
                $q->where('from_box_id', $box_id)
                    ->orWhere('to_box_id', $box_id);
            });

            // Get only the accountant's box and its balance
            $boxes = Box::where('id', $box_id)->with(['transactions'])->get();
        } else {
            // Get all boxes for admin
            $boxes = Box::query()->with(['transactions'])->get();
        }

        // Calculate the balance for each box the user has access to
        $boxesWithBalances = $boxes->map(function ($box) {
            $totalIncome = $box->transactions()->sum('income');
            $totalOutcome = $box->transactions()->sum('outcome');
            $balance = $totalIncome - $totalOutcome;

            return [
                'id' => $box->id,
                'name' => $box->name,
                'total_income' => $totalIncome,
                'total_outcome' => $totalOutcome,
                'balance' => $balance,
            ];
        });

        $boxList = Box::select('name', 'id')->get();

        // Get the list of transfers with pagination
        $transfers = $query->with(['fromBox', 'toBox','createdBy:id,name', 'updatedBy:id,name'])->orderBy('created_at', 'desc')->paginate(10);


        return inertia("Admin/Box/Transfers/Index", [
            'transfers' => $transfers,
            'boxes' => $boxesWithBalances,
            'boxList' => $boxList,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'danger' => session('danger'),

        ]);
    }







    public function store(Request $request)
    {
        // Validate the request
        $data = $request->validate([
            'from_box_id' => ['required', 'exists:boxes,id'],
            'to_box_id' => ['required', 'exists:boxes,id', 'different:from_box_id'],
            'amount' => [
                'required',
                'numeric',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    // Get the current balance of the from_box
                    $fromBoxBalance = BoxTransaction::where('box_id', $request->from_box_id)
                        ->sum(DB::raw('income - outcome'));

                    // Check if the balance is sufficient
                    if ($fromBoxBalance < $value) {
                        $fail('رصيد الصندوق غير كافٍ لإجراء التحويل.');
                    }
                }
            ],
        ]);

        // If the user has the Accountant role, restrict the from_box to their assigned box
        if (Auth::user()->hasRole('Accountant')) {
            $data['from_box_id'] = Auth::user()->accountant->box_id;

            // Check if the from_box_id matches the accountant's assigned box
            if ($request->from_box_id != Auth::user()->accountant->box_id) {
                return back()->with('danger', 'ليس لديك الصلاحية لتحويل الأموال من هذا الصندوق.');
            }
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Create the outcome transaction for the from_box
            $toBox =Box::find( $data['to_box_id'])->name;
            BoxTransaction::create([
                'box_id' => $data['from_box_id'],
                'outcome' => $data['amount'],
                'description' => ' تم تحويل مبلغ ' . $data['amount'] . " $ ". ' إلى ' . $toBox,
                'created_by' => Auth::id(),
            ]);

            // Create the income transaction for the to_box
            $fromBox =Box::find( $data['from_box_id'])->name;
            BoxTransaction::create([
                'box_id' => $data['to_box_id'],
                'income' => $data['amount'],
                'description' => ' تم استلام مبلغ ' . $data['amount'] . " $ " . ' من ' . $fromBox,
                'created_by' => Auth::id(),

            ]);

            // Save the transfer record
            BoxTransfer::create([
                'from_box_id' => $data['from_box_id'],
                'to_box_id' => $data['to_box_id'],
                'amount' => $data['amount'],
                'created_by' => Auth::id(),

            ]);

            // Commit the transaction
            DB::commit();

            // Return a success message
            return back()->with('success', 'تم تحويل المبلغ بنجاح.');

        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء تحويل المبلغ: ' . $e->getMessage());
        }
    }









    public function update(Request $request, BoxTransfer $record)
    {
        // Validate the request
        $data = $request->validate([
            'from_box_id' => ['required', 'exists:boxes,id'],
            'to_box_id' => ['required', 'exists:boxes,id', 'different:from_box_id'],
            'amount' => [
                'required',
                'numeric',
                'min:1',
                function ($attribute, $value, $fail) use ($request, $record) {
                    // The current transaction (BoxTransfer) is stored in $record

                    // Exclude the current transfer amount from the balance calculation
                    $existingAmount = $record->amount;

                    // Get the current balance of the from_box, excluding the current transfer if applicable
                    $fromBoxBalance = BoxTransaction::where('box_id', $request->from_box_id)
                        ->where('id', '!=', $record->id) // Exclude the current transaction
                        ->sum(DB::raw('income - outcome'));

                    // Add back the existing transfer amount, since we are editing this transaction
                    $fromBoxBalance += $existingAmount;

                    // Check if the balance is sufficient
                    if ($fromBoxBalance < $value) {
                        $fail('رصيد الصندوق غير كافٍ لإجراء التحويل.');
                    }
                }
            ],
        ]);

        // If the user has the Accountant role, restrict the from_box to their assigned box
        if (Auth::user()->hasRole('Accountant')) {
            $data['from_box_id'] = Auth::user()->accountant->box_id;

            // Check if the from_box_id matches the accountant's assigned box
            if ($request->from_box_id != Auth::user()->accountant->box_id) {
                return back()->with('danger', 'ليس لديك الصلاحية لتحويل الأموال من هذا الصندوق.');
            }
        }

        // Begin the transaction to ensure atomicity
        DB::beginTransaction();

        try {

            //the order must be the finall setp first as we order the transactions in the reverse order (Transactions Descending)
            //so the history order the oldest sent the money to the new box //the older up
            //the newer is retun the money back  //and newer down


            // Step 1: Perform the new transfer
            $fromBoxNew = Box::find($data['from_box_id'])->name;
            $toBoxNew = Box::find($data['to_box_id'])->name;

            // Move the new amount out of the new from_box
            BoxTransaction::create([
                'box_id' => $data['from_box_id'],
                'outcome' => $data['amount'],
                'description' => 'تم تحويل مبلغ ' . $data['amount'] . ' إلى ' . $toBoxNew,
                'created_by' => Auth::id(),

            ]);

            // Add the new amount to the new to_box
            BoxTransaction::create([
                'box_id' => $data['to_box_id'],
                'income' => $data['amount'],
                'description' => 'تم استلام مبلغ ' . $data['amount'] . ' من ' . $fromBoxNew,
                'created_by' => Auth::id(),

            ]);

            // Step 2: Reverse the old transfer
            $fromBoxOld = Box::find($record->from_box_id)->name;
            $toBoxOld = Box::find($record->to_box_id)->name;

            // Reverse the outcome from the original from_box (refund the original from_box)
            BoxTransaction::create([
                'box_id' => $record->from_box_id,
                'income' => $record->amount,
                'description' => 'تم ارجاع مبلغ ' . $record->amount . ' إلى ' . $fromBoxOld . ' نتيجه تعديل التحويل',
                'created_by' => Auth::id(),

            ]);

            // Reverse the income from the original to_box (remove the amount from the original to_box)
            BoxTransaction::create([
                'box_id' => $record->to_box_id,
                'outcome' => $record->amount,
                'description' => 'تم ازاله مبلغ ' . $record->amount . ' من ' . $toBoxOld . ' نتيجه تعديل التحويل',
                'created_by' => Auth::id(),

            ]);


            // Step 3: Update the transfer record with new details
            $record->update([
                'from_box_id' => $data['from_box_id'],
                'to_box_id' => $data['to_box_id'],
                'amount' => $data['amount'],
                'updated_by' => Auth::id(),
            ]);

            // Commit the transaction if everything is successful
            DB::commit();

            // Return a success message
            return back()->with('success', 'تم تعديل عملية تحويل الأموال بنجاح.');

        } catch (\Exception $e) {
            // Rollback the transaction in case of any failure
            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء تعديل عملية التحويل: ' . $e->getMessage());
        }
    }









    public function destroy(BoxTransfer $record)
    {

          DB::beginTransaction();

        try {

            $toBox =Box::find( $record['to_box_id'])->name;
            BoxTransaction::create([
                'box_id' => $record['from_box_id'],
                'outcome' => $record['amount'],
                'description' => ' تم ارجاع ' . $record['amount'] . ' إلى ' . $toBox . " نتيجه عمليه حذف تحويل اموال ",
            ]);

            // Create the income transaction for the to_box
            $fromBox =Box::find( $record['from_box_id'])->name;
            BoxTransaction::create([
                'box_id' => $record['to_box_id'],
                'income' => $record['amount'],
                'description' => ' تم استلام مبلغ ' . $record['amount'] . ' من ' . $fromBox . " نتيجه عمليه حذف تحويل اموال ",
            ]);

        $record->delete();

        DB::commit();

        return back()->with('success', "تم حذف عملية تحويل الاموال بنجاح");
        }
         catch (\Exception $e) {
            // Rollback the transaction in case of any failure
            DB::rollBack();


            return back()->with('danger', 'حدث خطأ أثناء حذف عملية تحويل: ' . $e->getMessage());
        }
    }

}
