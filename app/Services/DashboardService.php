<?php

namespace App\Services;

use App\Models\Nomination;
use App\Models\Nominee;
use App\Models\Payment;
use App\Models\TicketOrder;
use App\Models\User;
use App\Models\Vote;

class DashboardService
{
    public function kpis(): array
    {
        $votesByStatus = Vote::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return [
            'total_nominations' => Nomination::query()->count(),
            'total_payments' => Payment::query()->count(),
            'ticket_sales' => TicketOrder::query()->where('status', 'paid')->count(),
            'votes_count' => Vote::query()->count(),
            'valid_votes_count' => (int) ($votesByStatus['valid'] ?? 0),
            'blocked_votes_count' => (int) ($votesByStatus['blocked'] ?? 0),
            'users_count' => User::query()->count(),
            'nominees_count' => Nominee::query()->count(),
            'revenue_analytics' => (float) Payment::query()->where('status', 'paid')->sum('amount'),
            'application_funnel' => Nomination::query()
                ->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
            'votes_by_status' => $votesByStatus,
            'votes_by_category' => Vote::query()
                ->join('award_categories', 'votes.award_category_id', '=', 'award_categories.id')
                ->selectRaw('award_categories.name, votes.status, COUNT(*) as total')
                ->groupBy('award_categories.name', 'votes.status')
                ->orderByDesc('total')
                ->limit(12)
                ->get(),
            'top_nominees' => Vote::query()
                ->join('nominees', 'votes.nominee_id', '=', 'nominees.id')
                ->join('award_categories', 'votes.award_category_id', '=', 'award_categories.id')
                ->selectRaw('award_categories.name as category, nominees.contact_person, nominees.business_name, COUNT(*) as total')
                ->where('votes.status', 'valid')
                ->groupBy('award_categories.name', 'nominees.contact_person', 'nominees.business_name')
                ->orderByDesc('total')
                ->limit(10)
                ->get(),
            'recent_votes' => Vote::query()
                ->with(['category:id,name', 'nominee:id,contact_person,business_name', 'user:id,name,email'])
                ->latest('voted_at')
                ->limit(12)
                ->get(['id', 'award_category_id', 'nominee_id', 'user_id', 'ip_address', 'status', 'block_reason', 'source', 'voted_at']),
        ];
    }
}
