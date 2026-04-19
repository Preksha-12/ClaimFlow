// pages/SubmitClaim.jsx — Module: Claim Submission (Piyush)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { submitClaim, fetchPolicies } from "../services/api";
import "./SubmitClaim.css";

export default function SubmitClaim({ user, onLogout }) {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ policyId:"", claimAmount:"", description:"", claimType:"" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState(null);
  const [policies, setPolicies]               = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [policiesError, setPoliciesError]     = useState("");
  const claimTypes = ["Vehicle Damage","Medical Expense","Property Damage","Natural Disaster","Theft","Other"];

  useEffect(() => {
    fetchPolicies(user?.userId)
      .then(d=>setPolicies(d))
      .catch(()=>setPoliciesError("Could not load policies."))
      .finally(()=>setPoliciesLoading(false));
  }, [user?.userId]);

  const handleChange = (e) => { const{name,value}=e.target; setForm(p=>({...p,[name]:value})); if(errors[name]) setErrors(p=>({...p,[name]:""})); };
  const selectedPolicy = policies.find(p=>String(p.policyId)===String(form.policyId));

  const validate = () => {
    const e={};
    if (!form.policyId)    e.policyId="Please select a policy.";
    if (!form.claimAmount) e.claimAmount="Claim amount is required.";
    else if (isNaN(form.claimAmount)||Number(form.claimAmount)<=0) e.claimAmount="Enter a valid amount.";
    else if (selectedPolicy&&Number(form.claimAmount)>selectedPolicy.coverageAmount) e.claimAmount=`Exceeds coverage of ₹${Number(selectedPolicy.coverageAmount).toLocaleString("en-IN")}.`;
    if (!form.claimType) e.claimType="Please select a claim type.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve=validate(); if(Object.keys(ve).length>0){setErrors(ve);return;}
    setLoading(true);
    try {
      await submitClaim({ policyId:Number(form.policyId), claimAmount:Number(form.claimAmount), claimType:form.claimType, description:form.description, userId:user?.userId });
      setToast({message:"Claim submitted successfully!",type:"success"});
      setForm({policyId:"",claimAmount:"",description:"",claimType:""});
      setTimeout(()=>navigate("/track-claims"),2200);
    } catch(err){ setToast({message:err.message||"Failed to submit claim.",type:"error"}); }
    finally { setLoading(false); }
  };

  return (
    <div className="submit-layout">
      <Navbar user={user} onLogout={onLogout}/>
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      <main className="submit-main">
        <div className="page-header animate-fade-up">
          <button className="back-btn" onClick={()=>navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Dashboard
          </button>
          <div className="page-header-text"><h1>Submit New Claim</h1><p>Fill in the details to file a new insurance claim</p></div>
        </div>
        <div className="submit-content">
          <div className="submit-sidebar animate-fade-up" style={{animationDelay:"100ms"}}>
            <div className="sidebar-card">
              <div className="sidebar-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></div>
              <h3>Claim Guidelines</h3>
              <ul className="sidebar-list">
                <li>Select your active policy from the dropdown</li>
                <li>Claim amount cannot exceed policy coverage</li>
                <li>Choose the correct claim type</li>
                <li>Claims reviewed within 3–5 business days</li>
              </ul>
            </div>
            {selectedPolicy&&(
              <div className="sidebar-card" style={{marginTop:0}}>
                <div className="sidebar-icon" style={{background:"var(--accent-dim)",color:"var(--accent)"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2"/></svg></div>
                <h3>Selected Policy</h3>
                <ul className="sidebar-list">
                  <li>ID: {selectedPolicy.policyId}</li>
                  <li>Type: {selectedPolicy.policyType}</li>
                  <li style={{color:"var(--accent)",fontWeight:600}}>Max: ₹{Number(selectedPolicy.coverageAmount).toLocaleString("en-IN")}</li>
                  <li>Status: {selectedPolicy.status}</li>
                </ul>
              </div>
            )}
            <div className="sidebar-steps">
              <h4>Process Flow</h4>
              {["Submit Claim","Surveyor Review","Officer Decision","Settlement"].map((s,i)=>(
                <div key={s} className={`process-step ${i===0?"step-active":""}`}>
                  <span className="step-num">{i+1}</span><span className="step-label">{s}</span>
                  {i<3&&<div className="step-line"/>}
                </div>
              ))}
            </div>
          </div>
          <div className="submit-form-card animate-fade-up" style={{animationDelay:"200ms"}}>
            {!policiesLoading&&!policiesError&&policies.length===0&&(
              <div className="no-policy-banner">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2"/></svg>
                <div><strong>No policies assigned to your account</strong><p>Contact your Insurance Agent to get a policy assigned before submitting a claim.</p></div>
              </div>
            )}
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-section">
                <h3 className="form-section-title">Policy Information</h3>
                <div className={`field-group ${errors.policyId?"field-error":""}`}>
                  <label className="field-label">Select Policy <span className="required">*</span></label>
                  <div className="field-input-wrap">
                    <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2"/></svg></span>
                    {policiesLoading?(<select className="field-input field-select" disabled><option>Loading…</option></select>)
                    :policiesError?(<select className="field-input field-select" disabled><option>{policiesError}</option></select>)
                    :policies.length===0?(<select className="field-input field-select" disabled><option>No policies — contact Insurance Agent</option></select>)
                    :(<select name="policyId" className="field-input field-select" value={form.policyId} onChange={handleChange}>
                        <option value="">Select your policy…</option>
                        {policies.map(p=><option key={p.policyId} value={p.policyId}>#{p.policyId} — {p.policyType} (Max: ₹{Number(p.coverageAmount).toLocaleString("en-IN")})</option>)}
                      </select>)}
                  </div>
                  {errors.policyId&&<span className="field-err-msg">{errors.policyId}</span>}
                </div>
                <div className={`field-group ${errors.claimType?"field-error":""}`}>
                  <label className="field-label">Claim Type <span className="required">*</span></label>
                  <div className="field-input-wrap">
                    <span className="field-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2"/></svg></span>
                    <select name="claimType" className="field-input field-select" value={form.claimType} onChange={handleChange}>
                      <option value="">Select claim type…</option>
                      {claimTypes.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  {errors.claimType&&<span className="field-err-msg">{errors.claimType}</span>}
                </div>
              </div>
              <div className="form-divider"/>
              <div className="form-section">
                <h3 className="form-section-title">Claim Details</h3>
                <div className={`field-group ${errors.claimAmount?"field-error":""}`}>
                  <label className="field-label">Claim Amount (₹) <span className="required">*</span>
                    {selectedPolicy&&<span style={{color:"var(--text-muted)",fontWeight:400,marginLeft:8}}>max ₹{Number(selectedPolicy.coverageAmount).toLocaleString("en-IN")}</span>}
                  </label>
                  <div className="field-input-wrap">
                    <span className="field-icon amount-prefix">₹</span>
                    <input name="claimAmount" type="number" min="1" max={selectedPolicy?selectedPolicy.coverageAmount:undefined} className="field-input field-amount" placeholder="0.00" value={form.claimAmount} onChange={handleChange}/>
                  </div>
                  {errors.claimAmount&&<span className="field-err-msg">{errors.claimAmount}</span>}
                </div>
                <div className="field-group">
                  <label className="field-label">Description <span className="optional">(optional)</span></label>
                  <textarea name="description" className="field-textarea" placeholder="Describe the incident and damages…" rows={4} value={form.description} onChange={handleChange}/>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={()=>navigate("/dashboard")} disabled={loading}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={loading||policiesLoading||policies.length===0}>
                  {loading?<><span className="btn-spinner-dark"/>Processing…</>:<>Submit Claim <span className="btn-arrow">→</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
