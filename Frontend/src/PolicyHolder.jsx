// pages/PolicyHolders.jsx — Module: Policy Management (Prathama)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchPolicyHolders } from "../services/api";
import "./PolicyHolders.css";

export default function PolicyHolders({ user, onLogout }) {
  const navigate = useNavigate();
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");

  useEffect(() => {
    fetchPolicyHolders().then(setHolders).catch(e=>setError(e.message)).finally(()=>setLoading(false));
  }, []);

  const filtered = holders.filter(h =>
    h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ph-layout">
      <Navbar user={user} onLogout={onLogout}/>
      <main className="ph-main">
        <div className="page-header animate-fade-up">
          <button className="back-btn" onClick={()=>navigate("/dashboard")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Back to Dashboard</button>
          <div className="ph-header-row">
            <div><h1>Policy Holders</h1><p>All registered policy holders in the system</p></div>
            <button className="btn-primary" onClick={()=>navigate("/create-policy")}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Create Policy
            </button>
          </div>
        </div>
        <div className="ph-stats animate-fade-up" style={{animationDelay:"80ms"}}>
          <div className="ph-stat ph-stat-accent"><span className="ph-stat-value">{loading?"…":holders.length}</span><span className="ph-stat-label">Total Holders</span></div>
          <div className="ph-stat ph-stat-blue"><span className="ph-stat-value">{loading?"…":holders.filter(h=>h.phone).length}</span><span className="ph-stat-label">With Phone</span></div>
          <div className="ph-stat ph-stat-green"><span className="ph-stat-value">{loading?"…":holders.filter(h=>h.address).length}</span><span className="ph-stat-label">With Address</span></div>
        </div>
        <div className="ph-card animate-fade-up" style={{animationDelay:"160ms"}}>
          <div className="ph-toolbar">
            <div className="ph-search-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="ph-search-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <input className="ph-search" type="text" placeholder="Search by name or email…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <span className="ph-count">{loading?"Loading…":`${filtered.length} of ${holders.length} holders`}</span>
          </div>
          {loading&&<div className="ph-loading">{[...Array(4)].map((_,i)=><div key={i} className="skeleton" style={{height:52,borderRadius:8}}/>)}</div>}
          {error&&!loading&&<div className="ph-error"><strong>Could not load holders</strong><p>{error}</p></div>}
          {!loading&&!error&&(
            filtered.length===0
              ? <div className="ph-empty"><svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="var(--text-muted)" strokeWidth="1.5"/></svg><p>{holders.length===0?"No holders registered yet.":"No holders match your search."}</p></div>
              : <div className="table-wrap">
                  <table className="ph-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Action</th></tr></thead>
                    <tbody>
                      {filtered.map((h,i)=>(
                        <tr key={h.userId||i} className="table-row">
                          <td className="td-id">{h.userId}</td>
                          <td className="td-name"><div className="holder-avatar">{h.name?.charAt(0)?.toUpperCase()}</div>{h.name}</td>
                          <td>{h.email}</td>
                          <td>{h.phone||<span style={{color:"var(--text-muted)"}}>—</span>}</td>
                          <td>{h.address||<span style={{color:"var(--text-muted)"}}>—</span>}</td>
                          <td><button className="action-btn action-btn-blue" onClick={()=>navigate(`/create-policy?userId=${h.userId}&name=${encodeURIComponent(h.name)}`)}>Assign Policy</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}
        </div>
      </main>
    </div>
  );
}
