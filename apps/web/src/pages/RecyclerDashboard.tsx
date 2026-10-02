import React, { useState } from 'react';
import { Factory, QrCode, ShieldCheck, CheckCircle2, ArrowRight, Layers, FileText } from 'lucide-react';
import { batchService } from '../services/pickupService';
import { recyclers } from '../data/seed';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../hooks/useLang';

export const RecyclerDashboard: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const [batches, setBatches] = useState(batchService.getAll());
  const [verifiedMap, setVerifiedMap] = useState<Record<string, boolean>>({});

  const handleVerifyBatch = (id: string) => {
    setVerifiedMap((prev) => ({ ...prev, [id]: true }));
  };

  const totalProcessedKg = batches.reduce((acc: number, b: any) => acc + b.weightKg, 0);

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-[#1F221F] mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                FORMAL RECYCLING MILL // EPR RECOVERY AUDIT
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
              RECYCLER TRACEABILITY PORTAL
            </h1>
            <p className="text-xs font-mono text-[#6A6E6A] mt-1">
              MILL: GREEN EARTH METALS & PLASTICS · REGISTRATION: MPCB-REG-2026-9021
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 bg-[#A3E635]/10 border border-[#A3E635] text-[#A3E635] font-bold rounded-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
              <span>EPR COMPLIANT CHAIN ACTIVE</span>
            </span>
          </div>
        </div>

        {/* 3 Telemetry Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">INCOMING BATCH VOLUME</div>
            <div className="font-display text-4xl font-bold text-[#A3E635]">
              {totalProcessedKg.toFixed(1)} KG
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              CERTIFIED BY DIGITAL SCALE LOGS
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">AVERAGE MATERIAL PURITY</div>
            <div className="font-display text-4xl font-bold text-[#FFB020]">
              97.2%
            </div>
            <div className="text-[11px] font-mono text-[#A3E635] mt-1">
              MEETS INDUSTRIAL SMELTING CRITERIA
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">DIGITAL LOT MANIFESTS</div>
            <div className="font-display text-4xl font-bold text-[#F5F5F5]">
              {batches.length} BATCHES
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              UNBROKEN CUSTODY FROM KABADI TO MILL
            </div>
          </div>
        </div>

        {/* Batch Traceability Ledger */}
        <div className="p-6 sm:p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
            <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
              LIVE INCOMING BATCH MANIFESTS
            </h3>
            <span className="font-mono text-xs text-[#6A6E6A]">
              QR CODE AUDITED BY JNARDDC
            </span>
          </div>

          <div className="space-y-4">
            {batches.map((batch: any) => {
              const isVerified = verifiedMap[batch.id] || batch.status === 'VERIFIED_IN_RECOVERY';
              return (
                <div
                  key={batch.id}
                  className="p-6 bg-[#0A0B0A] border border-[#1F221F] rounded-sm font-mono text-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#A3E635]">{batch.id}</span>
                      <span className="px-2 py-0.5 bg-[#A3E635]/10 text-[#A3E635] text-[10px] font-bold rounded-sm">
                        {batch.status}
                      </span>
                    </div>

                    <div className="text-sm font-body text-[#F5F5F5]">
                      Material: <span className="font-bold text-[#A3E635]">{batch.material}</span>
                    </div>

                    <div className="text-[#6A6E6A] space-x-4">
                      <span>ORIGIN PICKUP: #{batch.pickupId}</span>
                      <span>WEIGHT: <strong className="text-[#F5F5F5]">{batch.weightKg} kg</strong></span>
                      <span>PURITY: <strong className="text-[#FFB020]">{batch.purityPercent}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isVerified ? (
                      <div className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>MILL INTAKE VERIFIED</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleVerifyBatch(batch.id)}
                        className="px-5 py-2.5 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-bold uppercase rounded-sm flex items-center gap-2 transition"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>SCAN & INTAKE TO MILL</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RecyclerDashboard;
