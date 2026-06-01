import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    useAdminCategoriesQuery,
    useAdminNomineesQuery,
    useCreateAdminNomineeMutation,
    useDeleteAdminNomineeMutation,
    useUpdateAdminNomineeMutation,
} from '../../../services/api/platformApi';
import { useToast } from '../../../shared/components/ToastProvider';
import { getToken } from '../../../shared/auth';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

const initialForm = {
    award_category_id: '',
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    country: 'Tanzania',
    company_profile: '',
    photo_path: '',
    photo: null,
    video_url: '',
    status: 'active',
};

export function AdminNomineesPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: nomineesData, isLoading } = useAdminNomineesQuery();
    const { data: categoriesData } = useAdminCategoriesQuery();
    const [createNominee, { isLoading: isCreating }] = useCreateAdminNomineeMutation();
    const [updateNominee, { isLoading: isUpdating }] = useUpdateAdminNomineeMutation();
    const [deleteNominee] = useDeleteAdminNomineeMutation();
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(initialForm);
    const nominees = nomineesData?.data ?? [];
    const categories = categoriesData?.data ?? [];
    const paginated = paginate(nominees, page, 8);

    const exportNominees = async () => {
        const token = getToken();

        if (!token) {
            toast.error('Unable to export without authentication.');
            return;
        }

        try {
            const response = await fetch('/api/v1/admin/nominees/export?type=nominees&format=pdf', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nominees-report.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            toast.success('Nominees PDF downloaded.');
        } catch (error) {
            toast.error(error?.message ?? 'Export failed.');
        }
    };

    const onChange = (event) => {
        if (event.target.type === 'file') {
            setForm((prev) => ({ ...prev, [event.target.name]: event.target.files?.[0] ?? null }));
            return;
        }

        setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(initialForm);
        setIsModalOpen(false);
    };

    const openCreateModal = () => {
        setEditingId(null);
        setForm(initialForm);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const prefill = location.state?.prefillNominee;

        if (!prefill) {
            return;
        }

        setEditingId(null);
        setForm({
            ...initialForm,
            award_category_id: prefill.award_category_id ?? '',
            contact_person: prefill.nominee_name ?? '',
            business_name: prefill.business_name ?? prefill.nominee_name ?? '',
            email: prefill.email ?? '',
            phone: prefill.phone ?? '',
            city: prefill.city ?? '',
            company_profile: prefill.profile ?? '',
        });
        setIsModalOpen(true);
        navigate('/admin/nominees', { replace: true });
    }, [location.state, navigate]);

    const editNominee = (nominee) => {
        setEditingId(nominee.id);
        setIsModalOpen(true);
        setForm({
            award_category_id: nominee.award_category_id ?? '',
            business_name: nominee.business_name ?? '',
            contact_person: nominee.contact_person ?? '',
            email: nominee.email ?? '',
            phone: nominee.phone ?? '',
            website: nominee.website ?? '',
            city: nominee.city ?? '',
            country: nominee.country ?? 'Tanzania',
            company_profile: nominee.company_profile ?? '',
            photo_path: nominee.photo_path ?? '',
            photo: null,
            video_url: nominee.video_url ?? '',
            status: nominee.status ?? 'active',
        });
    };

    const nomineeFormData = () => {
        const body = new FormData();
        body.append('award_category_id', String(form.award_category_id));
        body.append('business_name', form.business_name);
        body.append('contact_person', form.contact_person);
        body.append('email', form.email);
        body.append('status', form.status);
        ['phone', 'city', 'country', 'company_profile'].forEach((key) => {
            if (form[key]) {
                body.append(key, form[key]);
            }
        });
        if (form.photo) {
            body.append('photo', form.photo);
        }

        return body;
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const payload = nomineeFormData();

        try {
            if (editingId) {
                payload.append('_method', 'PUT');
                await updateNominee({ id: editingId, body: payload }).unwrap();
                toast.success('Nominee updated.');
            } else {
                await createNominee(payload).unwrap();
                toast.success('Nominee created.');
            }
            resetForm();
        } catch (error) {
            toast.error(error?.data?.message ?? 'Nominee save failed.');
        }
    };

    const onDelete = async (nominee) => {
        if (!window.confirm(`Delete ${nominee.contact_person}?`)) return;

        try {
            await deleteNominee(nominee.id).unwrap();
            toast.success('Nominee deleted.');
            if (editingId === nominee.id) resetForm();
        } catch (error) {
            toast.error(error?.data?.message ?? 'Nominee delete failed.');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-list-toolbar">
                <div></div>
                <div className="admin-toolbar-actions">
                    <button type="button" className="btn btn-outline" onClick={exportNominees}>
                        Export PDF
                    </button>
                    <button type="button" className="admin-add-button" onClick={openCreateModal} aria-label="Add nominee">
                        <i className="fas fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            {isModalOpen ? (
                <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && resetForm()}>
                    <div className="admin-modal" role="dialog" aria-modal="true">
                        <div className="admin-modal-header">
                            <div>
                                <span className="eyebrow">{editingId ? 'Edit Nominee' : 'New Nominee'}</span>
                                <h2>{editingId ? 'Update nominee' : 'Create nominee'}</h2>
                            </div>
                            <button type="button" className="admin-icon-button" onClick={resetForm} aria-label="Close modal">
                                <i className="fas fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div>
                        <form className="nomination-form admin-crud-form" onSubmit={onSubmit}>
                            <label>
                                <span>Category</span>
                                <select name="award_category_id" value={form.award_category_id} onChange={onChange} required>
                                    <option value="">Select category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                <span>Status</span>
                                <select name="status" value={form.status} onChange={onChange}>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </label>
                            <label>
                                <span>Nominee name</span>
                                <input name="contact_person" value={form.contact_person} onChange={onChange} required />
                            </label>
                            <label>
                                <span>Business / Brand</span>
                                <input name="business_name" value={form.business_name} onChange={onChange} required />
                            </label>
                            <label>
                                <span>Email</span>
                                <input name="email" type="email" value={form.email} onChange={onChange} required />
                            </label>
                            <label>
                                <span>Phone</span>
                                <input name="phone" value={form.phone} onChange={onChange} />
                            </label>
                            <label>
                                <span>City</span>
                                <input name="city" value={form.city} onChange={onChange} />
                            </label>
                            <label>
                                <span>Country</span>
                                <input name="country" value={form.country} onChange={onChange} />
                            </label>
                            <label>
                                <span>Photo</span>
                                <input name="photo" type="file" accept="image/*" onChange={onChange} />
                            </label>
                            <label className="full">
                                <span>Profile</span>
                                <textarea name="company_profile" value={form.company_profile} onChange={onChange} rows="4" />
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-gold" disabled={isCreating || isUpdating}>
                                    {editingId ? 'Update Nominee' : 'Create Nominee'}
                                </button>
                                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <div className="dashboard-panel">
                {isLoading ? <p>Loading nominees...</p> : null}
                <div className="admin-table">
                    {paginated.items.map((nominee) => (
                        <article key={nominee.id} className="clickable" onClick={() => navigate(`/admin/nominees/${nominee.id}`)}>
                            <div>
                                <strong>{nominee.contact_person}</strong>
                                <div className="admin-record-meta">
                                    <small>{nominee.category?.name ?? 'No category'}</small>
                                    <small>{nominee.votes_count ?? 0} votes</small>
                                </div>
                            </div>
                            <span>{nominee.status}</span>
                            <div className="admin-row-actions">
                                <button type="button" onClick={(event) => { event.stopPropagation(); editNominee(nominee); }}>Edit</button>
                                <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(nominee); }}>Delete</button>
                            </div>
                        </article>
                    ))}
                </div>
                <Pagination {...paginated} onPageChange={setPage} />
            </div>
        </div>
    );
}
