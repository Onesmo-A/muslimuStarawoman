import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAdminCategoryQuery } from '../../../services/api/platformApi';

export function AdminCategoryDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useAdminCategoryQuery(id);
    const category = data?.data;

    if (isLoading) {
        return <div className="dashboard-panel">Loading category...</div>;
    }

    if (!category) {
        return <div className="dashboard-panel">Category not found.</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-detail-header">
                <Link to="/admin/categories" className="btn btn-outline">Back</Link>
                <strong>{category.name}</strong>
            </div>
            <div className="dashboard-panel admin-detail-grid">
                <article><span>Slug</span><strong>{category.slug}</strong></article>
                <article><span>Status</span><strong>{category.is_active ? 'Active' : 'Inactive'}</strong></article>
                <article><span>Voting</span><strong>{category.voting_enabled ? 'Enabled' : 'Disabled'}</strong></article>
                <article><span>Sort order</span><strong>{category.sort_order}</strong></article>
                <article><span>Form type</span><strong>{category.pricing?.form_type ?? 'free'}</strong></article>
                <article><span>Application fee</span><strong>{category.pricing?.application_fee ?? 0} {category.pricing?.currency ?? 'TZS'}</strong></article>
                <article className="full"><span>Description</span><strong>{category.description ?? 'No description'}</strong></article>
            </div>
        </div>
    );
}
