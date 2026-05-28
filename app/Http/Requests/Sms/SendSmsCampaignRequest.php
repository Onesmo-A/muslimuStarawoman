<?php

namespace App\Http\Requests\Sms;

use App\Http\Requests\ApiFormRequest;

class SendSmsCampaignRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'campaign_id' => ['required', 'integer', 'exists:sms_campaigns,id'],
            'recipients' => ['required', 'array', 'min:1'],
            'recipients.*' => ['required', 'string', 'max:50'],
        ];
    }
}

