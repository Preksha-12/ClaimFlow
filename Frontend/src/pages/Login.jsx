// pages/Login.jsx — Module: Authentication (Preksha)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "./Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email:"", password:"" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => { setForm(p=>({...p,[e.target.name]:e.target.value})); if(error) setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email||!form.password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const data = await loginUser(form.email, form.password);
      const userData = data.user
        ? { ...data.user, token: data.token }
        : { userId:data.userId, name:data.name, email:data.email, role:data.role, token:data.token };
      if (!userData.token) throw new Error("No token received from server.");
      localStorage.setItem("user",  JSON.stringify(userData));
      localStorage.setItem("token", userData.token);
      onLogin(userData);
      navigate("/dashboard");
    } catch(err) { setError(err.message||"Login failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="login-bg">
      <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
      <div className="login-wrapper animate-fade-up">
        <div className="login-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="var(--accent)"/>
              <path d="M9 12l2 2 4-4" stroke="#0b0f1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div><h1 className="login-brand">ClaimFlow</h1><p className="login-tagline">Insurance Claim Portal</p></div>
        </div>
        <div className="login-card">
          <div className="login-card-header"><h2>Welcome back</h2><p>Sign in to access your insurance dashboard</p></div>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="field-group">
              <label className="field-label">Email address</label>
              <div className="field-input-wrap">
                <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="currentColor" strokeWidth="2"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/></svg></span>
                <input name="email" type="email" className="field-input" placeholder="you@company.com" value={form.email} onChange={handleChange} autoComplete="email"/>
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-input-wrap">
                <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                <input name="password" type={showPass?"text":"password"} className="field-input" placeholder="Enter your password" value={form.password} onChange={handleChange} autoComplete="current-password"/>
                <button type="button" className="field-toggle" onClick={()=>setShowPass(p=>!p)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </div>
            </div>
            {error && <div className="login-error animate-fade"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{error}</div>}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading?<><span className="btn-spinner"/>Signing in…</>:<>Sign In <span className="btn-arrow">→</span></>}
            </button>
          </form>
          <p className="signup-prompt">Don't have an account?{" "}<button className="signup-link-btn" onClick={()=>navigate("/signup")}>Create Account</button></p>
        </div>
        <p className="login-footer">Secured by ClaimFlow™ · All sessions encrypted</p>
      </div>
    </div>
  );
}
