// pages/CreatePolicy.jsx — Module: Policy Management (Prathama)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { createPolicy, fetchPolicyHolders } from "../services/api";
import "./CreatePolicy.css";

const POLICY_TYPES = ["Vehicle Damage","Medical Expense","Property Damage","Natural Disaster","Theft","Life Insurance","Other"];

export default function CreatePolicy({ user, onLogout }) {
  const navigate=useNavigate(), location=useLocation();
  const params=new URLSearchParams(location.search);
  const preUserId=params.get("userId")||"", preName=params.get("name")||"";

  const [form, setForm]=useState({userId:preUserId,policyType:"",coverageAmount:"",premiumAmount:"",startDate:"",endDate:""});
  const [errors, setErrors]=useState({});
  const [loading, setLoading]=useState(false);
  const [toast, setToast]=useState(null);
  const [holders, setHolders]=useState([]);
  const [holdersLoading, setHoldersLoading]=useState(true);

  useEffect(()=>{fetchPolicyHolders().then(setHolders).catch(()=>{}).finally(()=>setHoldersLoading(false));}, []);

  const handleChange=(e)=>{const{name,value}=e.target;setForm(p=>({...p,[name]:value}));if(errors[name])setErrors(p=>({...p,[name]:""}));};

  const validate=()=>{
    const e={};
    if(!form.userId)         e.userId="Please select a policy holder.";
    if(!form.policyType)     e.policyType="Please select a policy type.";
    if(!form.coverageAmount) e.coverageAmount="Coverage amount is required.";
    else if(isNaN(form.coverageAmount)||Number(form.coverageAmount)<=0) e.coverageAmount="Enter a valid amount.";
    if(!form.startDate)      e.startDate="Start date is required.";
    if(!form.endDate)        e.endDate="End date is required.";
    else if(form.startDate&&form.endDate&&form.endDate<=form.startDate) e.endDate="End date must be after start.";
    return e;
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const ve=validate();if(Object.keys(ve).length>0){setErrors(ve);return;}
    setLoading(true);
    try {
      const r=await createPolicy({userId:Number(form.userId),policyType:form.policyType,coverageAmount:Number(form.coverageAmount),premiumAmount:form.premiumAmount?Number(form.premiumAmount):0,startDate:form.startDate,endDate:form.endDate});
      setToast({message:`Policy #${r.policyId} created successfully!`,type:"success"});
      setForm({userId:"",policyType:"",coverageAmount:"",premiumAmount:"",startDate:"",endDate:""});
      setTimeout(()=>navigate("/policyholders"),2000);
    } catch(err){setToast({message:err.message||"Failed to create policy.",type:"error"});}
    finally{setLoading(false);}
  };

  const selectedHolder=holders.find(h=>String(h.userId)===String(form.userId));

  return (
    <div className="cp-layout">
      <Navbar user={user} onLogout={onLogout}/>
      {toast&&<Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)}/>}
      <main className="cp-main">
        <div className="page-header animate-fade-up">
          <button className="back-btn" onClick={()=>navigate("/policyholders")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Back to Policy Holders</button>
          <div><h1>Create New Policy</h1><p>Assign a new insurance policy to a registered policy holder</p></div>
        </div>
        <div className="cp-content">
          <div className="cp-sidebar animate-fade-up" style={{animationDelay:"100ms"}}>
            <div className="cp-sidebar-card">
              <div className="cp-sidebar-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="2"/></svg></div>
              <h3>Policy Guidelines</h3>
              <ul className="cp-list">
                <li>Select an existing policy holder</li>
                <li>Choose the appropriate policy type</li>
                <li>Coverage amount = max claimable</li>
                <li>Policy is set to Active on creation</li>
              </ul>
            </div>
            {(selectedHolder||preName)&&(
              <div className="cp-sidebar-card cp-holder-preview">
                <div className="cp-sidebar-icon" style={{background:"var(--blue-dim)",color:"var(--blue)"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg></div>
                <h3>Assigning To</h3>
                <ul className="cp-list"><li>Name: {selectedHolder?.name||preName}</li><li>Email: {selectedHolder?.email||"—"}</li><li>ID: {selectedHolder?.userId||preUserId}</li></ul>
              </div>
            )}
          </div>
          <div className="cp-form-card animate-fade-up" style={{animationDelay:"200ms"}}>
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="cp-section-title">Holder Information</h3>
              <div className={`cp-field ${errors.userId?"cp-field-error":""}`}>
                <label className="cp-label">Select Policy Holder <span className="req">*</span></label>
                <div className="cp-input-wrap">
                  <span className="cp-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg></span>
                  {holdersLoading?<select className="cp-input cp-select" disabled><option>Loading…</option></select>
                  :<select name="userId" className="cp-input cp-select" value={form.userId} onChange={handleChange}>
                    <option value="">Select a holder…</option>
                    {holders.map(h=><option key={h.userId} value={h.userId}>#{h.userId} — {h.name} ({h.email})</option>)}
                  </select>}
                </div>
                {errors.userId&&<span className="cp-err">{errors.userId}</span>}
              </div>
              <div className="cp-divider"/>
              <h3 className="cp-section-title">Policy Details</h3>
              <div className={`cp-field ${errors.policyType?"cp-field-error":""}`}>
                <label className="cp-label">Policy Type <span className="req">*</span></label>
                <div className="cp-input-wrap">
                  <span className="cp-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                  <select name="policyType" className="cp-input cp-select" value={form.policyType} onChange={handleChange}>
                    <option value="">Select policy type…</option>
                    {POLICY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {errors.policyType&&<span className="cp-err">{errors.policyType}</span>}
              </div>
              <div className={`cp-field ${errors.coverageAmount?"cp-field-error":""}`}>
                <label className="cp-label">Coverage Amount (₹) <span className="req">*</span></label>
                <div className="cp-input-wrap">
                  <span className="cp-icon" style={{fontSize:".85rem",fontWeight:600}}>₹</span>
                  <input name="coverageAmount" type="number" min="1" className="cp-input" style={{paddingLeft:28}} placeholder="e.g. 500000" value={form.coverageAmount} onChange={handleChange}/>
                </div>
                {errors.coverageAmount&&<span className="cp-err">{errors.coverageAmount}</span>}
              </div>
              <div className="cp-field">
                <label className="cp-label">Premium Amount (₹) <span style={{color:"var(--text-muted)",fontWeight:400}}>(optional)</span></label>
                <div className="cp-input-wrap">
                  <span className="cp-icon" style={{fontSize:".85rem",fontWeight:600}}>₹</span>
                  <input name="premiumAmount" type="number" min="0" className="cp-input" style={{paddingLeft:28}} placeholder="e.g. 5000" value={form.premiumAmount} onChange={handleChange}/>
                </div>
              </div>
              <div className="cp-date-row">
                <div className={`cp-field ${errors.startDate?"cp-field-error":""}`}>
                  <label className="cp-label">Start Date <span className="req">*</span></label>
                  <input name="startDate" type="date" className="cp-input cp-date" value={form.startDate} onChange={handleChange}/>
                  {errors.startDate&&<span className="cp-err">{errors.startDate}</span>}
                </div>
                <div className={`cp-field ${errors.endDate?"cp-field-error":""}`}>
                  <label className="cp-label">End Date <span className="req">*</span></label>
                  <input name="endDate" type="date" className="cp-input cp-date" value={form.endDate} onChange={handleChange}/>
                  {errors.endDate&&<span className="cp-err">{errors.endDate}</span>}
                </div>
              </div>
              <div className="cp-actions">
                <button type="button" className="cp-btn-sec" onClick={()=>navigate("/policyholders")} disabled={loading}>Cancel</button>
                <button type="submit" className="cp-btn-pri" disabled={loading||holdersLoading}>
                  {loading?<><span className="btn-spinner-dark"/>Creating…</>:<>Create Policy <span className="btn-arrow">→</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
