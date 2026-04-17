// pages/Signup.jsx — Module: Authentication (Preksha)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../services/api";
import "./Login.css";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", phone:"", address:"" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => { const{name,value}=e.target; setForm(p=>({...p,[name]:value})); if(errors[name]) setErrors(p=>({...p,[name]:""})); if(serverError) setServerError(""); };

  const validate = () => {
    const e={};
    if (!form.name.trim())                       e.name="Full name is required.";
    if (!form.email.trim())                      e.email="Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email="Enter a valid email.";
    if (!form.password)                          e.password="Password is required.";
    else if (form.password.length < 4)           e.password="Min 4 characters.";
    if (form.password !== form.confirmPassword)  e.confirmPassword="Passwords do not match.";
    if (form.phone && !/^\d{10}$/.test(form.phone)) e.phone="Enter valid 10-digit number.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve=validate(); if(Object.keys(ve).length>0){setErrors(ve);return;}
    setLoading(true);
    try { await signupUser({name:form.name,email:form.email,password:form.password,phone:form.phone,address:form.address}); setSuccess(true); }
    catch(err){ setServerError(err.message||"Signup failed."); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="login-bg">
      <div className="blob blob-1"/><div className="blob blob-2"/>
      <div className="login-wrapper animate-fade-up">
        <div className="login-logo">
          <div className="logo-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="var(--accent)"/><path d="M9 12l2 2 4-4" stroke="#0b0f1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div><h1 className="login-brand">ClaimFlow</h1><p className="login-tagline">Insurance Claim Portal</p></div>
        </div>
        <div className="login-card">
          <div className="signup-success">
            <div className="success-icon"><svg width="36" height="36" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="var(--accent-dim)" stroke="var(--accent)" strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
            <h2>Account Created!</h2>
            <p>Your PolicyHolder account has been created. You can now sign in.</p>
            <button className="btn-login" onClick={()=>navigate("/")}>Go to Login →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="login-bg">
      <div className="blob blob-1"/><div className="blob blob-2"/><div className="blob blob-3"/>
      <div className="login-wrapper signup-wrapper animate-fade-up">
        <div className="login-logo">
          <div className="logo-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="var(--accent)"/><path d="M9 12l2 2 4-4" stroke="#0b0f1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
          <div><h1 className="login-brand">ClaimFlow</h1><p className="login-tagline">Insurance Claim Portal</p></div>
        </div>
        <div className="login-card">
          <div className="login-card-header"><h2>Create Account</h2><p>Register as a Policy Holder</p></div>
          <div className="signup-role-banner"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2"/></svg>Signing up as <strong>Policy Holder</strong></div>
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {[["name","Full Name","text","Preksha Rao"],["email","Email Address","email","you@example.com"],["password","Password","password","Min. 4 characters"],["confirmPassword","Confirm Password","password","Re-enter password"]].map(([n,l,t,ph])=>(
              <div key={n} className={`field-group ${errors[n]?"signup-field-err":""}`}>
                <label className="field-label">{l} <span style={{color:"var(--red)"}}>*</span></label>
                <div className="field-input-wrap">
                  <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg></span>
                  <input name={n} type={t} className="field-input" placeholder={ph} value={form[n]} onChange={handleChange}/>
                </div>
                {errors[n]&&<span className="signup-err">{errors[n]}</span>}
              </div>
            ))}
            <div className="signup-divider"><span>Contact Details <span style={{color:"var(--text-muted)",fontWeight:400}}>(optional)</span></span></div>
            <div className={`field-group ${errors.phone?"signup-field-err":""}`}>
              <label className="field-label">Phone Number</label>
              <div className="field-input-wrap">
                <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.72 6.72l1.27-.34a2 2 0 012.11.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2"/></svg></span>
                <input name="phone" type="tel" className="field-input" placeholder="10-digit number" value={form.phone} onChange={handleChange}/>
              </div>
              {errors.phone&&<span className="signup-err">{errors.phone}</span>}
            </div>
            <div className="field-group">
              <label className="field-label">Address</label>
              <div className="field-input-wrap">
                <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/></svg></span>
                <input name="address" type="text" className="field-input" placeholder="City, State" value={form.address} onChange={handleChange}/>
              </div>
            </div>
            {serverError&&<div className="login-error animate-fade"><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>{serverError}</div>}
            <button type="submit" className="btn-login" disabled={loading}>
              {loading?<><span className="btn-spinner"/>Creating account…</>:<>Create Account <span className="btn-arrow">→</span></>}
            </button>
          </form>
          <p className="signup-prompt">Already have an account?{" "}<button className="signup-link-btn" onClick={()=>navigate("/")}>Sign In</button></p>
        </div>
        <p className="login-footer">Secured by ClaimFlow™ · All sessions encrypted</p>
      </div>
    </div>
  );
}
