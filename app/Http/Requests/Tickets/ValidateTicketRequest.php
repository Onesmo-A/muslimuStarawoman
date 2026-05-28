<?php

namespace App\Http\Requests\Tickets;

use App\Http\Requests\ApiFormRequest;

class ValidateTicketRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ticket_code' => ['required', 'string'],
        ];
    }
}

