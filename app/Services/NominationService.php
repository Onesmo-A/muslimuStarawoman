<?php

namespace App\Services;

use App\Models\CategoryPricing;
use App\Models\Nomination;
use App\Repositories\NominationRepository;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class NominationService
{
    public function __construct(private readonly NominationRepository $repository)
    {
    }

    public function createDraft(int $userId, array $payload): Nomination
    {
        $reference = 'NOM-'.strtoupper(Str::random(10));
        $pricing = CategoryPricing::query()->where('award_category_id', $payload['award_category_id'])->first();
        $status = 'draft';
        $submittedAt = null;

        if (! $pricing || $pricing->form_type !== 'paid') {
            $status = 'submitted';
            $submittedAt = now();
        }

        return $this->repository->create([
            'user_id' => $userId,
            'award_category_id' => $payload['award_category_id'],
            'nominee_id' => $payload['nominee_id'] ?? null,
            'reference' => $reference,
            'form_payload' => $payload['form_payload'] ?? null,
            'status' => $status,
            'submitted_at' => $submittedAt,
        ]);
    }

    public function uploadFile(Nomination $nomination, UploadedFile $file, string $fileType): array
    {
        $path = $file->store('nominations/'.$nomination->id, 'public');

        $record = $this->repository->saveFile([
            'nomination_id' => $nomination->id,
            'file_type' => $fileType,
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getClientMimeType() ?? 'application/octet-stream',
            'size_bytes' => $file->getSize() ?: 0,
        ]);

        return ['file' => $record, 'path' => $path];
    }

    public function submit(Nomination $nomination): Nomination
    {
        $pricing = CategoryPricing::query()->where('award_category_id', $nomination->award_category_id)->first();

        if ($pricing && $pricing->form_type === 'paid') {
            $hasPaid = $nomination->payments()->where('status', 'paid')->exists();

            if (! $hasPaid) {
                throw ValidationException::withMessages([
                    'payment' => ['Payment is required before submission for this category.'],
                ]);
            }
        }

        $nomination->status = 'submitted';
        $nomination->submitted_at = now();
        $nomination->save();

        return $nomination;
    }

    public function applications(int $userId, int $perPage = 15)
    {
        return $this->repository->userApplications($userId, $perPage);
    }
}
