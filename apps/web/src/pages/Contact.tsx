import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLang } from '../hooks/useLang';

export const Contact: React.FC = () => {
  const { lang } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('PICKUP_DISPATCH');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 15) {
      setErrorMsg('Please write a message of at least 15 characters.');
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              CITIZEN & COLLECTOR HELPLINE // 24/7 SUPPORT
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            CONTACT HEADQUARTERS
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            Direct communication channel for municipal grievance redressal, collector onboarding,
            and recycling mill accreditation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs">
            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <Phone className="w-5 h-5 text-[#A3E635]" />
              <div className="font-bold text-sm text-[#F5F5F5]">TOLL-FREE CITIZEN HELPLINE</div>
              <p className="text-[#6A6E6A]">1800-266-7272 (1800-SCRAP-KC)</p>
              <div className="text-[11px] text-[#A3E635]">Operating: Mon–Sat 08:00 to 20:00 IST</div>
            </div>

            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <Mail className="w-5 h-5 text-[#FFB020]" />
              <div className="font-bold text-sm text-[#F5F5F5]">ELECTRONIC DISPATCH</div>
              <p className="text-[#6A6E6A]">support@kabadiwalaconnect.org.in</p>
              <p className="text-[#6A6E6A]">grievance@jnarddc.gov.in</p>
            </div>

            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <MapPin className="w-5 h-5 text-[#A3E635]" />
              <div className="font-bold text-sm text-[#F5F5F5]">INNOVATION OFFICE</div>
              <p className="text-[#6A6E6A] leading-relaxed">
                JNARDDC Campus, Wadi, Amravati Road, Nagpur, Maharashtra 440023, India
              </p>
            </div>
          </div>

          {/* Right Column: Technical Support Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 bg-[#141614] border-2 border-[#1F221F] rounded-sm corner-brackets space-y-6 shadow-2xl">
              <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5] pb-3 border-b border-[#1F221F]">
                DISPATCH SUPPORT TICKET
              </h3>

              {errorMsg && (
                <div className="p-3 bg-[#FF6B5E]/10 border border-[#FF6B5E] text-[#FF6B5E] text-xs font-mono font-bold rounded-sm">
                  ⚠ {errorMsg}
                </div>
              )}

              {submitted ? (
                <div className="p-8 bg-[#050605] border border-[#A3E635] text-center space-y-3 font-mono text-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#A3E635] mx-auto animate-bounce" />
                  <div className="font-bold text-base text-[#F5F5F5]">
                    TICKET #KC-TK-2026-914 LOGGED!
                  </div>
                  <p className="text-[#6A6E6A]">
                    An officer has been assigned. You will receive an SMS response within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1">YOUR FULL NAME:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 rounded-sm outline-none font-body text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#6A6E6A] uppercase mb-1">EMAIL ADDRESS:</label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 rounded-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#6A6E6A] uppercase mb-1">PHONE NUMBER:</label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 rounded-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1">ISSUE CATEGORY:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#050605] border border-[#1F221F] text-[#F5F5F5] p-3 rounded-sm outline-none focus:border-[#A3E635]"
                    >
                      <option value="PICKUP_DISPATCH">Pickup Dispatch Inquiry</option>
                      <option value="COLLECTOR_ONBOARDING">Informal Collector Verification / KYC</option>
                      <option value="RECYCLER_EPR">Recycling Mill EPR Registration</option>
                      <option value="MANDI_RATES">Discrepancy in Mandi Rates</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1">YOUR MESSAGE (MIN 15 CHARACTERS):</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your issue or question in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3 rounded-sm outline-none font-body text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>TRANSMIT SUPPORT TICKET</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Contact;