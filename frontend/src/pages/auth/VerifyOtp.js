import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../config';
import '../policies/policies.css';

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    if (!email) {
        // Fallback if accessed directly without email state
        return (
            <div className="policy-container" style={{ textAlign: 'center', padding: '5rem' }}>
                <p>Error: Email not found. Please go back to Forgot Password.</p>
                <button onClick={() => navigate('/forgot-password')}>Go Back</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`${API}/api/v1/auth/verify-otp`, { email, otp });
            // data.token is the temporary reset token
            navigate('/reset-password', { state: { token: data.token } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="policy-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <div className="policy-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 className="policy-title">Verify OTP</h1>
                <p>We’ve sent a 6-digit code to <strong>{email}</strong></p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength="6"
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ padding: '0.8rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                {error && <p style={{ marginTop: '1rem', color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default VerifyOtp;
