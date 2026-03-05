import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STORAGE_KEY = 'rememberedUsername';
const API_URL = 'https://login-app-r133.onrender.com/login';

function LoginPage() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Restore remembered username on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setUsername(saved);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_URL, { username, password });

            if (response.status === 200) {
                // Remember the username for future logins
                localStorage.setItem(STORAGE_KEY, username);
                // Navigate to welcome page
                navigate('/welcome', { state: { username: response.data.username } });
            }
        } catch (err) {
            if (err.response) {
                // Server responded with a non-2xx status
                setError(err.response.data?.message || 'An error occurred. Please try again.');
            } else if (err.request) {
                // No response received (network issue)
                setError('Cannot connect to server. Please make sure the backend is running.');
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="card">
                {/* Brand */}
                <div className="brand">
                    <div className="brand-icon">🔐</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account to continue</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message" role="alert" aria-live="polite">
                        <span>⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form className="form" onSubmit={handleSubmit} noValidate>
                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className="input-wrapper">
                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setError('');
                                }}
                                required
                                autoComplete="username"
                                autoFocus
                                aria-describedby={error ? 'login-error' : undefined}
                            />
                            <span className="input-icon">👤</span>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                id="password"
                                type="password"
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }}
                                required
                                autoComplete="current-password"
                            />
                            <span className="input-icon">🔑</span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn-primary"
                        id="login-btn"
                        disabled={loading || !username.trim() || !password.trim()}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                Signing in…
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Footer hint */}
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Use <strong style={{ color: 'var(--primary-light)' }}>admin</strong> / <strong style={{ color: 'var(--primary-light)' }}>admin</strong> to log in
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
