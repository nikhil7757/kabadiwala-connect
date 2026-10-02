import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { ratesService } from '../services/ratesService';
import { pickupService } from '../services/pickupService';
import { useAuth } from '../hooks/useAuth';
import { useLang } from '../hooks/useLang';

const TIME_SLOTS = [
  '09:00 AM – 11:00 AM',
  '11:00 AM – 01:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
];

export const SchedulePickup: React.FC = () => {
  const { lang } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCollector = searchParams.get('collector');

  const allRates = ratesService.getAll();

  const [step, setStep] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>(['1', '3', '6']);
  const [weights, setWeights] = useState<Record<string, number>>({ '1': 10, '3': 5, '6': 2 });
  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '9876543210');
  const [address, setAddress] = useState('Flat 402, Green Meadows, Link Road');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [pincode, setPincode] = useState('400053');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      if (selectedItems.length > 1) {
        setSelectedItems(selectedItems.filter((i) => i !== id));
      }
    } else {
      setSelectedItems([...selectedItems, id]);
      if (!weights[id]) {
        setWeights({ ...weights, [id]: 5 });
      }
    }
  };

  const totalEstimate = selectedItems.reduce((acc, id) => {
    const r = allRates.find((item: any) => item.id === id);
    return acc + (r ? r.rate * (weights[id] || 1) : 0);
  }, 0);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1 && selectedItems.length === 0) {
      setErrorMsg('Please select at least one material.');
      return;
    }
    if (step === 2) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!/^[6-9]\d{9}$/.test(phone)) {
        setErrorMsg('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!address.trim() || address.length < 8) {
        setErrorMsg('Please provide a complete doorstep street address.');
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const created = pickupService.create({
        userId: user?.id || 'usr_' + phone,
        userName: name,
        userPhone: phone,
        address: `${address}, ${city} - ${pincode}`,
        date: `${date} · ${slot}`,
        collectorId: preselectedCollector || 'c1',
        items: selectedItems,
        totalEstimated: totalEstimate,
      });

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#A3E635', '#FFB020', '#FFFFFF'],
        });
      } catch (err) {}

      setIsSubmitting(false);
      navigate(`/track?id=${created.id}`);
    }, 700);
  };

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] text-xs font-mono font-bold tracking-widest rounded-sm mb-3">
            STEP 0{step} OF 04 // PICKUP DISPATCH WIZARD
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
            {lang === 'hi' ? 'कबाड़ पिकअप शेड्यूलर' : 'SCHEDULE DOORSTEP PICKUP'}
          </h1>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-4 gap-2 mb-8 font-mono text-xs">
          {[
            { num: 1, label: 'ITEMS' },
            { num: 2, label: 'ADDRESS' },
            { num: 3, label: 'SCHEDULE' },
            { num: 4, label: 'CONFIRM' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-3 rounded-sm border text-center transition-all ${
                step === s.num
                  ? 'border-[#A3E635] bg-[#A3E635]/10 text-[#A3E635] font-bold'
                  : step > s.num
                  ? 'border-[#1F221F] bg-[#141614] text-[#A3E635]'
                  : 'border-[#1F221F] bg-[#050605] text-[#6A6E6A]'
              }`}
            >
              <span>0{s.num} // </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Wizard Card */}
        <div className="bg-[#141614] border-2 border-[#1F221F] p-6 sm:p-10 corner-brackets relative shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#FF6B5E]/10 border border-[#FF6B5E] text-[#FF6B5E] text-xs font-mono font-bold rounded-sm">
              ⚠ {errorMsg}
            </div>
          )}

          {/* STEP 1: Select Items & Weights */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
                <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
                  1. SELECT MATERIALS & ESTIMATED KG
                </h3>
                <span className="font-mono text-xs text-[#A3E635]">
                  EST: ₹{totalEstimate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                {allRates.map((item: any) => {
                  const isSelected = selectedItems.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#A3E635] bg-[#0A0B0A]'
                          : 'border-[#1F221F] bg-[#050605] hover:border-[#6A6E6A]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-heading text-sm uppercase font-bold text-[#F5F5F5]">
                            {item.name}
                          </div>
                          <span className="text-xs font-mono text-[#A3E635]">
                            ₹{item.rate}/kg
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div
                          className="flex items-center gap-1 font-mono text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="number"
                            min="1"
                            value={weights[item.id] || 5}
                            onChange={(e) =>
                              setWeights({
                                ...weights,
                                [item.id]: Math.max(1, parseInt(e.target.value) || 1),
                              })
                            }
                            className="w-14 bg-[#141614] border border-[#1F221F] text-center text-[#F5F5F5] font-bold py-1 px-1 rounded-sm"
                          />
                          <span className="text-[#6A6E6A]">KG</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Address & Citizen Contact */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                2. CITIZEN DOORSTEP LOCATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                    FULL NAME:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 font-body text-sm rounded-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                    PHONE (FOR SATELLITE OTP & UPI):
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 font-mono text-sm rounded-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                  STREET / BUILDING / APARTMENT:
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 font-body text-sm rounded-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                    METRO CITY:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#050605] border border-[#1F221F] text-[#F5F5F5] p-3 font-mono text-sm rounded-sm outline-none"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                    PINCODE (6-DIGIT):
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 font-mono text-sm rounded-sm outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Date & Slot Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                3. PICKUP DATE & TIME WINDOW
              </h3>

              <div>
                <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-2">
                  SELECT DATE:
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 font-mono text-sm rounded-sm outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-2">
                  RADIO TIME-SLOT WINDOW:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.map((s) => (
                    <label
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`p-4 rounded-sm border cursor-pointer transition-all flex items-center justify-between ${
                        slot === s
                          ? 'border-[#A3E635] bg-[#A3E635]/10 text-[#F5F5F5]'
                          : 'border-[#1F221F] bg-[#050605] text-[#C8C8C8]'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold">{s}</span>
                      <input
                        type="radio"
                        checked={slot === s}
                        onChange={() => setSlot(s)}
                        className="accent-[#A3E635]"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Dispatch */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                4. AUDIT & DISPATCH CONFIRMATION
              </h3>

              <div className="p-6 bg-[#050605] border border-[#1F221F] rounded-sm space-y-4 font-mono text-xs">
                <div className="flex justify-between border-b border-[#1F221F] pb-3">
                  <span className="text-[#6A6E6A]">DOORSTEP ADDRESS:</span>
                  <span className="text-[#F5F5F5] font-bold text-right">
                    {address}, {city} - {pincode}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#1F221F] pb-3">
                  <span className="text-[#6A6E6A]">SCHEDULED WINDOW:</span>
                  <span className="text-[#A3E635] font-bold">
                    {date} // {slot}
                  </span>
                </div>

                <div className="flex justify-between border-b border-[#1F221F] pb-3">
                  <span className="text-[#6A6E6A]">CITIZEN CONTACT:</span>
                  <span className="text-[#F5F5F5]">{name} ({phone})</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-bold text-[#F5F5F5]">ESTIMATED PAYOUT:</span>
                  <span className="font-display text-3xl font-black text-[#A3E635]">
                    ₹{totalEstimate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#6A6E6A]">
                <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
                <span>Collector will bring a certified digital scale. You receive cash or UPI.</span>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-8 border-t border-[#1F221F] flex items-center justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 bg-[#050605] border border-[#1F221F] hover:border-[#6A6E6A] font-mono text-xs uppercase font-bold text-[#F5F5F5] rounded-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-2"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="px-10 py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-xl font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH PICKUP REQUEST'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SchedulePickup;