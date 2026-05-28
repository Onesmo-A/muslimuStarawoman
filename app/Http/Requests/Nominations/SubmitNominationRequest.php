<?php

namespace App\Http\Requests\Nominations;

use App\Http\Requests\ApiFormRequest;

class SubmitNominationRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}

