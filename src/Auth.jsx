import React, { useState } from 'react';
    import { supabase } from './supabaseClient';

    function Auth() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [isSignUp, setIsSignUp] = useState(false);

      const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
          if (isSignUp) {
            const { error } = await supabase.auth.signUp({
              email,
              password,
            });
            if (error) throw error;
            alert('Sign up successful! Please check your email to verify your account.');
          } else {
            const { error } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            if (error) throw error;
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="auth-form">
          <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleAuthAction}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      );
    }

    export default Auth;
