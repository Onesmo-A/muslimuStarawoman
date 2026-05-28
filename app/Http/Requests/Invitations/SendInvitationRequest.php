<?php

namespace App\Http\Requests\Invitations;

use App\Http\Requests\ApiFormRequest;

class SendInvitationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invitation_id' => ['required', 'integer', 'exists:invitations,id'],
        ];
    }
}

