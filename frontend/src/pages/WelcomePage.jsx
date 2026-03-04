import { useNavigate, useLocation } from 'react-router-dom';

const STORAGE_KEY = 'rememberedUsername';

function WelcomePage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Get username from navigation state OR fallback to localStorage
    const username =
        location.state?.username ||
        localStorage.getItem(STORAGE_KEY) ||
        'User';

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="page-wrapper">
            <div className="card welcome-card">
                {/* Avatar */}
                <div className="avatar">👋</div>

                {/* Success badge */}
                <div className="success-badge">
                    <span>✅</span> Authenticated Successfully
                </div>

                {/* Greeting */}
                <h1>Welcome, {username}!</h1>
                <p className="subtitle">
                    You have successfully logged in to the admin dashboard.<br />
                    Your session is active and secure.
                </p>

                <div className="divider" />

                {/* Logout */}
                <button
                    id="logout-btn"
                    className="btn-secondary"
                    onClick={handleLogout}
                >
                    ← Sign Out
                </button>
            </div>
        </div>
    );
}

export default WelcomePage;
