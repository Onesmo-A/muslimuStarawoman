import React, { useMemo, useState } from 'react';
import { useNomineesQuery } from '../../../services/api/platformApi';
import PageLoader from '../../../shared/components/PageLoader';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

export function ResultsPage() {
    const { data, isLoading } = useNomineesQuery();
    const [page, setPage] = useState(1);
    const nominees = data?.data ?? [];
    const ranked = useMemo(() => [...nominees].sort((a, b) => Number(b.votes_count ?? 0) - Number(a.votes_count ?? 0)), [nominees]);
    const paginated = useMemo(() => paginate(ranked, page, 10), [ranked, page]);
    const totalVotes = useMemo(
        () => ranked.reduce((sum, nominee) => sum + Number(nominee.votes_count ?? 0), 0),
        [ranked],
    );

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <section className="section mswa-page-shell results-page">
            <div className="public-page-hero">
                <div>
                    <span className="eyebrow">Vote Results</span>
                    <h1>Current leaders and winners table.</h1>
                    <p>Browse nominees ranked by valid public votes.</p>
                </div>
                <div className="page-hero-stat">
                    <i className="fas fa-chart-simple" aria-hidden="true"></i>
                    <strong>{totalVotes}</strong>
                    <span>Total public votes</span>
                </div>
            </div>

            <div className="results-table">
                {paginated.items.map((nominee, index) => (
                    <article key={nominee.id}>
                        <strong className="rank-badge">#{(paginated.start + index).toString().padStart(2, '0')}</strong>
                        <div>
                            <h3>{nominee.contact_person ?? nominee.business_name}</h3>
                            <span>{nominee.category?.name ?? 'No category'}</span>
                        </div>
                        <b>{nominee.votes_count ?? 0} votes</b>
                    </article>
                ))}
                {!ranked.length ? (
                    <div className="empty-state">
                        <i className="fas fa-chart-line" aria-hidden="true"></i>
                        <span>No vote results are available yet.</span>
                    </div>
                ) : null}
            </div>
            <Pagination {...paginated} onPageChange={setPage} />
        </section>
    );
}
