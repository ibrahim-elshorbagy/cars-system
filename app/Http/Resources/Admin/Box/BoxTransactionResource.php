<?php

namespace App\Http\Resources\Admin\Box;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class BoxTransactionResource extends JsonResource
{
    protected $paginatedTransactions;

    public function __construct($resource, $paginatedTransactions)
    {
        parent::__construct($resource);
        $this->paginatedTransactions = $paginatedTransactions;
    }

    public function toArray(Request $request): array
    {
        $totalIncome = $this->transactions->sum('income');
        $totalOutcome = $this->transactions->sum('outcome');

        // Start with zero, and calculate the running balance for each transaction
        $runningBalance = 0;

        // Reverse the transaction list to calculate the balance correctly in ascending order
        $transactionsReversed = collect($this->paginatedTransactions->items())->reverse();

        // Map through reversed transactions to calculate the running balance for each one
        $transactions = $transactionsReversed->map(function ($transaction) use (&$runningBalance) {
            // Update the running balance
            $runningBalance += $transaction->income - $transaction->outcome;

            return [
                'id' => $transaction->id,
                'box_id' => $transaction->box_id,
                'description' => $transaction->description,
                'income' => $transaction->income,
                'outcome' => $transaction->outcome,
                'balance' => $runningBalance,
                'created_at' => (new Carbon($transaction->created_at))->format('Y-m-d H:i:s'),
                'created_by' => $transaction->createdBy->name ?? null,
                'updated_by' => $transaction->updatedBy->name ?? null,
            ];
        });

        // Reverse the transactions back to descending order for display
        $transactions = $transactions->reverse()->values();

        // Final balance after processing all transactions
        $finalBalance = $totalIncome - $totalOutcome;

        // Use array checks before accessing pagination keys
        $paginationArray = $this->paginatedTransactions->toArray();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'total_income' => $totalIncome,
            'total_outcome' => $totalOutcome,
            'total_balance' => $finalBalance,
            'transactions' => [
                'data' => $transactions,
                'links' => $paginationArray['links'] ?? [],
                'meta' => $paginationArray['meta'] ?? [],
            ],
        ];
    }

}
