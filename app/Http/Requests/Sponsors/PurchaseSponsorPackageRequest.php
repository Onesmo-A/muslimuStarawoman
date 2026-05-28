<?php

namespace App\Http\Requests\Sponsors;

use App\Http\Requests\ApiFormRequest;

class PurchaseSponsorPackageRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sponsor_package_id' => ['required', 'integer', 'exists:sponsor_packages,id'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url'],
        ];
    }
}

