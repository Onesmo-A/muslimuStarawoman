import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCategoriesQuery, useNomineesQuery } from '../../../services/api/platformApi';
import PageLoader from '../../../shared/components/PageLoader';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

const fallbackCategories = [
    { id: 1, name: 'Learning & Networking Impact' },
    { id: 2, name: 'Islamic Education & Sisterhood' },
    { id: 3, name: 'Business Awards & Recognition' },
    { id: 4, name: 'Charity & Social Support' },
    { id: 5, name: 'Modest Fashion, Arts & Media' },
    { id: 6, name: 'Islamic Woman Leader of the Year' },
];

export function CategoriesPage() {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useCategoriesQuery();
    const { data: nomineesData } = useNomineesQuery();
    const intent = searchParams.get('intent');
    const categories = data?.data?.length ? data.data : fallbackCategories;
    const nominees = nomineesData?.data ?? [];

    const nomineeCountByCategory = useMemo(() => nominees.reduce((counts, nominee) => {
        const categoryId = Number(nominee.award_category_id);
        counts[categoryId] = (counts[categoryId] ?? 0) + 1;
        return counts;
    }, {}), [nominees]);

    const filteredCategories = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return categories;
        }

        return categories.filter((category) => category.name?.toLowerCase().includes(normalizedQuery));
    }, [categories, query]);

    const paginated = useMemo(() => paginate(filteredCategories, page, 9), [filteredCategories, page]);

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <section className="section mswa-page-shell categories-flow-page">
            <span className="eyebrow">{intent === 'vote' ? 'Step 1: Choose a Category' : 'The Awards'}</span>
            <h1>{intent === 'vote' ? 'Select a category to vote.' : 'Categories'}</h1>
            <p>Search by category, then open nominees and cast your vote.</p>

            <div className="category-search-panel">
                <i className="fas fa-search" aria-hidden="true"></i>
                <input
                    type="search"
                    value={query}
                    onChange={(event) => { setQuery(event.target.value); setPage(1); }}
                    placeholder="Search categories"
                    aria-label="Search award categories"
                />
            </div>

            <div className="grid-three">
                {paginated.items.map((category) => {
                    const nomineeCount = nomineeCountByCategory[Number(category.id)] ?? 0;

                    return (
                        <Link
                            key={category.id}
                            to={`/voting?category=${category.id}`}
                            className="category-click-card"
                        >
                            <span className="category-card-index">#{String(category.id).padStart(2, '0')}</span>
                            <h3>{category.name}</h3>
                            <strong>{nomineeCount}</strong>
                            <small>{nomineeCount === 1 ? 'Nominee' : 'Nominees'}</small>
                            <span className="category-card-action">View nominees</span>
                        </Link>
                    );
                })}
            </div>

            {!filteredCategories.length ? (
                <div className="empty-state">No categories match your search.</div>
            ) : null}
            <Pagination {...paginated} onPageChange={setPage} />
        </section>
    );
}
