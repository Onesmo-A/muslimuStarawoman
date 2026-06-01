import React, { useCallback } from 'react';
import { useDashboardQuery } from '../../../services/api/platformApi';
import { useToast } from '../../../shared/components/ToastProvider';
import { getToken } from '../../../shared/auth';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

export function AdminReportsPage() {
    const toast = useToast();
    const { data } = useDashboardQuery();
    const [activeReport, setActiveReport] = React.useState('results');
    const [page, setPage] = React.useState(1);
    const results = data?.data?.top_nominees ?? [];
    const recentVotes = data?.data?.recent_votes ?? [];
    const reportRows = activeReport === 'results' ? results : recentVotes;
    const paginated = paginate(reportRows, page, 10);

    const exportPdf = useCallback(async (type) => {
        const token = getToken();

        if (!token) {
            toast.error('Unable to export without authentication.');
            return;
        }

        try {
            const response = await fetch(`/api/v1/admin/reports/export?type=${type}&format=pdf`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${type}-report.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success('PDF export downloaded.');
        } catch (error) {
            toast.error(error?.message ?? 'Export failed.');
        }
    }, [toast]);

    return (
        <div className="admin-dashboard mswa-page-shell">
            <div className="admin-list-toolbar compact">
                <div className="admin-toolbar-actions">
                    <button type="button" className="btn btn-outline" onClick={() => exportPdf('nominations')}>
                        Export Nominations PDF
                    </button>
                    <button type="button" className="btn btn-gold" onClick={() => exportPdf('results')}>
                        Export Results PDF
                    </button>
                </div>
            </div>

            <div className="dashboard-panel">
                <div className="report-tabs">
                    <button type="button" className={activeReport === 'results' ? 'active' : ''} onClick={() => { setActiveReport('results'); setPage(1); }}>
                        Winners / Results
                    </button>
                    <button type="button" className={activeReport === 'votes' ? 'active' : ''} onClick={() => { setActiveReport('votes'); setPage(1); }}>
                        Vote Activity
                    </button>
                </div>
                <div className="admin-table">
                    {activeReport === 'results' ? (
                        paginated.items.map((result, index) => (
                            <article key={`${result.category}-${result.contact_person}-${index}`}>
                                <strong>#{paginated.start + index}</strong>
                                <div>
                                    <strong>{result.contact_person ?? result.business_name}</strong>
                                    <div className="admin-record-meta">
                                        <small>{result.category ?? 'No category'}</small>
                                        {result.business_name ? <small>{result.business_name}</small> : null}
                                    </div>
                                </div>
                                <span>{result.total} votes</span>
                            </article>
                        ))
                    ) : (
                        paginated.items.map((vote) => (
                            <article key={vote.id}>
                                <div>
                                    <strong>{vote.nominee?.contact_person ?? vote.nominee?.business_name ?? 'Nominee'}</strong>
                                    <div className="admin-record-meta">
                                        <small>{vote.category?.name ?? 'No category'}</small>
                                        <small>{vote.status}</small>
                                    </div>
                                </div>
                                <span>{vote.voted_at ? new Date(vote.voted_at).toLocaleString() : 'No date'}</span>
                            </article>
                        ))
                    )}
                    {!reportRows.length ? <p>No report data is available yet.</p> : null}
                </div>
                <Pagination {...paginated} onPageChange={setPage} />
            </div>
        </div>
    );
}
