<?php

namespace App\Services;

use App\Models\Nomination;
use App\Models\Nominee;
use App\Models\AwardCategory;
use App\Models\Payment;
use App\Models\Score;
use App\Models\TicketOrder;
use App\Models\Vote;
use Illuminate\Support\Arr;

class ReportService
{
    public function data(string $type): array
    {
        return match ($type) {
            'nominations' => $this->nominations(),
            'nominees' => $this->nominees(),
            'payments' => Payment::query()->select(['id', 'reference', 'amount', 'status', 'created_at'])->get()->toArray(),
            'tickets' => TicketOrder::query()->select(['id', 'ticket_code', 'status', 'total_amount', 'created_at'])->get()->toArray(),
            'votes' => Vote::query()->select(['id', 'award_category_id', 'nominee_id', 'status', 'created_at'])->get()->toArray(),
            'results', 'winners' => $this->voteResults(),
            'scores' => Score::query()->select(['id', 'nomination_id', 'score', 'weight', 'created_at'])->get()->toArray(),
            default => [],
        };
    }

    private function nominations(): array
    {
        $nominations = Nomination::query()
            ->with(['category:id,name', 'user:id,name,email,phone', 'nominee:id,contact_person,business_name'])
            ->orderByDesc('created_at')
            ->get()
            ->groupBy('award_category_id');

        return AwardCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->flatMap(function (AwardCategory $category) use ($nominations) {
                $categoryNominations = $nominations->get($category->id, collect());
                $total = $categoryNominations->count();

                if ($total === 0) {
                    return [[
                        'category' => $category->name,
                        'category_total' => 0,
                        'reference' => 'NO APPLICATIONS',
                        'applicant_name' => '',
                        'nominee_name' => '',
                        'phone' => '',
                        'status' => 'no_applications',
                        'submitted_at' => '',
                    ]];
                }

                return $categoryNominations->map(function (Nomination $nomination) use ($category, $total) {
                    $payload = $nomination->form_payload ?? [];

                    return [
                        'category' => $category->name,
                        'category_total' => $total,
                        'reference' => $nomination->reference,
                        'applicant_name' => $nomination->user?->name,
                        'nominee_name' => Arr::get($payload, 'nominee_name') ?? $nomination->nominee?->contact_person,
                        'phone' => Arr::get($payload, 'phone') ?? $nomination->user?->phone,
                        'status' => $nomination->status,
                        'submitted_at' => optional($nomination->submitted_at)->toDateTimeString(),
                    ];
                });
            })
            ->values()
            ->toArray();
    }

    private function nominees(): array
    {
        return Nominee::query()
            ->with('category:id,name')
            ->withCount(['votes' => fn ($query) => $query->where('status', 'valid')])
            ->latest()
            ->get()
            ->map(fn (Nominee $nominee) => [
                'nominee_name' => $nominee->contact_person,
                'business_name' => $nominee->business_name,
                'category' => $nominee->category?->name,
                'email' => $nominee->email,
                'phone' => $nominee->phone,
                'city' => $nominee->city,
                'country' => $nominee->country,
                'valid_votes' => (int) $nominee->votes_count,
                'status' => $nominee->status,
                'created_at' => optional($nominee->created_at)->toDateTimeString(),
            ])
            ->toArray();
    }

    private function voteResults(): array
    {
        $nominees = Nominee::query()
            ->with('category:id,name')
            ->withCount(['votes' => fn ($query) => $query->where('status', 'valid')])
            ->orderByDesc('votes_count')
            ->orderBy('contact_person')
            ->get()
            ->groupBy('award_category_id');

        return AwardCategory::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->flatMap(function (AwardCategory $category) use ($nominees) {
                $categoryNominees = $nominees->get($category->id, collect());
                $totalNominees = $categoryNominees->count();

                if ($totalNominees === 0) {
                    return [[
                        'category' => $category->name,
                        'category_nominees' => 0,
                        'nominee_name' => 'NO NOMINEES',
                        'business_name' => '',
                        'valid_votes' => 0,
                    ]];
                }

                return $categoryNominees->map(fn (Nominee $nominee) => [
                    'category' => $category->name,
                    'category_nominees' => $totalNominees,
                    'nominee_name' => $nominee->contact_person,
                    'business_name' => $nominee->business_name,
                    'valid_votes' => (int) $nominee->votes_count,
                ]);
            })
            ->values()
            ->toArray();
    }

    public function toCsv(array $rows): string
    {
        if ($rows === []) {
            return "id\n";
        }

        $headers = array_keys($rows[0]);
        $lines = [implode(',', $headers)];

        foreach ($rows as $row) {
            $line = array_map(function ($value) {
                $value = (string) $value;

                if (str_contains($value, ',') || str_contains($value, '"')) {
                    $value = '"'.str_replace('"', '""', $value).'"';
                }

                return $value;
            }, $row);

            $lines[] = implode(',', $line);
        }

        return implode("\n", $lines);
    }
}
