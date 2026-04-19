// pages/TrackClaims.jsx — Module: Claim Submission & Tracking (Piyush)
// ClaimOfficer can view survey reports before approving/rejecting

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { fetchClaims, updateClaimStatus, fetchReports } from "../services/api";
import "./TrackClaims.css";

/* ── Status badge ── */
function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();
  let cls = "badge", dot = "#888";
  if (s === "approved")                          { cls = "badge badge-approved";  dot = "#22c55e"; }
  else if (s === "rejected")                     { cls = "badge badge-rejected";  dot = "#ef4444"; }
  else if (s === "under verification")           { cls = "badge badge-reviewing"; dot = "#3b82f6"; }
  else if (s === "submitted" || s === "pending") { cls = "badge badge-pending";   dot = "#f59e0b"; }
  return (
    <span className={cls}>
      <span className="status-dot" style={{ background: dot }} />
      {status}
    </span>
  );
}

/* ── Report Viewer Modal — ClaimOfficer sees survey report before deciding ── */
function ReportModal({ claim, onClose, onApprove, onReject, actionLoading }) {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchReports(claim.id)
      .then(data => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [claim.id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Claim #{claim.id} — Survey Report</h2>
            <p>Review the surveyor's findings before making a decision</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Claim summary */}
        <div className="modal-claim-info">
          <div className="modal-info-item">
            <span className="modal-info-label">Policy ID</span>
            <span className="modal-info-value">{claim.policyId}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Claim Type</span>
            <span className="modal-info-value">{claim.type || "—"}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Claim Amount</span>
            <span className="modal-info-value">₹{Number(claim.amount||0).toLocaleString("en-IN")}</span>
          </div>
          <div className="modal-info-item">
            <span className="modal-info-label">Date Filed</span>
            <span className="modal-info-value">
              {claim.date ? new Date(claim.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
            </span>
          </div>
        </div>

        {/* Survey reports */}
        <div className="modal-reports">
          <h3>Survey Reports</h3>
          {loading ? (
            <div className="modal-loading">
              <div className="skeleton" style={{ height: 80, borderRadius: 8 }} />
            </div>
          ) : reports.length === 0 ? (
            <div className="modal-no-report">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="var(--text-muted)" strokeWidth="1.5"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No survey report has been filed for this claim yet.</p>
              <span>The claim may not have been inspected by a Surveyor.</span>
            </div>
          ) : (
            reports.map(r => (
              <div key={r.reportId} className="modal-report-card">
                <div className="modal-report-header">
                  <span className="modal-report-id">Report #{r.reportId}</span>
                  <span className="modal-report-date">
                    Inspection: {r.inspectionDate || "—"}
                  </span>
                </div>
                <div className="modal-report-body">
                  <label>Damage Assessment</label>
                  <p>{r.damageAssessment}</p>
                </div>
                {r.estimatedLoss > 0 && (
                  <div className="modal-report-loss">
                    <span>Estimated Loss:</span>
                    <strong>₹{Number(r.estimatedLoss).toLocaleString("en-IN")}</strong>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onClose}>
            Close
          </button>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="modal-btn-reject"
              onClick={() => onReject(claim.id)}
              disabled={actionLoading === claim.id}>
              {actionLoading === claim.id ? "Updating…" : "✕ Reject"}
            </button>
            <button className="modal-btn-approve"
              onClick={() => onApprove(claim.id)}
              disabled={actionLoading === claim.id}>
              {actionLoading === claim.id ? "Updating…" : "✓ Approve"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Action buttons per role ── */
function ActionButtons({ claim, role, onAction, onViewReport }) {
  const s = (claim.status || "").toLowerCase();

  if (role === "Surveyor") {
    if (s === "submitted") {
      return (
        <button className="action-btn action-btn-blue"
          onClick={() => onAction(claim.id, "Under Verification")}>
          Mark Reviewing
        </button>
      );
    }
    return <span className="action-done">—</span>;
  }

  if (role === "ClaimOfficer") {
    if (s === "under verification") {
      return (
        <button className="action-btn action-btn-green"
          onClick={() => onViewReport(claim)}>
          View Report & Decide
        </button>
      );
    }
    return <span className="action-done">—</span>;
  }

  return null;
}

export default function TrackClaims({ user, onLogout }) {
  const navigate = useNavigate();
  const role     = user?.role || "";

  const [claims, setClaims]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [filter, setFilter]       = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortAsc, setSortAsc]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Modal state — for ClaimOfficer to view survey report
  const [selectedClaim, setSelectedClaim] = useState(null);

  const loadClaims = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await fetchClaims(user?.userId, role);
      setClaims(data);
    } catch (err) {
      setError(err.message || "Failed to load claims.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId, role]);

  useEffect(() => { loadClaims(); }, [loadClaims]);

  const handleAction = async (claimId, newStatus) => {
    setActionLoading(claimId);
    setSelectedClaim(null);
    try {
      await updateClaimStatus(claimId, newStatus);
      setToast({ message: `Claim #${claimId} marked as "${newStatus}"`, type: "success" });
      await loadClaims();
    } catch (err) {
      setToast({ message: err.message || "Failed to update status.", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const statusOptions = ["All", "Submitted", "Under Verification", "Approved", "Rejected"];

  const filtered = claims
    .filter(c => filter === "All" || (c.status||"").toLowerCase() === filter.toLowerCase())
    .sort((a, b) => {
      let valA = a[sortField], valB = b[sortField];
      if (sortField === "amount") { valA = Number(valA); valB = Number(valB); }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(p => !p);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span className="sort-icon sort-neutral">⇅</span>;
    return <span className="sort-icon sort-active">{sortAsc ? "↑" : "↓"}</span>;
  };

  const total     = claims.length;
  const submitted = claims.filter(c => (c.status||"").toLowerCase() === "submitted").length;
  const underV    = claims.filter(c => (c.status||"").toLowerCase() === "under verification").length;
  const approved  = claims.filter(c => (c.status||"").toLowerCase() === "approved").length;
  const rejected  = claims.filter(c => (c.status||"").toLowerCase() === "rejected").length;
  const totalAmt  = claims.reduce((s, c) => s + Number(c.amount||0), 0);
  const totalAmtDisplay = totalAmt >= 1000 ? `₹${(totalAmt/1000).toFixed(1)}K` : `₹${totalAmt}`;

  const statCards = role === "PolicyHolder"
    ? [
        { label: "Total Claims",  value: loading?"…":total,     color:"blue"   },
        { label: "Submitted",     value: loading?"…":submitted,  color:"amber"  },
        { label: "Approved",      value: loading?"…":approved,   color:"green"  },
        { label: "Total Amount",  value: loading?"…":totalAmtDisplay, color:"accent" },
      ]
    : role === "Surveyor"
    ? [
        { label: "Total Claims",       value: loading?"…":total,     color:"blue"   },
        { label: "Awaiting Survey",    value: loading?"…":submitted, color:"amber"  },
        { label: "Under Verification", value: loading?"…":underV,    color:"accent" },
        { label: "Approved",           value: loading?"…":approved,  color:"green"  },
      ]
    : [
        { label: "Total Claims",    value: loading?"…":total,    color:"blue"  },
        { label: "Pending Decision",value: loading?"…":underV,   color:"amber" },
        { label: "Approved",        value: loading?"…":approved, color:"green" },
        { label: "Rejected",        value: loading?"…":rejected, color:"red"   },
      ];

  const showActions = role === "Surveyor" || role === "ClaimOfficer";

  return (
    <div className="track-layout">
      <Navbar user={user} onLogout={onLogout} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Report Modal for ClaimOfficer */}
      {selectedClaim && (
        <ReportModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onApprove={(id) => handleAction(id, "Approved")}
          onReject={(id)  => handleAction(id, "Rejected")}
          actionLoading={actionLoading}
        />
      )}

      <main className="track-main">
        <div className="page-header animate-fade-up">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
          <div className="track-header-row">
            <div>
              <h1>{role === "PolicyHolder" ? "My Claims" : "All Claims"}</h1>
              <p>
                {role === "PolicyHolder"   && "Track the status of all your insurance claims"}
                {role === "Surveyor"       && "Review submitted claims and mark them for verification"}
                {role === "ClaimOfficer"   && "View survey reports and approve or reject claims"}
                {role === "InsuranceAgent" && "Monitor all client claims across the system"}
              </p>
            </div>
            {role === "PolicyHolder" && (
              <button className="btn-primary" onClick={() => navigate("/submit-claim")}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Claim
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="track-stats animate-fade-up" style={{ animationDelay: "80ms" }}>
          {statCards.map(s => (
            <div key={s.label} className={`track-stat track-stat-${s.color}`}>
              <span className="track-stat-value">{s.value}</span>
              <span className="track-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="track-card animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="track-toolbar">
            <div className="filter-pills">
              {statusOptions.map(s => (
                <button key={s}
                  className={`filter-pill ${filter === s ? "filter-pill-active" : ""}`}
                  onClick={() => setFilter(s)}>
                  {s}
                  {s !== "All" && !loading && (
                    <span className="filter-count">
                      {claims.filter(c => (c.status||"").toLowerCase() === s.toLowerCase()).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <span className="track-count">
              {loading ? "Loading…" : `Showing ${filtered.length} of ${total} claims`}
            </span>
          </div>

          {loading && (
            <div className="track-loading">
              {[...Array(4)].map((_,i) => <div key={i} className="skeleton" style={{height:52,borderRadius:8}}/>)}
            </div>
          )}

          {error && !loading && (
            <div className="track-error">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div><strong>Could not load claims</strong><p>{error}</p></div>
              <button className="retry-btn" onClick={loadClaims}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            filtered.length === 0 ? (
              <div className="track-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <p>{total === 0 ? "No claims found." : "No claims match this filter."}</p>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="claims-table">
                  <thead>
                    <tr>
                      <th onClick={() => toggleSort("id")}>Claim ID <SortIcon field="id"/></th>
                      <th onClick={() => toggleSort("policyId")}>Policy ID <SortIcon field="policyId"/></th>
                      <th onClick={() => toggleSort("type")}>Type <SortIcon field="type"/></th>
                      <th onClick={() => toggleSort("amount")}>Amount <SortIcon field="amount"/></th>
                      <th onClick={() => toggleSort("date")}>Date Filed <SortIcon field="date"/></th>
                      <th onClick={() => toggleSort("status")}>Status <SortIcon field="status"/></th>
                      {showActions && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((claim, i) => (
                      <tr key={claim.id||i} className="table-row"
                        style={{ animationDelay:`${i*40}ms`, opacity: actionLoading===claim.id?0.5:1 }}>
                        <td className="td-id">{claim.id||"—"}</td>
                        <td className="td-policy">{claim.policyId||"—"}</td>
                        <td className="td-type">{claim.type||"—"}</td>
                        <td className="td-amount">₹{Number(claim.amount||0).toLocaleString("en-IN")}</td>
                        <td className="td-date">
                          {claim.date ? new Date(claim.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}
                        </td>
                        <td><StatusBadge status={claim.status}/></td>
                        {showActions && (
                          <td>
                            {actionLoading === claim.id
                              ? <span className="action-done">Updating…</span>
                              : <ActionButtons
                                  claim={claim} role={role}
                                  onAction={handleAction}
                                  onViewReport={setSelectedClaim}
                                />
                            }
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
