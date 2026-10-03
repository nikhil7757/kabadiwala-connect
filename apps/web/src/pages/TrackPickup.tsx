import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  CheckCircle2,
  MapPin,
  Phone,
  Navigation,
  RefreshCw,
} from 'lucide-react';
import { pickupService } from '../services/pickupService';
import { collectors } from '../data/seed';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

const STEPS = ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'WEIGHED', 'PAID'];

export const TrackPickup: React.FC = () => {
  const { lang } = useLang();
  const [params] = useSearchParams();
  const id = params.get('id');

  const [pickup, setPickup] = useState<any>(null);
  const [collector, setCollector] = useState<any>(null);
  const [gpsPos, setGpsPos] = useState({ x: 35, y: 40 });

  const loadPickup = () => {
    const all = pickupService.getAll();
    let found = null;
    if (id) {
      found = all.find((p: any) => p.id === id);
    }
    if (!found) {
      found = all[0];
    }
    setPickup(found);

    const col = collectors.find((c) => c.id === found?.collectorId) || collectors[0];
    setCollector(col);
  };

  useEffect(() => {
    loadPickup();
    const interval = setInterval(loadPickup, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const moveTimer = setInterval(() => {
      setGpsPos((prev) => ({
        x: Math.min(85, Math.max(20, prev.x + (Math.random() - 0.45) * 4)),
        y: Math.min(80, Math.max(25, prev.y + (Math.random() - 0.45) * 4)),
      }));
    }, 2000);
    return () => clearInterval(moveTimer);
  }, []);

  if (!pickup) {
    return (
      <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-24 text-center font-mono">
        <Container>
          <h2 className="text-2xl text-[#FF6B5E]">NO PICKUP RECORD FOUND</h2>
          <Link
            to="/book"
            data-qa-check="button"
            className="mt-4 inline-flex items-center min-h-[44px] px-4 text-[#A3E635] hover:underline"
          >
            Schedule New Pickup →
          </Link>
        </Container>
      </div>
    );
  }

  const currentIdx = STEPS.indexOf(pickup.status);

  const advanceStatus = () => {
    const nextIdx = (currentIdx + 1) % STEPS.length;
    pickupService.updateStatus(pickup.id, STEPS[nextIdx]);
    loadPickup();
  };

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                TELEMETRY RADAR // REAL-TIME GPS
              </span>
            </div>
            <h1
              data-qa-check="heading"
              className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
            >
              TRACK PICKUP: {pickup.id}
            </h1>
            <p className="text-xs font-mono text-[#6A6E6A] mt-1">
              SCHEDULED: {pickup.date || 'Today · Active Window'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={advanceStatus}
              data-qa-check="button"
              className="min-h-[44px] px-4 py-2 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-xs font-mono text-[#A3E635] font-bold rounded-sm flex items-center gap-2"
            >
              <Icon icon={RefreshCw} size={14} />
              <span>SIMULATE NEXT STATUS ({pickup.status})</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0">
          {/* Left Column: 5-Stage Status Timeline */}
          <div className="lg:col-span-6 space-y-6 min-w-0">
            <div
              data-qa-check="card"
              className="p-6 sm:p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-8"
            >
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                DISPATCH PIPELINE STATUS
              </h3>

              <div className="relative pl-6 space-y-8 border-l-2 border-[#1F221F]">
                {STEPS.map((stepName, idx) => {
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stepName} className="relative">
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#A3E635] border-[#A3E635] text-[#0A0B0A]'
                            : 'bg-[#0A0B0A] border-[#1F221F] text-[#6A6E6A]'
                        }`}
                      >
                        {isDone ? (
                          <Icon icon={CheckCircle2} size={16} className="stroke-[3]" />
                        ) : (
                          <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span
                            className={`font-bold tracking-wider ${
                              isCurrent
                                ? 'text-[#A3E635] text-sm'
                                : isDone
                                ? 'text-[#F5F5F5]'
                                : 'text-[#6A6E6A]'
                            }`}
                          >
                            {stepName.replace(/_/g, ' ')}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-[#A3E635]/20 text-[#A3E635] text-[10px] font-bold rounded-sm animate-pulse">
                              LIVE CURRENT
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs font-body text-[#C8C8C8]">
                          {stepName === 'REQUESTED' && 'Citizen booking broadcasted to nearby verified collectors.'}
                          {stepName === 'ACCEPTED' && 'Collector accepted request; preparing calibrated scale.'}
                          {stepName === 'ON_THE_WAY' && 'Collector cart is in transit to your doorstep GPS coordinates.'}
                          {stepName === 'WEIGHED' && 'Certified scale weight audited and digital purity verified.'}
                          {stepName === 'PAID' && 'Instant UPI payout credited directly to citizen account.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Collector Digital Profile Card */}
            {collector && (
              <div
                data-qa-check="card"
                className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-4"
              >
                <span className="font-mono text-xs text-[#A3E635] font-bold uppercase tracking-wider block">
                  ASSIGNED VERIFIED COLLECTOR
                </span>

                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      data-qa-check="avatar"
                      className="w-12 h-12 rounded-sm bg-[#050605] border border-[#1F221F] flex items-center justify-center font-display text-xl text-[#A3E635] font-bold shrink-0 aspect-square"
                    >
                      {collector.name[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading text-lg uppercase font-bold text-[#F5F5F5] truncate">
                        {collector.name}
                      </h4>
                      <span className="text-xs font-mono text-[#6A6E6A] truncate block">
                        OPERATOR ID: KC-MH-{collector.id.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${collector.phone}`}
                    data-qa-check="button"
                    className="min-h-[44px] px-4 py-2 bg-[#A3E635] text-[#0A0B0A] font-mono text-xs font-bold uppercase rounded-sm flex items-center gap-2 hover:bg-[#bbf451] transition shrink-0"
                  >
                    <Icon icon={Phone} size={14} />
                    <span>CALL ({collector.phone.slice(-4)})</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-[#1F221F] flex items-center justify-between text-xs font-mono text-[#6A6E6A]">
                  <span>VEHICLE: PUSH CART / EV TEMPO</span>
                  <span className="text-[#A3E635]">CALIBRATED SCALE: CERTIFIED</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Moving GPS Radar Screen */}
          <div className="lg:col-span-6 space-y-6 min-w-0">
            <div
              data-qa-check="card"
              className="p-6 sm:p-8 bg-[#050605] border-2 border-[#1F221F] rounded-sm corner-brackets space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#A3E635] font-bold flex items-center gap-1.5">
                  <Icon icon={Navigation} size={16} className="text-[#A3E635] animate-spin-slow" />
                  <span>SATELLITE POSITIONING RADAR</span>
                </span>
                <span className="text-[#6A6E6A]">EST. ARRIVAL: 14 MINS</span>
              </div>

              {/* Map Canvas */}
              <div className="relative h-72 sm:h-96 bg-[#0A0B0A] border border-[#1F221F] rounded-sm overflow-hidden scanline">
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #1F221F 1px, transparent 1px), linear-gradient(to bottom, #1F221F 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Destination Point (Citizen Home) */}
                <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#A3E635]/20 border border-[#A3E635] flex items-center justify-center text-[#A3E635] animate-pulse">
                    <Icon icon={MapPin} size={16} />
                  </div>
                  <span className="font-mono text-[9px] text-[#A3E635] font-bold bg-[#0A0B0A]/90 px-1 mt-1 border border-[#1F221F]">
                    CITIZEN HOME
                  </span>
                </div>

                {/* Moving GPS Collector Pin */}
                <motion.div
                  className="absolute flex flex-col items-center cursor-pointer"
                  style={{ left: `${gpsPos.x}%`, top: `${gpsPos.y}%` }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#FFB020]/20 border-2 border-[#FFB020] flex items-center justify-center text-[#FFB020] shadow-[0_0_20px_rgba(255,176,32,0.6)]">
                      <Icon icon={Truck} size={18} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#A3E635] animate-ping" />
                  </div>
                  <span className="font-mono text-[9px] text-[#FFB020] font-bold bg-[#0A0B0A]/90 px-1.5 py-0.5 mt-1 border border-[#1F221F] rounded-sm">
                    {collector?.name?.split(' ')[0] || 'KABADIWALA'}
                  </span>
                </motion.div>
              </div>

              {/* Telemetry Readout */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center text-xs">
                <div className="p-3 bg-[#141614] border border-[#1F221F]">
                  <span className="text-[#6A6E6A] text-[10px] block">DISTANCE</span>
                  <span className="font-bold text-[#F5F5F5]">1.2 KM</span>
                </div>
                <div className="p-3 bg-[#141614] border border-[#1F221F]">
                  <span className="text-[#6A6E6A] text-[10px] block">SPEED</span>
                  <span className="font-bold text-[#A3E635]">12 KM/H</span>
                </div>
                <div className="p-3 bg-[#141614] border border-[#1F221F]">
                  <span className="text-[#6A6E6A] text-[10px] block">TRANSIT</span>
                  <span className="font-bold text-[#FFB020]">ON SCHEDULE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrackPickup;