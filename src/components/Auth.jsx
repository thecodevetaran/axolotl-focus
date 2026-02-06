import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth({ onLogin }) {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [msg, setMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg('');

        let error = null;

        if (isSignUp) {
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });
            if (!signUpError) {
                setMsg('Check your email for the confirmation link!');
            }
            error = signUpError;
        } else {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            error = signInError;
        }

        if (error) {
            setMsg(error.message);
        } else if (!isSignUp) {
            // Success
            if (onLogin) onLogin();
        }

        setLoading(false);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                {isSignUp
                    ? 'Sign up to sync your Axolotl XP across devices!'
                    : 'Log in to load your Axolotl.'}
            </p>

            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        border: '1px solid var(--border-color)'
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '12px',
                        color: 'white',
                        border: '1px solid var(--border-color)'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '1rem',
                        background: 'var(--accent-primary)',
                        color: 'var(--bg-primary)',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        marginTop: '0.5rem'
                    }}
                >
                    {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                </button>
            </form>

            {msg && <p style={{ marginTop: '1rem', color: 'var(--accent-secondary)', textAlign: 'center' }}>{msg}</p>}

            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                    onClick={() => { setIsSignUp(!isSignUp); setMsg(''); }}
                    style={{
                        background: 'none',
                        color: 'var(--accent-primary)',
                        marginLeft: '0.5rem',
                        textDecoration: 'underline'
                    }}
                >
                    {isSignUp ? 'Log in' : 'Sign up'}
                </button>
            </p>
        </div>
    );
}
