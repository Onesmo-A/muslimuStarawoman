import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../../services/api/authApi';
import { baseApi } from '../../services/api/baseApi';
import { getLandingPath, saveAuth } from '../../shared/auth';
import logo from '../../assets/mswa-logo.png';

export function AuthPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();
    const [payload, setPayload] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });
    const [visiblePasswords, setVisiblePasswords] = useState({
        password: false,
        password_confirmation: false,
    });
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        setPayload((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const togglePassword = (field) => {
        setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            if (mode === 'login') {
                const result = await login({ email: payload.email, password: payload.password }).unwrap();
                saveAuth(result.data.user, result.data.token);
                dispatch(baseApi.util.resetApiState());
                setMessage('Login successful.');
                navigate(getLandingPath(result.data.user), { replace: true });
            } else {
                const result = await register(payload).unwrap();
                saveAuth(result.data.user, result.data.token);
                dispatch(baseApi.util.resetApiState());
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
                    <div className="auth-brand-emblem">
                        <img src={logo} alt="Muslim Stara Women Awards logo" />
                    </div>
                    <p>One secure login for applicants, voters, judges, sponsors, and administrators.</p>
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
                            <input name="name" value={payload.name} onChange={onChange} placeholder="Amina Hassan" />
                        </label>
                    ) : null}
                    {mode === 'register' ? (
                        <label>
                            <span>Phone Number</span>
                            <input name="phone" type="tel" value={payload.phone} onChange={onChange} placeholder="+255..." />
                        </label>
                    ) : null}
                    <label>
                        <span>Email</span>
                        <input name="email" type="email" value={payload.email} onChange={onChange} placeholder="you@example.com" />
                    </label>
                    <label>
                        <span>Password</span>
                        <span className="password-input-wrap">
                            <input
                                name="password"
                                type={visiblePasswords.password ? 'text' : 'password'}
                                value={payload.password}
                                onChange={onChange}
                            />
                            <button type="button" onClick={() => togglePassword('password')} aria-label={visiblePasswords.password ? 'Hide password' : 'Show password'}>
                                <i className={`fas ${visiblePasswords.password ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                            </button>
                        </span>
                    </label>
                    {mode === 'register' ? (
                        <label>
                            <span>Confirm Password</span>
                            <span className="password-input-wrap">
                                <input
                                    name="password_confirmation"
                                    type={visiblePasswords.password_confirmation ? 'text' : 'password'}
                                    value={payload.password_confirmation}
                                    onChange={onChange}
                                />
                                <button type="button" onClick={() => togglePassword('password_confirmation')} aria-label={visiblePasswords.password_confirmation ? 'Hide password' : 'Show password'}>
                                    <i className={`fas ${visiblePasswords.password_confirmation ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"></i>
                                </button>
                            </span>
                        </label>
                    ) : null}
                    {message ? <div className="auth-message">{message}</div> : null}
                    <button type="submit" className="btn btn-gold">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
                </form>
            </div>
        </section>
    );
}
