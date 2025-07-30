"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './Form.css';

// This is the dedicated, standalone form component.
export default function Form() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Remove the useEffect that calls supabase.auth.signOut() on mount

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // console.log('Auth state changed:', event, session?.user?.email);
      if (event === 'SIGNED_IN' && session?.user && pendingUserData && !isProcessing) {
                  // console.log('✅ User signed in, processing registration...');
        setIsProcessing(true);
        await processUserRegistration(session.user, pendingUserData.name, pendingUserData.email);
        setPendingUserData(null);
        setIsProcessing(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingUserData, isProcessing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      setPendingUserData({ name: formData.name, email: formData.email });
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: { data: { name: formData.name }, emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      setMessage('Check your email for the magic link!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setPendingUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const processUserRegistration = async (user, userName, userEmail) => {
    try {
      const { data: existingUser } = await supabase.from('Users_Log').select('id').eq('id', user.id);
      if (existingUser && existingUser.length > 0) {
        setMessage('✅ Welcome back! You are already registered.');
      } else {
        await supabase.from('Users_Log').insert({ id: user.id, Name: userName, Email: userEmail });
        setMessage('✅ Registration complete! You are now logged in.');
      }
      setFormData({ name: '', email: '' });
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="superhuman-form-card">
      <div className="form-header">
        <h1 className="form-title">Land the Interview.</h1>
        <h2 className="form-subtitle">Tailor Your Resume with AI.</h2>
      </div>
      
      <form className="superhuman-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Username"
          className="superhuman-input"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        <input
          name="email"
          placeholder="Enter email"
          className="superhuman-input"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        <button className="superhuman-btn" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Magic Link'}
        </button>
        
        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
      
      <div className="trust-section">
        <div className="magic-message">
          <h3 className="magic-title">Enter email & see magic</h3>
          <p className="magic-description">
            Get instant access to AI-powered resume optimization. 
            No passwords, no hassle - just pure magic.
          </p>
        </div>
      </div>
    </div>
  );
}