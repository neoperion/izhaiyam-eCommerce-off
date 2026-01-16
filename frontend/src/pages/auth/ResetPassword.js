import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../config';
import '../policies/policies.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const token = location.state?.token;

    if (!token) {
        return (
             <div className="policy-container" style={{ textAlign: 'center', padding: '5rem' }}>
                <p>Error: invalid session. Please start over.</p>
                <button onClick={() => navigate('/forgot-password')}>Go Back</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            await axios.post(`${API}/api/v1/auth/reset-password`, { token, newPassword: password });
            setMessage('Password updated successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="policy-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <div className="policy-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 className="policy-title">Reset Password</h1>
                <p>Create a new password for your account.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                     <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ padding: '0.8rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>

                {message && <p style={{ marginTop: '1rem', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
