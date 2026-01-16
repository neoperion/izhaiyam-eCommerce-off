import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API from '../../config';
import '../policies/policies.css'; // Using existing CSS for consistency

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const { data } = await axios.post(`${API}/api/v1/auth/forgot-password`, { email });
            // API always returns 200 with message "If your email is registered..."
            setMessage(data.message);
            // Redirect to Verify OTP after short delay
            setTimeout(() => {
                navigate('/verify-otp', { state: { email } });
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="policy-container" style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="policy-content" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <h1 className="policy-title">Forgot Password</h1>
                <p>Enter your registered email to receive a reset code.</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="checkout-btn" // Reusing checkout button style if available, or basic button
                        style={{ padding: '0.8rem', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                {message && <p style={{ marginTop: '1rem', color: message.includes('wrong') ? 'red' : 'green' }}>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
