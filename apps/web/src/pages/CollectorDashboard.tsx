import React, { useState, useEffect } from 'react';
import {
  Truck,
  CheckCircle2,
  XCircle,
  Scale,
  IndianRupee,
  Navigation,
  QrCode,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { pickupService } from '../services/pickupService';
import { CoinDropModal } from '../components/common/CoinDropModal';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../hooks/useLang';

export const CollectorDashboard: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const [pickups, setPickups] = useState<any[]>([]);
  const [selectedPickupForWeighing, setSelectedPickupForWeighing] = useState<any>(null);

  const loadData = () => {
    const all = pickupService.getAll();
    setPickups(all);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const incomingRequests = pickups.filter((p) => p.status === 'REQUESTED');
  const activeJobs = pickups.filter((p) => ['ACCEPTED', 'ON_THE_WAY', 'WEIGHED'].includes(p.status));
  const completedJobs = pickups.filter((p) => p.status === 'PAID');

  const handleAccept = (id: string) => {
    pickupService.accept(id, user?.id || 'c1');
    loadData();
  };

  const handleReject = (id: string) => {
    pickupService.updateStatus(id, 'REJECTED');
    loadData();
  };

  // Recharts Weekly Earnings Data
  const earningsData = [
    { day: 'Mon', earnings: 1420, weightKg: 85 },
    { day: 'Tue', earnings: 1850, weightKg: 110 },
    { day: 'Wed', earnings: 2100, weightKg: 135 },
    { day: 'Thu', earnings: 1600, weightKg: 95 },
    { day: 'Fri', earnings: 2800, weightKg: 170 },
    { day: 'Sat', earnings: 3450, weightKg: 210 },
    { day: 'Sun', earnings: 2900, weightKg: 180 },
  ];

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#1F221F] mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                OPERATOR TERMINAL // FIELD DISPATCH
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
              COLLECTOR TERMINAL: {user?.name || 'RAJESH KUMAR'}
            </h1>
            <p className="text-xs font-mono text-[#6A6E6A] mt-1">
              OPERATOR ID: KC-MH-COL-01 · ZONE: MUMBAI K/WEST · DIGITAL SCALES VERIFIED
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="px-3 py-1.5 bg-[#A3E635]/10 border border-[#A3E635] text-[#A3E635] font-bold rounded-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
              <span>ONLINE FOR BROADCAST JOBS</span>
            </span>
          </div>
        </div>

        {/* 3 Overview Stat Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>TODAY'S NET EARNINGS</span>
              <IndianRupee className="w-4 h-4 text-[#FFB020]" />
            </div>
            <div className="font-display text-4xl font-bold text-[#FFB020]">
              ₹3,450
            </div>
            <div className="text-[11px] font-mono text-[#A3E635] mt-1">
              +18% VS YESTERDAY · NO MIDDLEMAN COMMISSION
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>INCOMING BROADCAST REQUESTS</span>
              <Truck className="w-4 h-4 text-[#A3E635]" />
            </div>
            <div className="font-display text-4xl font-bold text-[#A3E635]">
              {incomingRequests.length} PENDING
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              IN IMMEDIATE 3KM RADIUS
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>COMPLETED LOTS DISPATCHED</span>
              <QrCode className="w-4 h-4 text-[#C8C8C8]" />
            </div>
            <div className="font-display text-4xl font-bold text-[#F5F5F5]">
              {completedJobs.length} LOTS
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              LINKED TO RECYCLER TRACEABILITY
            </div>
          </div>
        </div>

        {/* 2-Column Working Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Incoming Doorstep Jobs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
                <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
                  INCOMING CITIZEN REQUESTS ({incomingRequests.length})
                </h3>
                <span className="font-mono text-xs text-[#A3E635] animate-pulse font-bold">
                  ● LIVE BROADCAST FEED
                </span>
              </div>

              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-[#0A0B0A] border border-[#A3E635]/50 rounded-sm space-y-3"
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-[#A3E635]">#{req.id}</span>
                      <span className="text-[#FFB020] font-bold">
                        EST. VALUATION: ₹{req.totalEstimated}
                      </span>
                    </div>

                    <div className="text-sm font-body text-[#F5F5F5]">
                      {req.address}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-[#6A6E6A]">
                      <span>CITIZEN: {req.userName || 'Priya Sharma'}</span>
                      <span>TIME: {req.date}</span>
                    </div>

                    {/* Instant Accept / Reject Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="flex-1 py-2.5 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-mono text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ACCEPT JOB</span>
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2.5 bg-[#141614] border border-[#1F221F] hover:border-[#FF6B5E] text-[#FF6B5E] font-mono text-xs font-bold uppercase rounded-sm flex items-center justify-center transition"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {incomingRequests.length === 0 && (
                  <div className="py-12 text-center font-mono text-xs text-[#6A6E6A]">
                    NO PENDING REQUESTS IN IMMEDIATE RADIUS. NEW JOBS BROADCAST AUTOMATICALLY.
                  </div>
                )}
              </div>
            </div>

            {/* Active En Route Jobs with Digital Scale Trigger */}
            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-4">
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                ACCEPTED ACTIVE JOBS ({activeJobs.length})
              </h3>

              <div className="space-y-3">
                {activeJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 bg-[#0A0B0A] border border-[#1F221F] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#F5F5F5]">#{job.id} · {job.address}</div>
                      <div className="text-[#6A6E6A] text-[11px] mt-0.5">
                        STATUS: <span className="text-[#A3E635] font-bold">{job.status}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPickupForWeighing(job)}
                      className="px-5 py-2.5 bg-[#FFB020] hover:bg-[#ffbe47] text-[#0A0B0A] font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2"
                    >
                      <Scale className="w-4 h-4" />
                      <span>WEIGH & SPOT PAYOUT</span>
                    </button>
                  </div>
                ))}

                {activeJobs.length === 0 && (
                  <div className="py-8 text-center font-mono text-xs text-[#6A6E6A]">
                    NO ACTIVE JOBS EN ROUTE. ACCEPT AN INCOMING JOB ABOVE.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Earnings BarChart & Government Digital Pass */}
          <div className="lg:col-span-5 space-y-6">
            {/* Recharts Weekly Earnings Chart */}
            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg uppercase font-bold text-[#F5F5F5]">
                  WEEKLY EARNINGS TELEMETRY
                </h3>
                <span className="font-mono text-xs text-[#A3E635] font-bold">₹16,120 TOTAL</span>
              </div>

              <div className="h-56 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData}>
                    <XAxis dataKey="day" stroke="#6A6E6A" tick={{ fontSize: 12, fill: '#6A6E6A' }} />
                    <YAxis stroke="#6A6E6A" tick={{ fontSize: 12, fill: '#6A6E6A' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0A0B0A',
                        borderColor: '#1F221F',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '12px',
                        color: '#F5F5F5',
                      }}
                    />
                    <Bar dataKey="earnings" fill="#A3E635" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Operator Official Digital ID Badge */}
            <div className="p-6 bg-[#050605] border-2 border-[#A3E635] rounded-sm corner-brackets space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F221F]">
                <div>
                  <span className="text-[10px] text-[#6A6E6A] block">JNARDDC VERIFIED ID</span>
                  <span className="text-sm font-bold text-[#A3E635]">OPERATOR PASS</span>
                </div>
                <QrCode className="w-6 h-6 text-[#F5F5F5]" />
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">PASS ID:</span>
                <span className="font-bold text-[#F5F5F5]">KC-MH-COL-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">NAME:</span>
                <span className="text-[#F5F5F5]">{user?.name || 'Rajesh Kumar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">DIGITAL SCALE:</span>
                <span className="text-[#A3E635] font-bold">BLUETOOTH 0.05KG CALIBRATED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weighing & Coin-Drop Payout Modal */}
      <CoinDropModal
        pickup={selectedPickupForWeighing}
        isOpen={!!selectedPickupForWeighing}
        onClose={() => setSelectedPickupForWeighing(null)}
        onComplete={loadData}
      />
    </div>
  );
};
export default CollectorDashboard;