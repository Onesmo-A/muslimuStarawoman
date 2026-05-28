<?php

namespace App\Http\Requests\Invitations;

use App\Http\Requests\ApiFormRequest;

class StoreInvitationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => ['required', 'integer', 'exists:events,id'],
            'invitation_type' => ['required', 'in:nominees,judges,sponsors,vip_guests,media'],
            'channel' => ['required', 'in:email,sms,both'],
            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_email' => ['nullable', 'email', 'max:255'],
            'recipient_phone' => ['nullable', 'string', 'max:50'],
            'message' => ['nullable', 'string'],
        ];
    }
}

