<?php

namespace App\Http\Requests\Nominations;

use App\Http\Requests\ApiFormRequest;

class UploadNominationFileRequest extends ApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file_type' => ['required', 'string', 'max:100'],
            'file' => ['required', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,mp4,mov'],
        ];
    }
}

