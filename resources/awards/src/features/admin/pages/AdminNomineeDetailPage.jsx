import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAdminNomineeQuery } from '../../../services/api/platformApi';

const nomineeImage = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http') || photoPath.startsWith('/')) return photoPath;

    return `/storage/${photoPath}`;
};

export function AdminNomineeDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useAdminNomineeQuery(id);
    const nominee = data?.data;
    const image = nomineeImage(nominee?.photo_path);

    if (isLoading) {
        return <div className="dashboard-panel">Loading nominee...</div>;
    }

    if (!nominee) {
        return <div className="dashboard-panel">Nominee not found.</div>;
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-detail-header">
                <Link to="/admin/nominees" className="btn btn-outline">Back</Link>
                <strong>{nominee.contact_person}</strong>
            </div>
            {image ? (
                <div className="admin-detail-photo">
                    <img src={image} alt={nominee.contact_person} />
                </div>
            ) : null}
            <div className="dashboard-panel admin-detail-grid">
                <article><span>Business / Brand</span><strong>{nominee.business_name}</strong></article>
                <article><span>Category</span><strong>{nominee.category?.name ?? 'No category'}</strong></article>
                <article><span>Status</span><strong>{nominee.status}</strong></article>
                <article><span>Email</span><strong>{nominee.email}</strong></article>
                <article><span>Phone</span><strong>{nominee.phone ?? 'Not set'}</strong></article>
                <article><span>Location</span><strong>{[nominee.city, nominee.country].filter(Boolean).join(', ') || 'Not set'}</strong></article>
                <article><span>Website</span><strong>{nominee.website ?? 'Not set'}</strong></article>
                <article><span>Video</span><strong>{nominee.video_url ?? 'Not set'}</strong></article>
                <article className="full"><span>Profile</span><strong>{nominee.company_profile ?? 'No profile'}</strong></article>
            </div>
        </div>
    );
}
