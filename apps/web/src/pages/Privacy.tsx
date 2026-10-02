import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <div className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold mb-2">
            GOVERNANCE // EPR PRIVACY COMPLIANCE
          </div>
          <h1 className="font-display text-4xl sm:text-6xl uppercase tracking-tight">
            DATA PRIVACY & INFORMAL SECTOR PROTECTION
          </h1>
          <p className="text-xs font-mono text-[#6A6E6A] mt-1">LAST REVISED: OCTOBER 2026 // SIH26229</p>
        </div>

        <div className="p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6 font-mono text-xs text-[#C8C8C8] leading-relaxed">
          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">1. INFORMAL COLLECTOR IDENTITY PROTECTION</h3>
            <p>
              Kabadiwala Connect guarantees that informal waste collectors' personal data, residential addresses, and daily collection routes are never exposed publicly or commoditized. Digital QR passes encrypt operator identities under municipal privacy guidelines.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">2. CITIZEN DOORSTEP LOCATION RETENTION</h3>
            <p>
              Household addresses and GPS telemetry are utilized strictly for real-time dispatch and routing of assigned collectors. Geolocation records are de-identified after weighing and payment verification.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#A3E635] uppercase mb-2">3. EXTENDED PRODUCER RESPONSIBILITY (EPR) DATA DISCLOSURE</h3>
            <p>
              Aggregated recycling manifests and material purity percentages are reported to state pollution control boards (SPCB) and the Ministry of Mines to verify zero-landfill diversion. Individual citizen banking information is encrypted via RBI-compliant UPI gateways.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Privacy;