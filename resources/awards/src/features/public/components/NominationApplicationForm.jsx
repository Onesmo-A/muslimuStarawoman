import React, { useState } from 'react';

const initialForm = {
    award_category_id: '',
    nominee_name: '',
    city: '',
    phone: '',
    profile: '',
};

export function NominationApplicationForm({ categories, isCreating, onCreate, onSuccess }) {
    const [form, setForm] = useState(initialForm);

    const onChange = (event) => {
        setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        await onCreate({
            award_category_id: Number(form.award_category_id),
            form_payload: {
                nominee_name: form.nominee_name,
                city: form.city,
                phone: form.phone,
                profile: form.profile,
            },
        });

        setForm(initialForm);
        onSuccess?.();
    };

    return (
        <div className="nomination-application-card">
            <div className="nomination-application-head">
                <div>
                    <span className="eyebrow">Application Form</span>
                    <h3>Submit nomination</h3>
                </div>
                <i className="fas fa-file-signature" aria-hidden="true"></i>
            </div>

            <form className="nomination-form nomination-application-form" onSubmit={onSubmit}>
                <label>
                    <span>Category</span>
                    <select name="award_category_id" value={form.award_category_id} onChange={onChange} required>
                        <option value="">Choose a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <span>Nominee name</span>
                    <input name="nominee_name" value={form.nominee_name} onChange={onChange} required />
                </label>
                <label>
                    <span>City</span>
                    <input name="city" value={form.city} onChange={onChange} />
                </label>
                <label>
                    <span>Phone</span>
                    <input name="phone" type="tel" value={form.phone} onChange={onChange} required />
                </label>
                <label className="full">
                    <span>Short profile</span>
                    <textarea name="profile" value={form.profile} onChange={onChange} rows="6" />
                </label>
                <div className="form-actions">
                    <button type="submit" className="btn btn-gold" disabled={isCreating}>
                        {isCreating ? (
                            <>
                                <i className="fas fa-circle-notch fa-spin" aria-hidden="true"></i>
                                Submitting...
                            </>
                        ) : 'Submit nomination'}
                    </button>
                </div>
            </form>
        </div>
    );
}
