import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Leaf,
  Award,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

export const UserDashboard: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const [pickups, setPickups] = useState<any[]>([]);
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const loadData = () => {
    const all = pickupService.getAll();
    setPickups(all);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const activePickups = pickups.filter((p) => p.status !== 'PAID');
  const pastPickups = pickups.filter((p) => p.status === 'PAID');

  const totalEarned = pastPickups.reduce((acc, p) => acc + (p.actualPayout || p.totalEstimated || 0), 0);
  const totalKg = pastPickups.reduce((acc, p) => acc + (p.actualWeight || 12), 0);
  const co2AvoidedKg = Math.round(totalKg * 1.8);
  const ecoPoints = totalKg * 10;

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container>
        {/* Top Citizen Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#1F221F] mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                HOUSEHOLD PORTAL // ACTIVE CITIZEN
              </span>
            </div>
            <h1
              data-qa-check="heading"
              className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
            >
              WELCOME BACK, {user?.name || 'PRIYA SHARMA'}
            </h1>
            <p className="text-xs font-mono text-[#6A6E6A] mt-1">
              ACCOUNT: {user?.phone || '9876543210'} · METRO: MUMBAI WEST
            </p>
          </div>

          <Link
            to="/book"
            data-qa-check="button"
            className="min-h-[48px] px-6 py-2.5 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-2 active:scale-95 transition shrink-0"
          >
            <span>+ SCHEDULE NEW PICKUP</span>
            <Icon icon={ArrowRight} size={16} />
          </Link>
        </div>

        {/* 4 Telemetry Stat Cards: 2x2 on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div data-qa-check="card" className="p-4 sm:p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex items-center justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>TOTAL CASH EARNED</span>
              <Icon icon={TrendingUp} size={16} className="text-[#FFB020]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#FFB020] truncate">
              ₹{totalEarned.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-[#6A6E6A] mt-1">
              INSTANT SPOT UPI
            </div>
          </div>

          <div data-qa-check="card" className="p-4 sm:p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex items-center justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>SCRAP DIVERTED</span>
              <Icon icon={Package} size={16} className="text-[#A3E635]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#A3E635] truncate">
              {totalKg} KG
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-[#6A6E6A] mt-1">
              ZERO LANDFILL LEAKAGE
            </div>
          </div>

          <div data-qa-check="card" className="p-4 sm:p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex items-center justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>CO₂ OFFSET SAVED</span>
              <Icon icon={Leaf} size={16} className="text-[#A3E635]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#F5F5F5] truncate">
              {co2AvoidedKg} KG
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-[#6A6E6A] mt-1">
              CERTIFIED GREENHOUSE
            </div>
          </div>

          <div data-qa-check="card" className="p-4 sm:p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="flex items-center justify-between font-mono text-xs text-[#6A6E6A] mb-2">
              <span>GREEN POINTS</span>
              <Icon icon={Award} size={16} className="text-[#FFB020]" />
            </div>
            <div className="font-display text-3xl sm:text-4xl font-bold text-[#FFB020] truncate">
              {ecoPoints} PTS
            </div>
            <div className="text-[10px] sm:text-[11px] font-mono text-[#A3E635] mt-1">
              TIER: SILVER RECYCLER
            </div>
          </div>
        </div>

        {/* Tabbed Pickups Feed */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1F221F] pb-2 font-mono text-xs">
            <button
              onClick={() => setTab('active')}
              data-qa-check="button"
              className={`min-h-[44px] px-3 border-b-2 font-bold uppercase transition flex items-center ${
                tab === 'active'
                  ? 'border-[#A3E635] text-[#A3E635]'
                  : 'border-transparent text-[#6A6E6A] hover:text-[#F5F5F5]'
              }`}
            >
              ACTIVE DISPATCHES ({activePickups.length})
            </button>
            <button
              onClick={() => setTab('history')}
              data-qa-check="button"
              className={`min-h-[44px] px-3 border-b-2 font-bold uppercase transition flex items-center ${
                tab === 'history'
                  ? 'border-[#A3E635] text-[#A3E635]'
                  : 'border-transparent text-[#6A6E6A] hover:text-[#F5F5F5]'
              }`}
            >
              COMPLETED HISTORY ({pastPickups.length})
            </button>
          </div>

          <div className="space-y-4">
            {(tab === 'active' ? activePickups : pastPickups).map((pickup) => (
              <div
                key={pickup.id}
                data-qa-check="card"
                className="p-5 sm:p-6 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all rounded-sm corner-brackets flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#A3E635] font-bold">
                      #{pickup.id}
                    </span>
                    <span
                      data-qa-check="badge"
                      className={`px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold uppercase ${
                        pickup.status === 'PAID'
                          ? 'bg-[#A3E635]/10 text-[#A3E635] border border-[#A3E635]/30'
                          : 'bg-[#FFB020]/10 text-[#FFB020] border border-[#FFB020]/30'
                      }`}
                    >
                      {pickup.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-[#6A6E6A] hidden sm:inline">
                      {pickup.date}
                    </span>
                  </div>

                  <div className="text-sm font-body text-[#C8C8C8] truncate">
                    {pickup.address}
                  </div>

                  <div className="text-xs font-mono text-[#6A6E6A]">
                    ASSIGNED TO: <span className="text-[#F5F5F5]">Verified Kabadiwala</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1F221F] shrink-0">
                  <div className="font-mono text-right">
                    <span className="text-[10px] text-[#6A6E6A] block">
                      {pickup.status === 'PAID' ? 'FINAL PAYOUT:' : 'ESTIMATED VALUATION:'}
                    </span>
                    <span className="text-2xl font-bold font-display text-[#A3E635]">
                      ₹{pickup.actualPayout || pickup.totalEstimated}
                    </span>
                  </div>

                  <Link
                    to={`/track?id=${pickup.id}`}
                    data-qa-check="button"
                    className="min-h-[44px] px-4 py-2 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-xs font-mono text-[#A3E635] font-bold rounded-sm flex items-center gap-1.5 transition"
                  >
                    <Icon icon={Truck} size={14} />
                    <span>GPS TRACKER →</span>
                  </Link>
                </div>
              </div>
            ))}

            {(tab === 'active' ? activePickups : pastPickups).length === 0 && (
              <div className="py-16 text-center font-mono text-xs text-[#6A6E6A] bg-[#141614] border border-[#1F221F] p-8">
                NO RECORDS IN THIS STAGE. CLICK '+ SCHEDULE NEW PICKUP' TO DISPATCH.
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default UserDashboard;