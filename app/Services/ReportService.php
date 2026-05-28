<?php

namespace App\Services;

use App\Models\Nomination;
use App\Models\Payment;
use App\Models\Score;
use App\Models\TicketOrder;
use App\Models\Vote;

class ReportService
{
    public function data(string $type): array
    {
        return match ($type) {
            'nominations' => Nomination::query()->select(['id', 'reference', 'status', 'created_at'])->get()->toArray(),
            'payments' => Payment::query()->select(['id', 'reference', 'amount', 'status', 'created_at'])->get()->toArray(),
            'tickets' => TicketOrder::query()->select(['id', 'ticket_code', 'status', 'total_amount', 'created_at'])->get()->toArray(),
            'votes' => Vote::query()->select(['id', 'award_category_id', 'nominee_id', 'status', 'created_at'])->get()->toArray(),
            'scores' => Score::query()->select(['id', 'nomination_id', 'score', 'weight', 'created_at'])->get()->toArray(),
            default => [],
        };
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
