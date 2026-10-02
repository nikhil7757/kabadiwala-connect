import React from 'react';
import { Building2, ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { useLang } from '../hooks/useLang';

export const MunicipalityDashboard: React.FC = () => {
  const { lang } = useLang();

  const wardReports = [
    { ward: 'Ward K/West (Andheri/Juhu, Mumbai)', divertedTons: 142.5, activeKabadiwalas: 84, complianceScore: 96 },
    { ward: 'Ward H/West (Bandra/Khar, Mumbai)', divertedTons: 118.2, activeKabadiwalas: 62, complianceScore: 94 },
    { ward: 'Kothrud Zone (Pune Municipal Corp)', divertedTons: 94.0, activeKabadiwalas: 51, complianceScore: 91 },
    { ward: 'Indiranagar Sub-division (BBMP Bengaluru)', divertedTons: 165.4, activeKabadiwalas: 98, complianceScore: 98 },
    { ward: 'South Delhi Zone (MCD Delhi)', divertedTons: 182.1, activeKabadiwalas: 112, complianceScore: 89 },
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
                MUNICIPAL CORPORATION AUDIT // URBAN SOLID WASTE
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
              MUNICIPALITY GOVERNANCE CONSOLE
            </h1>
            <p className="text-xs font-mono text-[#6A6E6A] mt-1">
              JURISDICTION: URBAN LOCAL BODIES · MINISTRY OF HOUSING & URBAN AFFAIRS ALIGNED
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 bg-[#A3E635]/10 border border-[#A3E635] text-[#A3E635] font-bold rounded-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
              <span>SWACHH BHARAT URBAN 2.0 PROTOCOL</span>
            </span>
          </div>
        </div>

        {/* 3 City Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">LANDFILL DIVERSION RATE</div>
            <div className="font-display text-4xl font-bold text-[#A3E635]">
              702.2 TONNES
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              SAVED FROM DEONAR & GHAZIPUR SITES
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">INFORMAL WORKERS FORMALIZED</div>
            <div className="font-display text-4xl font-bold text-[#FFB020]">
              1,240 OPERATORS
            </div>
            <div className="text-[11px] font-mono text-[#A3E635] mt-1">
              ISSUED BIOMETRIC / QR GOVERNMENT PASSES
            </div>
          </div>

          <div className="p-6 bg-[#141614] border border-[#1F221F] corner-brackets">
            <div className="font-mono text-xs text-[#6A6E6A] mb-2">MUNICIPAL TRUCKING FUEL AVOIDED</div>
            <div className="font-display text-4xl font-bold text-[#F5F5F5]">
              48,200 LITRES
            </div>
            <div className="text-[11px] font-mono text-[#6A6E6A] mt-1">
              FIRST-MILE DECENTRALIZED ZERO-EMISSION LOGISTICS
            </div>
          </div>
        </div>

        {/* Ward-wise Collection Volume Table */}
        <div className="p-6 sm:p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
            <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
              WARD-LEVEL DIVERSION PERFORMANCE AUDIT
            </h3>
            <span className="font-mono text-xs text-[#6A6E6A]">OCTOBER 2026 CYCLE</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#1F221F] text-[#6A6E6A]">
                  <th className="pb-3 uppercase">MUNICIPAL WARD</th>
                  <th className="pb-3 uppercase">DIVERTED WEIGHT</th>
                  <th className="pb-3 uppercase">VERIFIED OPERATORS</th>
                  <th className="pb-3 uppercase">COMPLIANCE INDEX</th>
                  <th className="pb-3 uppercase">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F221F]">
                {wardReports.map((w, idx) => (
                  <tr key={idx} className="hover:bg-[#0A0B0A]/50 transition">
                    <td className="py-4 font-bold text-[#F5F5F5] flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                      <span>{w.ward}</span>
                    </td>
                    <td className="py-4 text-[#A3E635] font-bold">{w.divertedTons} T</td>
                    <td className="py-4 text-[#F5F5F5]">{w.activeKabadiwalas} collectors</td>
                    <td className="py-4 text-[#FFB020] font-bold">{w.complianceScore}%</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 bg-[#A3E635]/10 text-[#A3E635] font-bold rounded-sm">
                        CERTIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MunicipalityDashboard;
