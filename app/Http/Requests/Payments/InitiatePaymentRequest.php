<?php

namespace App\Http\Requests\Payments;

use App\Http\Requests\ApiFormRequest;

class InitiatePaymentRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payable_type' => ['required', 'string', 'max:255'],
            'payable_id' => ['required', 'integer'],
            'provider' => ['required', 'in:flutterwave,paystack,stripe,mpesa,airtelmoney,tigopesa'],
            'amount' => ['required', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'metadata' => ['nullable', 'array'],
        ];
    }
}

