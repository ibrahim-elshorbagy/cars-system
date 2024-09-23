<?php

namespace App\Http\Resources\Admin\Box;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class BoxTransferResource extends JsonResource
{
    protected $paginatedTransactions;

   public function __construct($resource, $paginatedTransactions)
    {
        // Parent constructor
        parent::__construct($resource);

        // Assign paginated transactions
        $this->paginatedTransactions = $paginatedTransactions;
    }

    public function toArray(Request $request): array
    {
        // Calculate total income, total outcome, and start with the total balance
        $totalIncome = $this->transactions->sum('income');
        $totalOutcome = $this->transactions->sum('outcome');
        $balance = $totalIncome - $totalOutcome; // Start with the total balance

        // Order transactions by created_at descending and calculate balance for each
        $transactions = collect($this->paginatedTransactions->items())->map(function ($transaction) use (&$balance) {
            // Calculate balance for each transaction in reverse
            $transactionBalance = $balance;
            $balance -= $transaction->income - $transaction->outcome;

            return [
                'id' => $transaction->id,
                'box_id' => $transaction->box_id,
                'description' => $transaction->description,
                'income' => $transaction->income,
                'outcome' => $transaction->outcome,
                'balance' => $transactionBalance,
                'created_at' => (new Carbon($transaction->created_at))->format('Y-m-d H:i:s'),
            ];
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'total_income' => $totalIncome,
            'total_outcome' => $totalOutcome,
            'total_balance' => $balance,
            'transactions' => [
                'data' => $transactions,
                'links' => $this->paginatedTransactions->links(),
                // 'meta' => $this->paginatedTransactions->toArray()['meta'],
            ],
        ];

    }

}
