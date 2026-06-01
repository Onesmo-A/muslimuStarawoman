import React, { useState } from 'react';
import { useChangePasswordMutation } from '../../services/api/authApi';
import { useToast } from '../../shared/components/ToastProvider';
import { useAuth } from '../../shared/hooks/useAuth';

export function ProfilePage() {
    const { user } = useAuth();
    const toast = useToast();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [payload, setPayload] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const initials = (user?.name ?? 'User')
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const onChange = (event) => {
        setPayload((current) => ({ ...current, [event.target.name]: event.target.value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            await changePassword(payload).unwrap();
            toast.success('Password changed successfully.');
            setPayload({ current_password: '', password: '', password_confirmation: '' });
        } catch (error) {
            toast.error(error?.data?.message ?? 'Password change failed.');
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-grid">
                <section className="dashboard-panel">
                    <div className="profile-panel-head">
                        <div className="profile-avatar">{initials}</div>
                        <div>
                            <span className="eyebrow">Profile</span>
                            <h2>Account details</h2>
                        </div>
                    </div>
                    <div className="profile-detail-list">
                        <article><span>Name</span><strong>{user?.name ?? '-'}</strong></article>
                        <article><span>Email</span><strong>{user?.email ?? '-'}</strong></article>
                        <article><span>Phone</span><strong>{user?.phone ?? '-'}</strong></article>
                        <article><span>Account Type</span><strong>{user?.user_type ?? '-'}</strong></article>
                        <article><span>Status</span><strong>{user?.status ?? '-'}</strong></article>
                    </div>
                </section>

                <section className="dashboard-panel">
                    <span className="eyebrow">Security</span>
                    <h2>Change password</h2>
                    <form className="password-form" onSubmit={onSubmit}>
                        <label>
                            <span>Current password</span>
                            <input
                                name="current_password"
                                type="password"
                                value={payload.current_password}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>
                            <span>New password</span>
                            <input
                                name="password"
                                type="password"
                                value={payload.password}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <label>
                            <span>Confirm new password</span>
                            <input
                                name="password_confirmation"
                                type="password"
                                value={payload.password_confirmation}
                                onChange={onChange}
                                required
                            />
                        </label>
                        <button type="submit" className="btn btn-gold" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
