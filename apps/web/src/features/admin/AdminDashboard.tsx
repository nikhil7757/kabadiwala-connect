import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Database,
  Search,
  LogOut,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, token } = useAppStore();

  const [activeTab, setActiveTab] = useState<'recyclers' | 'flags' | 'data'>('recyclers');

  // Recyclers sample data
  const [recyclers, setRecyclers] = useState([
    {
      id: 'r01',
      name: 'Sample Recycler Pune 1',
      district: 'Pune',
      authNo: 'SAMPLE-EW-PUN-001',
      body: 'State Pollution Control Board',
      status: 'VERIFIED',
    },
    {
      id: 'r02',
      name: 'Sample Recycler Pune 2',
      district: 'Pune',
      authNo: 'SAMPLE-EW-PUN-002',
      body: 'State Pollution Control Board',
      status: 'VERIFIED',
    },
    {
      id: 'r03',
      name: 'Sample Recycler Thane 1',
      district: 'Thane',
      authNo: 'SAMPLE-EW-THA-001',
      body: 'State Pollution Control Board',
      status: 'VERIFIED',
    },
    {
      id: 'r04',
      name: 'Sample Recycler Thane 2 (Suspended)',
      district: 'Thane',
      authNo: 'SAMPLE-EW-THA-002',
      body: 'State Pollution Control Board',
      status: 'SUSPENDED',
    },
    {
      id: 'r05',
      name: 'Sample Recycler Nashik 1 (Pending)',
      district: 'Nashik',
      authNo: 'SAMPLE-EW-NSK-001',
      body: 'State Pollution Control Board',
      status: 'PENDING',
    },
  ]);

  // Anomaly Flags sample data
  const [flags] = useState([
    {
      lotRef: 'KC-MH-20260929-0004',
      category: 'PCB',
      reason: 'PRICE_OUTLIER: z=3.42, expected 290.00 to 350.00 (quoted 520.00)',
      quotedPrice: '520.00',
      approxWeight: '15.0 kg',
      status: 'FLAGGED',
      traceValid: true,
      blocks: 3,
    },
    {
      lotRef: 'KC-MH-20260929-0008',
      category: 'BATTERY',
      reason: 'WEIGHT_DIFFERENCE: Scale verified weight diverges by 22% from declaration',
      quotedPrice: '2,800.00',
      approxWeight: '40.0 kg vs 48.8 kg verified',
      status: 'FLAGGED',
      traceValid: true,
      blocks: 5,
    },
  ]);

  const toggleRecyclerStatus = (id: string, newStatus: string) => {
    setRecyclers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDownloadCsv = (dataset: string) => {
    window.open(`/api/v1/export/${dataset}.csv`, '_blank');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-mono flex flex-col">
      {/* Top Admin Header */}
      <header className="h-14 border-b border-[#2A2A2A] bg-[#141414] px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-kc-accent" />
          <span className="font-bold text-sm tracking-wider text-white">
            MINISTRY OF MINES // JNARDDC GOVERNANCE PORTAL
          </span>
          <span className="ml-2 px-2 py-0.5 rounded bg-[#1A1A1A] text-[#9A9A9A] text-[10px] font-bold border border-[#2A2A2A]">
            SIH26229
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-[#9A9A9A] hover:text-white"
        >
          <LogOut className="w-4 h-4" />
          <span>LOGOUT</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#2A2A2A] bg-[#141414] px-6 flex items-center gap-6 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('recyclers')}
          className={`py-3 font-bold border-b-2 tracking-wider ${
            activeTab === 'recyclers'
              ? 'border-kc-accent text-kc-accent'
              : 'border-transparent text-[#9A9A9A] hover:text-white'
          }`}
        >
          AUTHORIZED RECYCLERS
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('flags')}
          className={`py-3 font-bold border-b-2 tracking-wider flex items-center gap-1.5 ${
            activeTab === 'flags'
              ? 'border-kc-accent text-kc-accent'
              : 'border-transparent text-[#9A9A9A] hover:text-white'
          }`}
        >
          <span>ANOMALY AUDIT FLAGS</span>
          <span className="px-1.5 py-0.2 rounded-full bg-kc-danger text-white text-[10px]">
            {flags.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('data')}
          className={`py-3 font-bold border-b-2 tracking-wider ${
            activeTab === 'data'
              ? 'border-kc-accent text-kc-accent'
              : 'border-transparent text-[#9A9A9A] hover:text-white'
          }`}
        >
          DATASETS & ANONYMIZED EXPORTS
        </button>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6">
        {/* TAB 1: RECYCLERS GOVERNANCE */}
        {activeTab === 'recyclers' && (
          <div className="border border-[#2A2A2A] bg-[#141414] rounded-xs p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Recycler Facilities Directory & Authorization Control
              </h2>
              <span className="text-xs text-[#9A9A9A]">
                SUSPENDED FACILITIES ARE STRICTLY EXCLUDED FROM MATCHING
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#2A2A2A] text-[#9A9A9A]">
                <tr>
                  <th className="py-2.5 px-3">FACILITY NAME</th>
                  <th className="py-2.5 px-3">DISTRICT</th>
                  <th className="py-2.5 px-3">AUTHORIZATION NO</th>
                  <th className="py-2.5 px-3">ISSUING BODY</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">GOVERNANCE ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {recyclers.map((r) => (
                  <tr key={r.id} className="hover:bg-[#1A1A1A]">
                    <td className="py-3 px-3 font-bold text-white">{r.name}</td>
                    <td className="py-3 px-3 text-[#C0C0C0]">{r.district}</td>
                    <td className="py-3 px-3 font-mono text-kc-accent">{r.authNo}</td>
                    <td className="py-3 px-3 text-[#9A9A9A]">{r.body}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'VERIFIED'
                            ? 'bg-kc-success-soft text-kc-success border border-kc-success/30'
                            : r.status === 'SUSPENDED'
                            ? 'bg-kc-danger-soft text-kc-danger border border-kc-danger/30'
                            : 'bg-kc-warn-soft text-[#FFB020] border border-[#FFB020]/30'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {r.status === 'VERIFIED' ? (
                        <button
                          type="button"
                          onClick={() => toggleRecyclerStatus(r.id, 'SUSPENDED')}
                          className="px-2.5 py-1 bg-kc-danger/20 border border-kc-danger text-kc-danger rounded text-[11px] font-bold uppercase hover:bg-kc-danger hover:text-white"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleRecyclerStatus(r.id, 'VERIFIED')}
                          className="px-2.5 py-1 bg-kc-success/20 border border-kc-success text-kc-success rounded text-[11px] font-bold uppercase hover:bg-kc-success hover:text-black"
                        >
                          Verify Facility
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ANOMALY FLAGS */}
        {activeTab === 'flags' && (
          <div className="border border-[#2A2A2A] bg-[#141414] rounded-xs p-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Anomaly Detection Alerts (Z-Score & Plausibility)
              </h2>
              <span className="text-xs text-kc-warn">
                NEVER BLOCKS TRANSACTIONS • AUDIT FLAGS FOR INSPECTION
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {flags.map((f) => (
                <div
                  key={f.lotRef}
                  className="p-4 rounded-xs border border-kc-danger/40 bg-kc-danger-soft/10 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-kc-danger" />
                      <span className="font-bold text-white text-sm">{f.lotRef}</span>
                      <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-bold text-kc-accent">
                        {f.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-kc-success font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        TRACE VERIFIED (SHA-256 VALID)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#C0C0C0] font-mono pl-7">{f.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DATA EXPORTS & METRICS */}
        {activeTab === 'data' && (
          <div className="flex flex-col gap-6">
            <div className="border border-[#2A2A2A] bg-[#141414] rounded-xs p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-kc-accent" />
                  Official SIH26229 Anonymized Datasets (CSV)
                </h2>
                <span className="text-xs text-[#9A9A9A]">
                  COLLECTOR IDS SALTED SHA-256 • PHONES REDACTED • GPS ROUNDED
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'materials', title: 'Materials Reference', desc: '8 canonical categories & subcategories' },
                  { id: 'prices', title: 'Historical Prices', desc: '60-day price entries & moving averages' },
                  { id: 'recyclers', title: 'Authorized Recyclers', desc: 'Facilities, ratings & service areas' },
                  { id: 'transactions', title: 'Transactions Ledger', desc: 'Lots, quotes, weights & payment states' },
                  { id: 'traceability', title: 'Audit Traceability', desc: 'Sequential SHA-256 tamper-evident chain' },
                  { id: 'collectors', title: 'Collector Dataset', desc: 'Anonymized languages & districts' },
                ].map((ds) => (
                  <div
                    key={ds.id}
                    className="p-4 rounded-xs border border-[#2A2A2A] bg-[#1A1A1A] flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{ds.title}</h3>
                      <p className="text-xs text-[#9A9A9A] mb-3">{ds.desc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadCsv(ds.id)}
                      className="w-full h-9 bg-kc-accent text-black font-bold uppercase rounded text-xs flex items-center justify-center gap-1.5 hover:bg-[#FF7A33]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .CSV</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
