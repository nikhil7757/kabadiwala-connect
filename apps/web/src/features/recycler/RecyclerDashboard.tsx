import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Factory,
  Package,
  Clock,
  QrCode,
  IndianRupee,
  DollarSign,
  TrendingUp,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore.js';

export const RecyclerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);

  // Sample incoming lots for recycler demo
  const [lots] = useState([
    {
      id: 'lot-pune-01',
      refCode: 'KC-MH-20260929-0001',
      category: 'PCB (Circuit Boards)',
      weightKg: 12.5,
      estimatedValue: '4,000.00',
      status: 'LISTED',
      distanceKm: 4.2,
      time: '12m ago',
    },
    {
      id: 'lot-pune-02',
      refCode: 'KC-MH-20260929-0002',
      category: 'CABLE (Cables & Wires)',
      weightKg: 25.0,
      estimatedValue: '4,500.00',
      status: 'QUOTED',
      distanceKm: 8.5,
      time: '1h ago',
    },
    {
      id: 'lot-pune-03',
      refCode: 'KC-MH-20260929-0003',
      category: 'BATTERY (Lead Acid)',
      weightKg: 40.0,
      estimatedValue: '2,800.00',
      status: 'HANDED_OVER',
      distanceKm: 2.1,
      time: '2h ago',
    },
  ]);

  const handleLogout = async () => {
    await logout();
    navigate('/recycler/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-mono flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b border-[#2A2A2A] bg-[#141414] px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5 text-kc-accent" />
          <span className="font-bold text-sm tracking-wider text-white">
            KABADIWALA CONNECT // RECYCLER
          </span>
          <span className="ml-2 px-2 py-0.5 rounded bg-kc-success-soft text-kc-success text-[10px] font-bold border border-kc-success/30">
            VERIFIED FACILITY
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="text-[#9A9A9A]">FACILITY: Sample Recycler Pune 1</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-[#C0C0C0] hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 flex flex-col gap-6">
        {/* Metric Cards (StatCards) */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 rounded-xs border border-[#2A2A2A] bg-[#141414] flex flex-col justify-between">
            <span className="text-[11px] text-[#9A9A9A] tracking-wider uppercase">
              NEW LOTS WAITING
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-kc-accent">03</span>
              <Package className="w-5 h-5 text-kc-accent/60" />
            </div>
          </div>

          <div className="p-4 rounded-xs border border-[#2A2A2A] bg-[#141414] flex flex-col justify-between">
            <span className="text-[11px] text-[#9A9A9A] tracking-wider uppercase">
              QUOTES PENDING
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">01</span>
              <Clock className="w-5 h-5 text-[#9A9A9A]" />
            </div>
          </div>

          <div className="p-4 rounded-xs border border-[#2A2A2A] bg-[#141414] flex flex-col justify-between">
            <span className="text-[11px] text-[#9A9A9A] tracking-wider uppercase">
              HANDOVERS READY
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-kc-success">01</span>
              <QrCode className="w-5 h-5 text-kc-success/60" />
            </div>
          </div>

          <div className="p-4 rounded-xs border border-[#2A2A2A] bg-[#141414] flex flex-col justify-between">
            <span className="text-[11px] text-[#9A9A9A] tracking-wider uppercase">
              PAYMENTS OUTSTANDING
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#FFB020]">₹2,800</span>
              <IndianRupee className="w-5 h-5 text-[#FFB020]/60" />
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/recycler/handover')}
            className="px-4 py-2.5 bg-kc-accent text-black font-bold uppercase rounded-xs text-xs flex items-center gap-2 hover:bg-[#FF7A33]"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Handover QR / Code</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/recycler/rates')}
            className="px-4 py-2.5 bg-[#1A1A1A] border border-[#2A2A2A] text-white font-bold uppercase rounded-xs text-xs flex items-center gap-2 hover:bg-[#252525]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Manage Offered Rates</span>
          </button>
        </div>

        {/* Incoming Lots Table */}
        <div className="border border-[#2A2A2A] bg-[#141414] rounded-xs p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wider uppercase">
              Recent Lots Assigned to Facility
            </h2>
            <span className="text-xs text-[#9A9A9A]">LIVE STREAM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#2A2A2A] text-[#9A9A9A]">
                <tr>
                  <th className="py-2.5 px-3">LOT REF</th>
                  <th className="py-2.5 px-3">MATERIAL</th>
                  <th className="py-2.5 px-3">WEIGHT</th>
                  <th className="py-2.5 px-3">VALUE</th>
                  <th className="py-2.5 px-3">DISTANCE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {lots.map((lot) => (
                  <tr key={lot.id} className="hover:bg-[#1A1A1A]">
                    <td className="py-3 px-3 font-bold text-white">{lot.refCode}</td>
                    <td className="py-3 px-3 text-[#C0C0C0]">{lot.category}</td>
                    <td className="py-3 px-3 font-mono">{lot.weightKg} kg</td>
                    <td className="py-3 px-3 font-mono text-kc-accent font-bold">
                      ₹{lot.estimatedValue}
                    </td>
                    <td className="py-3 px-3 text-[#9A9A9A]">{lot.distanceKm} km</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A1A1A] border border-[#2A2A2A] text-kc-accent">
                        {lot.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {lot.status === 'LISTED' ? (
                        <button
                          type="button"
                          onClick={() => alert(`Submitting quote of ₹${lot.estimatedValue} for lot ${lot.refCode}`)}
                          className="px-2.5 py-1 bg-kc-accent text-black font-bold text-[11px] rounded uppercase"
                        >
                          Quote
                        </button>
                      ) : lot.status === 'HANDED_OVER' ? (
                        <button
                          type="button"
                          onClick={() => navigate('/recycler/handover')}
                          className="px-2.5 py-1 bg-kc-success text-black font-bold text-[11px] rounded uppercase"
                        >
                          Confirm
                        </button>
                      ) : (
                        <span className="text-[#9A9A9A]">Waiting</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
