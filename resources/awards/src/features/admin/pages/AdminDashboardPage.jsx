import React from 'react';
import { useDashboardQuery } from '../../../services/api/platformApi';
import { ChartCard } from '../../../shared/components/ui/ChartCard';

export function AdminDashboardPage() {
    const { data } = useDashboardQuery();
    const kpis = data?.data ?? {};

    return (
        <div className="grid-three">
            <ChartCard title="Nominations" value={kpis.total_nominations ?? 0} />
            <ChartCard title="Payments" value={kpis.total_payments ?? 0} />
            <ChartCard title="Votes" value={kpis.votes_count ?? 0} />
        </div>
    );
}
