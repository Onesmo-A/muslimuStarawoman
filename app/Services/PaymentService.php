<?php

namespace App\Services;

use App\Models\Payment;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Str;

class PaymentService
{
    public function __construct(private readonly PaymentRepository $repository)
    {
    }

    public function initiate(int $userId, array $payload): Payment
    {
        $reference = strtoupper('PAY-'.Str::random(12));

        return $this->repository->create([
            'user_id' => $userId,
            'payable_type' => $payload['payable_type'],
            'payable_id' => $payload['payable_id'],
            'provider' => $payload['provider'],
            'reference' => $reference,
            'amount' => $payload['amount'],
            'currency' => $payload['currency'] ?? 'USD',
            'status' => 'pending',
            'metadata' => $payload['metadata'] ?? null,
        ]);
    }

    public function verify(string $reference, string $status = 'paid'): ?Payment
    {
        $payment = $this->repository->findByReference($reference);

        if (! $payment) {
            return null;
        }

        $payment->forceFill([
            'status' => $status,
            'paid_at' => $status === 'paid' ? now() : null,
        ])->save();

        $this->repository->createTransaction([
            'payment_id' => $payment->id,
            'provider_transaction_id' => $reference,
            'status' => $status,
            'processed_at' => now(),
        ]);

        return $payment;
    }

    public function webhook(array $payload): ?Payment
    {
        return $this->verify(
            reference: (string) ($payload['reference'] ?? ''),
            status: (string) ($payload['status'] ?? 'failed'),
        );
    }
}
