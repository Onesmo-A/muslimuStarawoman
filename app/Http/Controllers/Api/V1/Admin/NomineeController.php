<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Nominee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\Rule;

class NomineeController extends BaseApiController
{
    public function index()
    {
        $nominees = Nominee::query()
            ->with('category:id,name')
            ->withCount('votes')
            ->orderByDesc('created_at')
            ->get();

        return $this->successResponse($nominees, 'Admin nominees list');
    }

    public function store(Request $request)
    {
        $nominee = Nominee::query()->create($this->validatedPayload($request));
        $this->clearPublicCache();

        return $this->successResponse($nominee->load('category:id,name')->loadCount('votes'), 'Nominee created', status: 201);
    }

    public function show(Nominee $nominee)
    {
        return $this->successResponse($nominee->load('category:id,name')->loadCount('votes'), 'Nominee details');
    }

    public function update(Request $request, Nominee $nominee)
    {
        $nominee->update($this->validatedPayload($request));
        $this->clearPublicCache();

        return $this->successResponse($nominee->fresh('category:id,name'), 'Nominee updated');
    }

    public function destroy(Nominee $nominee)
    {
        $nominee->delete();
        $this->clearPublicCache();

        return $this->successResponse(message: 'Nominee deleted');
    }

    private function validatedPayload(Request $request): array
    {
        $payload = $request->validate([
            'award_category_id' => ['required', 'integer', 'exists:award_categories,id'],
            'business_name' => ['required', 'string', 'max:255'],
            'contact_person' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'url', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'country' => ['nullable', 'string', 'max:255'],
            'company_profile' => ['nullable', 'string'],
            'photo_path' => ['nullable', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'max:4096'],
            'video_url' => ['nullable', 'url', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);

        unset($payload['photo']);

        if ($request->hasFile('photo')) {
            $payload['photo_path'] = $request->file('photo')->store('nominees', 'public');
        }

        return $payload;
    }

    private function clearPublicCache(): void
    {
        Cache::forget('public_home');
    }
}
