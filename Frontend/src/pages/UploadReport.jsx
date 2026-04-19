// pages/UploadReport.jsx — Module: Survey & Report (Pranav)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { fetchClaims, submitReport, fetchReports } from "../services/api";
import "./UploadReport.css";

const RECOMMENDATIONS = [
  "Full Payout Recommended",
  "Partial Payout Recommended",
  "Minor Payout Recommended",
  "Review",
  "Reject",
];

export default function UploadReport({ user, onLogout }) {
  const navigate = useNavigate(), location = useLocation();
  const params = new URLSearchParams(location.search);
  const preClaimId = params.get("claimId") || "";

  const [form, setForm] = useState({
    claimId: preClaimId,
    damageDescription: "",
    estimatedLoss: "",
    inspectionDate: new Date().toISOString().slice(0, 10),
    recommendation: "",
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [claims, setClaims]   = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(true);
  const [existing, setExisting] = useState([]);

  useEffect(() => {
    fetchClaims({ role: "Surveyor" })
      .then(setClaims)
      .catch(() => {})
      .finally(() => setClaimsLoading(false));
  }, []);

  useEffect(() => {
    if (!form.claimId) { setExisting([]); return; }
    fetchReports(form.claimId).then(setExisting).catch(() => setExisting([]));
  }, [form.claimId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.claimId)             e.claimId = "Please select a claim.";
    if (!form.damageDescription.trim()) e.damageDescription = "Describe the observed damage.";
    else if (form.damageDescription.trim().length < 10) e.damageDescription = "Please give at least 10 characters.";
    if (!form.estimatedLoss)       e.estimatedLoss = "Estimated loss is required.";
    else if (isNaN(form.estimatedLoss) || Number(form.estimatedLoss) <= 0) e.estimatedLoss = "Enter a valid amount.";
    if (!form.inspectionDate)      e.inspectionDate = "Inspection date is required.";
    else if (form.inspectionDate > new Date().toISOString().slice(0, 10)) e.inspectionDate = "Cannot be in the future.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setLoading(true);
    try {
      const r = await submitReport({
        claimId:           Number(form.claimId),
        surveyorId:        user?.userId,
        damageDescription: form.damageDescription.trim(),
        estimatedLoss:     Number(form.estimatedLoss),
        inspectionDate:    form.inspectionDate,
        recommendation:    form.recommendation || null,
      });
      setToast({
        message: `Report #${r.reportId} submitted · ${r.recommendation || "Sent for review"}`,
        type: "success",
      });
      setForm(p => ({
        ...p,
        damageDescription: "",
        estimatedLoss: "",
        recommendation: "",
      }));
      setTimeout(() => navigate("/dashboard"), 2200);
    } catch (err) {
      setToast({ message: err.message || "Failed to submit report.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const selectedClaim = claims.find(c => String(c.claimId) === String(form.claimId));

  return (
    <div className="ur-layout">
      <Navbar user={user} onLogout={onLogout} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <main className="ur-main">
        <div className="page-header animate-fade-up">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to Dashboard
          </button>
          <div>
            <h1>Upload Survey Report</h1>
            <p>File a damage-inspection report for a submitted claim</p>
          </div>
        </div>

        <div className="ur-content">
          <div className="ur-sidebar animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="ur-sidebar-card">
              <div className="ur-sidebar-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11H3v10h6V11zM21 3h-6v18h6V3zM15 7H9v14h6V7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3>Inspection Checklist</h3>
              <ul className="ur-list">
                <li>Describe all visible damage</li>
                <li>Record the estimated loss in ₹</li>
                <li>Attach inspection date</li>
                <li>Report moves claim to <em>Under Verification</em></li>
              </ul>
            </div>

            {selectedClaim && (
              <div className="ur-sidebar-card ur-claim-preview">
                <div className="ur-sidebar-icon" style={{ background: "var(--blue-dim)", color: "var(--blue)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3>Claim Under Inspection</h3>
                <ul className="ur-list">
                  <li>Claim ID: #{selectedClaim.claimId}</li>
                  <li>Type: {selectedClaim.claimType || "—"}</li>
                  <li>Amount: ₹{selectedClaim.claimAmount ?? "—"}</li>
                  <li>Status: {selectedClaim.status || "Submitted"}</li>
                </ul>
              </div>
            )}

            {existing.length > 0 && (
              <div className="ur-sidebar-card">
                <div className="ur-sidebar-icon" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3>Previous Reports ({existing.length})</h3>
                <ul className="ur-list ur-history">
                  {existing.slice(0, 3).map(r => (
                    <li key={r.reportId}>
                      #{r.reportId} · ₹{r.assessedLoss ?? r.estimatedLoss} · {r.recommendation || "—"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="ur-form-card animate-fade-up" style={{ animationDelay: "200ms" }}>
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="ur-section-title">Claim Selection</h3>
              <div className={`ur-field ${errors.claimId ? "ur-field-error" : ""}`}>
                <label className="ur-label">Select Claim <span className="req">*</span></label>
                <div className="ur-input-wrap">
                  <span className="ur-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                  {claimsLoading
                    ? <select className="ur-input ur-select" disabled><option>Loading…</option></select>
                    : <select name="claimId" className="ur-input ur-select" value={form.claimId} onChange={handleChange}>
                        <option value="">Select a claim…</option>
                        {claims.map(c => (
                          <option key={c.claimId} value={c.claimId}>
                            #{c.claimId} — {c.claimType || "Claim"} (₹{c.claimAmount ?? "?"})
                          </option>
                        ))}
                      </select>}
                </div>
                {errors.claimId && <span className="ur-err">{errors.claimId}</span>}
              </div>

              <div className="ur-divider" />
              <h3 className="ur-section-title">Damage Details</h3>

              <div className={`ur-field ${errors.damageDescription ? "ur-field-error" : ""}`}>
                <label className="ur-label">Damage Description <span className="req">*</span></label>
                <textarea
                  name="damageDescription"
                  className="ur-input ur-textarea"
                  rows={4}
                  placeholder="Describe observed damage, affected parts, severity…"
                  value={form.damageDescription}
                  onChange={handleChange}
                />
                {errors.damageDescription && <span className="ur-err">{errors.damageDescription}</span>}
              </div>

              <div className={`ur-field ${errors.estimatedLoss ? "ur-field-error" : ""}`}>
                <label className="ur-label">Estimated Loss (₹) <span className="req">*</span></label>
                <div className="ur-input-wrap">
                  <span className="ur-icon" style={{ fontSize: ".85rem", fontWeight: 600 }}>₹</span>
                  <input
                    name="estimatedLoss"
                    type="number"
                    min="1"
                    className="ur-input"
                    style={{ paddingLeft: 28 }}
                    placeholder="e.g. 45000"
                    value={form.estimatedLoss}
                    onChange={handleChange}
                  />
                </div>
                {errors.estimatedLoss && <span className="ur-err">{errors.estimatedLoss}</span>}
              </div>

              <div className="ur-date-row">
                <div className={`ur-field ${errors.inspectionDate ? "ur-field-error" : ""}`}>
                  <label className="ur-label">Inspection Date <span className="req">*</span></label>
                  <input
                    name="inspectionDate"
                    type="date"
                    className="ur-input ur-date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={form.inspectionDate}
                    onChange={handleChange}
                  />
                  {errors.inspectionDate && <span className="ur-err">{errors.inspectionDate}</span>}
                </div>

                <div className="ur-field">
                  <label className="ur-label">Recommendation <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
                  <div className="ur-input-wrap">
                    <span className="ur-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="9 11 12 14 22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </span>
                    <select name="recommendation" className="ur-input ur-select" value={form.recommendation} onChange={handleChange}>
                      <option value="">Let strategy decide…</option>
                      {RECOMMENDATIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="ur-actions">
                <button type="button" className="ur-btn-sec" onClick={() => navigate("/dashboard")} disabled={loading}>Cancel</button>
                <button type="submit" className="ur-btn-pri" disabled={loading || claimsLoading}>
                  {loading
                    ? <><span className="btn-spinner-dark" />Submitting…</>
                    : <>Submit Report <span className="btn-arrow">→</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
