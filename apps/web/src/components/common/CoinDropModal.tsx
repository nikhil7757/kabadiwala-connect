import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Scale, IndianRupee, QrCode, CheckCircle2, X } from 'lucide-react';
import { pickupService } from '../../services/pickupService';

interface CoinDropModalProps {
  pickup: any;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const CoinDropModal: React.FC<CoinDropModalProps> = ({
  pickup,
  isOpen,
  onClose,
  onComplete,
}) => {
  const [actualWeight, setActualWeight] = useState(14.5);
  const [ratePerKg, setRatePerKg] = useState(25);
  const [completed, setCompleted] = useState(false);
  const [batchId, setBatchId] = useState('');

  if (!isOpen || !pickup) return null;

  const totalPayout = Math.round(actualWeight * ratePerKg);

  const handleConfirmWeighing = () => {
    const generatedBatch = 'BATCH-2026-' + Math.floor(1000 + Math.random() * 9000);
    setBatchId(generatedBatch);

    // Update in localStorage
    pickupService.completeWeighing(pickup.id, actualWeight, totalPayout, generatedBatch);

    // Coin-drop confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#FFB020', '#A3E635', '#F5F5F5'],
      });
    } catch (err) {
      // safe
    }

    setCompleted(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0A0B0A] border-2 border-[#A3E635] p-6 sm:p-8 rounded-sm corner-brackets relative shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6A6E6A] hover:text-[#F5F5F5]"
        >
          <X className="w-5 h-5" />
        </button>

        {!completed ? (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-[#A3E635]/10 border border-[#A3E635] flex items-center justify-center text-[#A3E635]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
                  CERTIFIED DIGITAL WEIGHING
                </h3>
                <span className="font-mono text-xs text-[#6A6E6A]">
                  PICKUP // {pickup.id}
                </span>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#141614] border border-[#1F221F] rounded-sm flex justify-between">
                <span className="text-[#6A6E6A]">HOUSEHOLD:</span>
                <span className="text-[#F5F5F5] font-bold">{pickup.userName || pickup.userId}</span>
              </div>

              <div>
                <label className="block text-[#A3E635] uppercase mb-1 font-bold">
                  ACTUAL SCALE WEIGHT (KG):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#141614] border border-[#1F221F] focus:border-[#A3E635] text-2xl font-bold font-mono text-[#F5F5F5] p-3 rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-[#6A6E6A] uppercase mb-1">
                  AGREED MANDI RATE (₹/KG):
                </label>
                <input
                  type="number"
                  value={ratePerKg}
                  onChange={(e) => setRatePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#141614] border border-[#1F221F] text-lg font-bold font-mono text-[#F5F5F5] p-2.5 rounded-sm outline-none"
                />
              </div>

              {/* Total Payout Calculation Card */}
              <div className="p-4 bg-[#FFB020]/10 border border-[#FFB020] rounded-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#FFB020] uppercase font-bold block">
                    TOTAL SPOT PAYOUT:
                  </span>
                  <span className="text-3xl font-display font-black text-[#FFB020]">
                    ₹{totalPayout.toLocaleString()}
                  </span>
                </div>
                <div className="text-right text-[10px] text-[#6A6E6A]">
                  <span>INSTANT UPI / CASH</span>
                  <span className="block text-[#A3E635]">0% DEDUCTION</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmWeighing}
              className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime transition active:scale-95 flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-5 h-5" />
              <span>RECORD WEIGHT & TRIGGER PAYOUT</span>
            </button>
          </>
        ) : (
          /* Success Screen with Traceable Batch Generation */
          <div className="text-center py-6 space-y-4 font-mono">
            <div className="w-16 h-16 rounded-full bg-[#A3E635]/20 border-2 border-[#A3E635] flex items-center justify-center text-[#A3E635] mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-heading text-2xl font-bold text-[#F5F5F5] uppercase">
              PAYOUT DISPATCHED & BATCH CREATED!
            </h3>

            <div className="p-4 bg-[#141614] border border-[#A3E635]/40 rounded-sm text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">PAID TO CITIZEN:</span>
                <span className="text-[#FFB020] font-bold">₹{totalPayout}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">TRACEABLE BATCH ID:</span>
                <span className="text-[#A3E635] font-bold">{batchId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6A6E6A]">RECYCLER DESTINATION:</span>
                <span className="text-[#F5F5F5]">Green Earth Metals (Verified)</span>
              </div>
            </div>

            <p className="text-xs text-[#6A6E6A]">
              Batch has been synchronized to the Recycler Traceability Portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
