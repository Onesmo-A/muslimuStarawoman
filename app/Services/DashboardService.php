<?php

namespace App\Services;

use App\Models\Nomination;
use App\Models\Payment;
use App\Models\TicketOrder;
use App\Models\Vote;

class DashboardService
{
    public function kpis(): array
    {
        return [
            'total_nominations' => Nomination::query()->count(),
            'total_payments' => Payment::query()->count(),
            'ticket_sales' => TicketOrder::query()->where('status', 'paid')->count(),
            'votes_count' => Vote::query()->count(),
            'revenue_analytics' => (float) Payment::query()->where('status', 'paid')->sum('amount'),
            'application_funnel' => Nomination::query()
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
        ];
    }
}
