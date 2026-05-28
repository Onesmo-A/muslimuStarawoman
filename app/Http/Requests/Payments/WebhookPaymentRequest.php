<?php

namespace App\Http\Requests\Payments;

use App\Http\Requests\ApiFormRequest;

class WebhookPaymentRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference' => ['required', 'string'],
            'status' => ['required', 'in:pending,paid,failed,refunded'],
        ];
    }
}

