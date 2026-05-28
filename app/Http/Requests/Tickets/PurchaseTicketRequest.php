<?php

namespace App\Http\Requests\Tickets;

use App\Http\Requests\ApiFormRequest;

class PurchaseTicketRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_id' => ['required', 'integer', 'exists:tickets,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'purchaser_name' => ['required', 'string', 'max:255'],
            'purchaser_email' => ['required', 'email', 'max:255'],
            'purchaser_phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}

