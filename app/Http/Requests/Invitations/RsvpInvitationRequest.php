<?php

namespace App\Http\Requests\Invitations;

use App\Http\Requests\ApiFormRequest;

class RsvpInvitationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'response' => ['required', 'in:accept,decline'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

