import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, Phone, User, CheckCircle2, Sparkles } from 'lucide-react';
import { ratesService } from '../../services/ratesService';
import { pickupService } from '../../services/pickupService';
import { useLang } from '../../hooks/useLang';

const TIME_SLOTS = [
  '09:00 AM – 11:00 AM',
  '11:00 AM – 01:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
];

export const BookingPanel: React.FC = () => {
  const { lang } = useLang();
  const navigate = useNavigate();
  const rates = ratesService.getAll();

  // Form State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['paper', 'metal']);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!address.trim() || address.length < 8) {
      setErrorMsg('Please provide a complete doorstep street address');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      // Create pickup in typed mock localStorage
      const newPickup = pickupService.create({
        userId: 'user_' + phone,
        userName: name,
        userPhone: phone,
        address: `${address}, ${city}`,
        date: `${date} · ${slot}`,
        items: selectedCategories,
        totalEstimated: 280,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A3E635', '#FFB020', '#F5F5F5'],
        });
      } catch (err) {
        // fallback safe
      }

      setIsSubmitting(false);
      setShowToast(true);

      setTimeout(() => {
        navigate(`/track?id=${newPickup.id}`);
      }, 1600);
    }, 700);
  };

  const categories = Array.from(new Set(rates.map((r: any) => r.category)));

  return (
    <section id="booking-section" className="py-24 bg-[#050605] border-b border-[#1F221F]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Marker */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-0.5 bg-[#A3E635]" />
          <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
            05 // DIRECT BOOKING CONSOLE
          </span>
        </div>

        <h2 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight mb-8">
          {lang === 'hi' ? 'तुरंत स्क्रैप पिकअप शेड्यूल करें' : 'DISPATCH A CERTIFIED COLLECTOR'}
        </h2>

        {/* Technical Console Frame */}
        <div className="bg-[#0A0B0A] border-2 border-[#1F221F] p-6 sm:p-12 corner-brackets relative shadow-2xl">
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#FF6B5E]/10 border border-[#FF6B5E] text-[#FF6B5E] text-xs font-mono font-bold rounded-sm">
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleBooking} className="space-y-8">
            {/* 1. Category Pill Selectors */}
            <div>
              <label className="block font-mono text-xs text-[#A3E635] uppercase tracking-wider mb-3 font-bold">
                1. SELECT SCRAP CATEGORIES TO RECYCLE:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat: any) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-4 py-2.5 rounded-sm font-mono text-xs uppercase font-bold tracking-wider border transition-all ${
                        isSelected
                          ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] shadow-[0_0_12px_rgba(163,230,53,0.3)]'
                          : 'bg-[#141614] text-[#C8C8C8] border-[#1F221F] hover:border-[#6A6E6A]'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Underline Inputs for Citizen Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="relative">
                <label className="flex items-center gap-2 font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                  <User className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>FULL NAME:</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] font-body text-base py-2 outline-none transition-colors placeholder:text-[#6A6E6A]/50"
                />
              </div>

              <div className="relative">
                <label className="flex items-center gap-2 font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                  <Phone className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>MOBILE (FOR LIVE TRACKING & UPI):</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent border-b-2 border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] font-mono text-base py-2 outline-none transition-colors placeholder:text-[#6A6E6A]/50"
                />
              </div>
            </div>

            {/* 3. Address & City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#A3E635]" />
                  <span>DOORSTEP STREET ADDRESS:</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat / Building, Road, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] font-body text-base py-2 outline-none transition-colors placeholder:text-[#6A6E6A]/50"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-[#6A6E6A] uppercase mb-1">
                  SERVICE METRO CITY:
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#141614] border border-[#1F221F] text-[#F5F5F5] font-mono text-sm py-2 px-3 outline-none focus:border-[#A3E635]"
                >
                  <option value="Mumbai">Mumbai (All Zones)</option>
                  <option value="Pune">Pune (Kothrud/Viman/Kalyani)</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            {/* 4. Radio Time-Slot Cards */}
            <div>
              <label className="flex items-center gap-2 font-mono text-xs text-[#A3E635] uppercase tracking-wider mb-3 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>2. SELECT PREFERRED TIME SLOT:</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {TIME_SLOTS.map((s) => {
                  const isChecked = slot === s;
                  return (
                    <label
                      key={s}
                      onClick={() => setSlot(s)}
                      className={`p-3.5 rounded-sm border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-[#A3E635] bg-[#A3E635]/10 text-[#F5F5F5]'
                          : 'border-[#1F221F] bg-[#141614] text-[#C8C8C8] hover:border-[#6A6E6A]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold">{s.split(' – ')[0]}</span>
                        <input
                          type="radio"
                          name="timeslot"
                          checked={isChecked}
                          onChange={() => setSlot(s)}
                          className="accent-[#A3E635]"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#6A6E6A]">{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 5. Pulsing CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1F221F]">
              <div className="text-xs font-mono text-[#6A6E6A]">
                🔒 100% FREE DOORSTEP PICKUP · VERIFIED WEIGHING SCALES
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-xl font-bold uppercase tracking-wider rounded-sm glow-lime active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                <span>
                  {isSubmitting
                    ? 'DISPATCHING TO COLLECTOR...'
                    : lang === 'hi'
                    ? 'पुष्टि करें व कबाड़ीवाला बुलाएं'
                    : 'CONFIRM & DISPATCH COLLECTOR'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Slide-in Toast on Success */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 p-5 bg-[#050605] border-2 border-[#A3E635] rounded-sm shadow-2xl flex items-center gap-4 text-xs font-mono text-[#F5F5F5] animate-slide-in">
          <CheckCircle2 className="w-6 h-6 text-[#A3E635] shrink-0" />
          <div>
            <div className="font-bold text-sm text-[#A3E635]">BOOKING DISPATCHED!</div>
            <div className="text-[#C8C8C8]">Redirecting to GPS live tracker...</div>
          </div>
        </div>
      )}
    </section>
  );
};
