<?php

namespace App\Repositories;

use App\Models\Payment;
use App\Models\PaymentTransaction;

class PaymentRepository
{
    public function create(array $payload): Payment
    {
        return Payment::query()->create($payload);
    }

    public function findByReference(string $reference): ?Payment
    {
        return Payment::query()->where('reference', $reference)->first();
    }

    public function createTransaction(array $payload): PaymentTransaction
    {
        return PaymentTransaction::query()->create($payload);
    }
}
