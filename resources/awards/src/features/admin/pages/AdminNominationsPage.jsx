import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminNominationsQuery, useReviewAdminNominationMutation, useDeleteAdminNominationMutation } from '../../../services/api/platformApi';
import { useToast } from '../../../shared/components/ToastProvider';
import { getToken } from '../../../shared/auth';
import PageLoader from '../../../shared/components/PageLoader';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

export function AdminNominationsPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const { data, isLoading, refetch } = useAdminNominationsQuery();
    const [reviewNomination, { isLoading: isReviewing }] = useReviewAdminNominationMutation();
    const [deleteNomination, { isLoading: isDeleting }] = useDeleteAdminNominationMutation();
    const [page, setPage] = React.useState(1);
    const nominations = data?.data ?? [];
    const paginated = paginate(nominations, page, 10);

    const handleReview = async (nomination, status) => {
        try {
            await reviewNomination({ id: nomination.id, status, review_notes: `${status} by admin.` }).unwrap();
            toast.success(`Nomination ${status.replace('_', ' ')}.`);
            refetch();

            if (status === 'approved') {
                navigate('/admin/nominees', {
                    state: {
                        prefillNominee: {
                            nomination_id: nomination.id,
                            award_category_id: nomination.award_category_id,
                            nominee_name: nomination.form_payload?.nominee_name,
                            business_name: nomination.form_payload?.business_name,
                            city: nomination.form_payload?.city,
                            email: nomination.user?.email,
                            phone: nomination.form_payload?.phone || nomination.user?.phone,
                            profile: nomination.form_payload?.profile,
                        },
                    },
                });
            }
        } catch (error) {
            toast.error(error?.data?.message ?? 'Review update failed.');
        }
    };

    const handleDelete = async (nomination) => {
        if (!window.confirm(`Delete nomination ${nomination.reference}?`)) return;

        try {
            await deleteNomination(nomination.id).unwrap();
            toast.success('Nomination deleted.');
            refetch();
        } catch (error) {
            toast.error(error?.data?.message ?? 'Delete failed.');
        }
    };

    const handleExport = useCallback(async () => {
        const token = getToken();

        if (!token) {
            toast.error('Unable to export without authentication.');
            return;
        }

        try {
            const response = await fetch('/api/v1/admin/reports/export?type=nominations&format=pdf', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nominations-report.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success('PDF export downloaded.');
        } catch (error) {
            toast.error(error?.message ?? 'Export failed.');
        }
    }, [toast]);

    const handleExportCSV = () => {
        if (nominations.length === 0) {
            toast.info('Hakuna data ya ku-export.');
            return;
        }

        const headers = ['Reference', 'Applicant', 'Email', 'Category', 'Nominee', 'City', 'Phone', 'Status', 'Date'];
        const rows = nominations.map(n => [
            n.reference,
            `"${n.user?.name || 'N/A'}"`,
            n.user?.email,
            `"${n.category?.name || 'Unassigned'}"`,
            `"${n.form_payload?.nominee_name || 'N/A'}"`,
            `"${n.form_payload?.city || ''}"`,
            `"${n.form_payload?.phone || n.user?.phone || ''}"`,
            n.status,
            n.submitted_at ? new Date(n.submitted_at).toLocaleDateString() : 'Draft'
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `nominations_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('CSV Export imepakuliwa.');
    };

    if (isLoading) return <PageLoader />;

    return (
        <div className="admin-dashboard mswa-page-shell">
            <div className="admin-list-toolbar">
                <div></div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="btn btn-outline" onClick={handleExportCSV}>
                        Export CSV
                    </button>
                    <button type="button" className="btn btn-outline" onClick={handleExport}>
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="dashboard-panel">
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>User</th>
                                <th>Category</th>
                                <th>Nominee</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.items.map((nomination) => (
                                <tr key={nomination.id}>
                                    <td>
                                        <strong>{nomination.reference}</strong>
                                        <br/>
                                        <small>{nomination.submitted_at ? new Date(nomination.submitted_at).toLocaleDateString() : 'Draft'}</small>
                                    </td>
                                    <td>
                                        {nomination.user?.name || 'Unknown'}
                                        <br/>
                                        <small className="muted">{nomination.user?.email}</small>
                                        <br/>
                                        <small className="muted">{nomination.user?.phone}</small>
                                    </td>
                                    <td>{nomination.category?.name || 'N/A'}</td>
                                    <td>
                                        {nomination.form_payload?.nominee_name || 'N/A'}
                                        <br/>
                                        <small className="muted">{nomination.form_payload?.city || nomination.form_payload?.phone || nomination.user?.phone || ''}</small>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${nomination.status}`}>
                                            {nomination.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-row-actions" style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-small" onClick={() => handleReview(nomination, 'approved')} disabled={isReviewing}>
                                                {isReviewing ? <i className="fas fa-spinner fa-spin"></i> : 'Approve & create nominee'}
                                            </button>
                                            <button className="btn-small btn-outline" onClick={() => handleReview(nomination, 'rejected')} disabled={isReviewing}>
                                                Reject
                                            </button>
                                            <button className="btn-small btn-danger" onClick={() => handleDelete(nomination)} disabled={isDeleting}>
                                                {isDeleting ? <i className="fas fa-spinner fa-spin"></i> : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination {...paginated} onPageChange={setPage} />
            </div>
        </div>
    );
}
