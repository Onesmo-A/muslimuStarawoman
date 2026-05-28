import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../../services/api/authApi';
import { getLandingPath, saveAuth } from '../../shared/auth';

export function AuthPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();
    const [payload, setPayload] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        setPayload((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            if (mode === 'login') {
                const result = await login({ email: payload.email, password: payload.password }).unwrap();
                saveAuth(result.data.user, result.data.token);
                setMessage('Login successful.');
                navigate(getLandingPath(result.data.user), { replace: true });
            } else {
                const result = await register(payload).unwrap();
                saveAuth(result.data.user, result.data.token);
                setMessage('Registration successful.');
                navigate(getLandingPath(result.data.user), { replace: true });
            }
        } catch (error) {
            setMessage(error?.data?.message ?? 'Request failed');
        }
    };

    return (
        <section className="auth-shell">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Admin Access</h1>
                    <p>Sign in or create an account to manage awards operations.</p>
                </div>
                <div className="auth-tabs">
                    <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                        Login
                    </button>
                    <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
                        Register
                    </button>
                </div>
                <form className="auth-form" onSubmit={onSubmit}>
                    {mode === 'register' ? (
                        <label>
                            <span>Full Name</span>
                            <input name="name" value={payload.name} onChange={onChange} placeholder="Jane Doe" />
                        </label>
                    ) : null}
                    <label>
                        <span>Email</span>
                        <input name="email" type="email" value={payload.email} onChange={onChange} placeholder="you@example.com" />
                    </label>
                    <label>
                        <span>Password</span>
                        <input name="password" type="password" value={payload.password} onChange={onChange} />
                    </label>
                    {mode === 'register' ? (
                        <label>
                            <span>Confirm Password</span>
                            <input
                                name="password_confirmation"
                                type="password"
                                value={payload.password_confirmation}
                                onChange={onChange}
                            />
                        </label>
                    ) : null}
                    {message ? <div className="auth-message">{message}</div> : null}
                    <button type="submit" className="btn btn-gold">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
                </form>
                <div className="auth-footnote">
                    Secure access for judges, admins, and sponsors.
                </div>
            </div>
        </section>
    );
}
