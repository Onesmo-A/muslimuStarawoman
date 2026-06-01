import React from 'react';

export function paginate(items, page, perPage) {
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;

    return {
        items: items.slice(start, start + perPage),
        page: safePage,
        total,
        totalPages,
        start: total ? start + 1 : 0,
        end: Math.min(start + perPage, total),
    };
}

export function Pagination({ page, totalPages, total, start, end, onPageChange }) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-bar">
            <span>{start}-{end} of {total}</span>
            <div className="pagination-actions">
                <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                    <i className="fas fa-chevron-left" aria-hidden="true"></i>
                </button>
                <strong>{page} / {totalPages}</strong>
                <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    );
}
