<?php

namespace App\Http\Requests\Admin\Bill;

use App\Models\Admin\Bill\Bill;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {
        $rules = [
            'customer_id' => 'required|exists:users,id',
            'payments' => 'required|array',
            'payments.*.bill_id' => 'required|exists:bills,id',
            'payments.*.won_price_payment' => 'required|numeric|min:0',
            'payments.*.shipping_cost_payment' => 'required|numeric|min:0',
            'total_used' => 'nullable|numeric|min:0',
        ];

        // Conditional box_id validation based on role (nullable for admin)
        if (!auth()->user()->hasRole('Accountant')) {
            $rules['box_id'] = 'required|exists:boxes,id';
        }

        return $rules;
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $this->validateCustomerCredit($validator);
            $this->validateBillPayments($validator);
        });

        if (auth()->user()->hasRole('Accountant') && !$this->filled('box_id')) {

            $this->merge([
                'box_id' => auth()->user()->accountant->box_id
            ]);

            if (!$this->input('box_id')) {
                $validator->errors()->add('box_id', 'يجب أن يكون لديك صندوق محدد.');
            }
        }

    }

    protected function validateCustomerCredit($validator)  
    {
        // Retrieve customer and their credits
        $customer = User::findOrFail($this->input('customer_id'));
        $addedCredit = $customer->credits->sum('added_credit');
        $usedCredit = $customer->credits->sum('used_credit');
        $customerCreditBalance = $addedCredit - $usedCredit;

        // Calculate total payment amount
        $totalPaymentAmount = collect($this->input('payments'))->sum(function ($payment) {
            return $payment['won_price_payment'] + $payment['shipping_cost_payment'];
        });

        // Check if customer has enough credit
        if ($totalPaymentAmount > $customerCreditBalance) {
            $validator->errors()->add('customer_credit', 'لا يوجد رصيد كافي للدفع.');
        }
    }

    protected function validateBillPayments($validator)
    {
        foreach ($this->input('payments') as $paymentData) {
            $bill = Bill::find($paymentData['bill_id']);

            // Recalculate paid amounts
            $shippingCostPaid = $bill->paymentBills()->sum('shipping_cost_amount');
            $wonPricePaid = $bill->paymentBills()->sum('won_price_amount');

            // Recalculate remaining amounts
            $remainShippingCost = $bill->shipping_cost - $shippingCostPaid;
            $remainWonPrice = $bill->won_price - $wonPricePaid;

            // Validate the payments are within the remaining amounts
            if ($paymentData['won_price_payment'] > $remainWonPrice) {
                $validator->errors()->add('won_price_payment_' . $paymentData['bill_id'], 'المبلغ المدفوع يتجاوز won price.');
            }

            if ($paymentData['shipping_cost_payment'] > $remainShippingCost) {
                $validator->errors()->add('shipping_cost_payment_' . $paymentData['bill_id'], 'المبلغ المدفوع يتجاوز shipping cost.');
            }
        }
    }

}