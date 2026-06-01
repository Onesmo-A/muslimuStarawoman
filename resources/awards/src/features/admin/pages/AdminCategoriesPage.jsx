import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useAdminCategoriesQuery,
    useCreateAdminCategoryMutation,
    useDeleteAdminCategoryMutation,
    useUpdateAdminCategoryMutation,
} from '../../../services/api/platformApi';
import { useToast } from '../../../shared/components/ToastProvider';
import { paginate, Pagination } from '../../../shared/components/ui/Pagination';

const initialForm = {
    name: '',
    slug: '',
    description: '',
    voting_enabled: true,
    is_active: true,
    sort_order: 1,
    form_type: 'free',
    application_fee: 0,
    currency: 'TZS',
    early_bird_fee: '',
    deadline: '',
};

export function AdminCategoriesPage() {
    const toast = useToast();
    const navigate = useNavigate();
    const { data, isLoading } = useAdminCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateAdminCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateAdminCategoryMutation();
    const [deleteCategory] = useDeleteAdminCategoryMutation();
    const [editingId, setEditingId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [form, setForm] = useState(initialForm);
    const categories = data?.data ?? [];
    const paginated = paginate(categories, page, 8);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

    const editCategory = (category) => {
        setEditingId(category.id);
        setIsModalOpen(true);
        setForm({
            name: category.name ?? '',
            slug: category.slug ?? '',
            description: category.description ?? '',
            voting_enabled: Boolean(category.voting_enabled),
            is_active: Boolean(category.is_active),
            sort_order: category.sort_order ?? 1,
            form_type: category.pricing?.form_type ?? 'free',
            application_fee: category.pricing?.application_fee ?? 0,
            currency: category.pricing?.currency ?? 'TZS',
            early_bird_fee: category.pricing?.early_bird_fee ?? '',
            deadline: category.pricing?.deadline ? category.pricing.deadline.slice(0, 16) : '',
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        const payload = {
            ...form,
            sort_order: Number(form.sort_order || 1),
            application_fee: Number(form.application_fee || 0),
            early_bird_fee: form.early_bird_fee === '' ? null : Number(form.early_bird_fee),
            deadline: form.deadline || null,
        };

        try {
            if (editingId) {
                await updateCategory({ id: editingId, ...payload }).unwrap();
                toast.success('Category updated.');
            } else {
                await createCategory(payload).unwrap();
                toast.success('Category created.');
            }
            resetForm();
        } catch (error) {
            toast.error(error?.data?.message ?? 'Category save failed.');
        }
    };

    const onDelete = async (category) => {
        if (!window.confirm(`Delete ${category.name}?`)) return;

        try {
            await deleteCategory(category.id).unwrap();
            toast.success('Category deleted.');
            if (editingId === category.id) resetForm();
        } catch (error) {
            toast.error(error?.data?.message ?? 'Category delete failed.');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-list-toolbar">
                <div></div>
                <button type="button" className="admin-add-button" onClick={openCreateModal} aria-label="Add category">
                    <i className="fas fa-plus" aria-hidden="true"></i>
                </button>
            </div>

            {isModalOpen ? (
                <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && resetForm()}>
                    <div className="admin-modal" role="dialog" aria-modal="true">
                        <div className="admin-modal-header">
                            <div>
                                <span className="eyebrow">{editingId ? 'Edit Category' : 'New Category'}</span>
                                <h2>{editingId ? 'Update category' : 'Create category'}</h2>
                            </div>
                            <button type="button" className="admin-icon-button" onClick={resetForm} aria-label="Close modal">
                                <i className="fas fa-xmark" aria-hidden="true"></i>
                            </button>
                        </div>
                        <form className="nomination-form admin-crud-form" onSubmit={onSubmit}>
                            <label>
                                <span>Name</span>
                                <input name="name" value={form.name} onChange={onChange} required />
                            </label>
                            <label>
                                <span>Slug</span>
                                <input name="slug" value={form.slug} onChange={onChange} placeholder="auto-generated if empty" />
                            </label>
                            <label className="full">
                                <span>Description</span>
                                <textarea name="description" value={form.description} onChange={onChange} rows="3" />
                            </label>
                            <label>
                                <span>Form type</span>
                                <select name="form_type" value={form.form_type} onChange={onChange}>
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </label>
                            <label>
                                <span>Application fee</span>
                                <input name="application_fee" type="number" min="0" value={form.application_fee} onChange={onChange} />
                            </label>
                            <label>
                                <span>Currency</span>
                                <input name="currency" value={form.currency} onChange={onChange} />
                            </label>
                            <label>
                                <span>Early bird fee</span>
                                <input name="early_bird_fee" type="number" min="0" value={form.early_bird_fee} onChange={onChange} />
                            </label>
                            <label>
                                <span>Deadline</span>
                                <input name="deadline" type="datetime-local" value={form.deadline} onChange={onChange} />
                            </label>
                            <label>
                                <span>Sort order</span>
                                <input name="sort_order" type="number" min="1" value={form.sort_order} onChange={onChange} />
                            </label>
                            <label className="admin-checkbox">
                                <input name="voting_enabled" type="checkbox" checked={form.voting_enabled} onChange={onChange} />
                                <span>Voting enabled</span>
                            </label>
                            <label className="admin-checkbox">
                                <input name="is_active" type="checkbox" checked={form.is_active} onChange={onChange} />
                                <span>Active</span>
                            </label>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-gold" disabled={isCreating || isUpdating}>
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                                <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <div className="dashboard-panel">
                {isLoading ? <p>Loading categories...</p> : null}
                <div className="admin-table">
                    {paginated.items.map((category) => (
                        <article key={category.id} className="clickable" onClick={() => navigate(`/admin/categories/${category.id}`)}>
                            <div>
                                <strong>{category.name}</strong>
                                <div className="admin-record-meta">
                                    <small>{category.nominees_count ?? 0} nominees</small>
                                    <small>{category.nominations_count ?? 0} applications</small>
                                </div>
                            </div>
                            <span>{category.is_active ? 'active' : 'inactive'} / {category.voting_enabled ? 'voting on' : 'voting off'}</span>
                            <div className="admin-row-actions">
                                <button type="button" onClick={(event) => { event.stopPropagation(); editCategory(category); }}>Edit</button>
                                <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(category); }}>Delete</button>
                            </div>
                        </article>
                    ))}
                </div>
                <Pagination {...paginated} onPageChange={setPage} />
            </div>
        </div>
    );
}
