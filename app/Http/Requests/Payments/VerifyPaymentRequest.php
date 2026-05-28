<?php

namespace App\Http\Requests\Payments;

use App\Http\Requests\ApiFormRequest;

class VerifyPaymentRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => ['required', 'string'],
            'status' => ['nullable', 'in:pending,paid,failed,refunded'],
        ];
    }
}

