import React from 'react';
import { Link } from 'react-router-dom';
import { useCategoriesQuery, useCreateNominationMutation } from '../../services/api/platformApi';
import { useToast } from '../../shared/components/ToastProvider';
import { NominationApplicationForm } from '../public/components/NominationApplicationForm';

export function ApplyNominationPage() {
    const toast = useToast();
    const { data: categoriesData, isLoading: isCategoriesLoading } = useCategoriesQuery();
    const [createNomination, { isLoading: isCreating }] = useCreateNominationMutation();
    const categories = categoriesData?.data ?? [];

    const handleCreateNomination = async (payload) => {
        try {
            await createNomination(payload).unwrap();
            toast.success('Nomination submitted. Admin will review it shortly.');
        } catch (error) {
            toast.error(error?.data?.message ?? 'Could not submit nomination.');
            throw error;
        }
    };

    return (
        <section className="account-apply-page">
            <div className="account-page-toolbar">
                <div>
                    <span className="eyebrow">Apply / Nominate</span>
                    <h2>Nomination application</h2>
                </div>
                <Link to="/dashboard" className="btn btn-outline">My applications</Link>
            </div>

            {isCategoriesLoading ? (
                <div className="dashboard-panel">Loading categories...</div>
            ) : (
                <NominationApplicationForm
                    categories={categories}
                    isCreating={isCreating}
                    onCreate={handleCreateNomination}
                />
            )}
        </section>
    );
}
