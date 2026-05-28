<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->id === $payment->user_id || $user->can('manage_payments');
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->can('manage_payments');
    }
}
