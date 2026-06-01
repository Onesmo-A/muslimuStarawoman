<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\AwardCategory;
use App\Models\CategoryPricing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends BaseApiController
{
    public function index()
    {
        $categories = AwardCategory::query()
            ->with('pricing')
            ->withCount(['nominations', 'nominees'])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->successResponse($categories, 'Admin categories list');
    }

    public function store(Request $request)
    {
        $payload = $this->validatedPayload($request);
        $category = AwardCategory::query()->create($payload['category']);

        $this->syncPricing($category, $payload['pricing']);
        $this->clearPublicCache();

        return $this->successResponse($category->load('pricing'), 'Category created', status: 201);
    }

    public function show(AwardCategory $category)
    {
        return $this->successResponse($category->load('pricing'), 'Category details');
    }

    public function update(Request $request, AwardCategory $category)
    {
        $payload = $this->validatedPayload($request, $category);

        $category->update($payload['category']);
        $this->syncPricing($category, $payload['pricing']);
        $this->clearPublicCache();

        return $this->successResponse($category->fresh('pricing'), 'Category updated');
    }

    public function destroy(AwardCategory $category)
    {
        $category->delete();
        $this->clearPublicCache();

        return $this->successResponse(message: 'Category deleted');
    }

    private function validatedPayload(Request $request, ?AwardCategory $category = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('award_categories', 'slug')->ignore($category?->id),
            ],
            'description' => ['nullable', 'string'],
            'voting_enabled' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:1', 'max:65535'],
            'is_active' => ['sometimes', 'boolean'],
            'form_type' => ['nullable', Rule::in(['free', 'paid'])],
            'application_fee' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:5'],
            'early_bird_fee' => ['nullable', 'numeric', 'min:0'],
            'deadline' => ['nullable', 'date'],
        ]);

        return [
            'category' => [
                'name' => $data['name'],
                'slug' => $this->uniqueSlug($data['slug'] ?? Str::slug($data['name']), $category),
                'description' => $data['description'] ?? null,
                'voting_enabled' => array_key_exists('voting_enabled', $data) ? $data['voting_enabled'] : ($category ? $category->voting_enabled : true),
                'sort_order' => $data['sort_order'] ?? 1,
                'is_active' => array_key_exists('is_active', $data) ? $data['is_active'] : ($category ? $category->is_active : true),
            ],
            'pricing' => [
                'form_type' => $data['form_type'] ?? 'free',
                'application_fee' => $data['application_fee'] ?? 0,
                'currency' => $data['currency'] ?? 'TZS',
                'early_bird_fee' => $data['early_bird_fee'] ?? null,
                'deadline' => $data['deadline'] ?? null,
                'is_active' => true,
            ],
        ];
    }

    private function syncPricing(AwardCategory $category, array $payload): void
    {
        CategoryPricing::query()->updateOrCreate(
            ['award_category_id' => $category->id],
            $payload
        );
    }

    private function uniqueSlug(string $slug, ?AwardCategory $category = null): string
    {
        $base = Str::slug($slug) ?: Str::random(8);
        $candidate = $base;
        $counter = 2;

        while (AwardCategory::query()
            ->where('slug', $candidate)
            ->when($category, fn ($query) => $query->whereKeyNot($category->id))
            ->exists()) {
            $candidate = $base.'-'.$counter;
            $counter++;
        }

        return $candidate;
    }

    private function clearPublicCache(): void
    {
        Cache::forget('public_categories');
        Cache::forget('public_home');
    }
}
