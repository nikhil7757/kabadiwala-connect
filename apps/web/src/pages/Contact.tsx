import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

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
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container className="max-w-5xl">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              CITIZEN &amp; COLLECTOR HELPLINE // 24/7 SUPPORT
            </span>
          </div>
          <h1
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#F5F5F5] uppercase tracking-tight"
          >
            CONTACT HEADQUARTERS
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            Direct communication channel for municipal grievance redressal, collector onboarding,
            and recycling mill accreditation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-w-0">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4 font-mono text-xs min-w-0">
            <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <Icon icon={Phone} size={20} className="text-[#A3E635]" />
              <div className="font-bold text-sm text-[#F5F5F5]">TOLL-FREE CITIZEN HELPLINE</div>
              <p className="text-[#6A6E6A]">1800-266-7272 (1800-SCRAP-KC)</p>
              <div className="text-[11px] text-[#A3E635]">Mon–Sat 08:00 to 20:00 IST</div>
            </div>

            <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <Icon icon={Mail} size={20} className="text-[#FFB020]" />
              <div className="font-bold text-sm text-[#F5F5F5]">ELECTRONIC DISPATCH</div>
              <p className="text-[#6A6E6A] truncate">support@kabadiwalaconnect.org.in</p>
              <p className="text-[#6A6E6A] truncate">grievance@jnarddc.gov.in</p>
            </div>

            <div data-qa-check="card" className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-3">
              <Icon icon={MapPin} size={20} className="text-[#A3E635]" />
              <div className="font-bold text-sm text-[#F5F5F5]">INNOVATION OFFICE</div>
              <p className="text-[#6A6E6A] leading-relaxed">
                JNARDDC Campus, Wadi, Amravati Road, Nagpur, Maharashtra 440023, India
              </p>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-7 min-w-0">
            <div
              data-qa-check="card"
              className="p-6 sm:p-8 bg-[#141614] border-2 border-[#1F221F] rounded-sm corner-brackets space-y-6 shadow-2xl"
            >
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
                  <Icon icon={CheckCircle2} size={32} className="text-[#A3E635] mx-auto animate-bounce" />
                  <div className="font-bold text-base text-[#F5F5F5]">
                    TICKET LOGGED SUCCESSFULLY!
                  </div>
                  <p className="text-[#6A6E6A]">
                    An officer has been assigned. You will receive an SMS response shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1.5 font-bold">YOUR FULL NAME:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] px-3.5 rounded-sm outline-none font-body text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#6A6E6A] uppercase mb-1.5 font-bold">EMAIL ADDRESS:</label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] px-3.5 rounded-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6A6E6A] uppercase mb-1.5 font-bold">TELEPHONE NUMBER:</label>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] px-3.5 rounded-sm outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1.5 font-bold">GRIEVANCE CATEGORY:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] text-[#F5F5F5] px-3 outline-none focus:border-[#A3E635] rounded-sm"
                    >
                      <option value="PICKUP_DISPATCH">Doorstep Pickup Delay / Scale Query</option>
                      <option value="RATES">Mandi Rate Variance Complaint</option>
                      <option value="COLLECTOR">Collector Registration Request</option>
                      <option value="MUNICIPALITY">Municipality / EPR Traceability</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#6A6E6A] uppercase mb-1.5 font-bold">INCIDENT MESSAGE:</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe the issue or inquiry in detail..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] text-[#F5F5F5] p-3.5 rounded-sm outline-none font-body text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    data-qa-check="button"
                    className="w-full min-h-[48px] bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-base font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-2 active:scale-95 transition"
                  >
                    <Icon icon={Send} size={16} />
                    <span>TRANSMIT TICKET TO CENTRAL AUDIT</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;