import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Radio,
  Search,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  User,
  Shield,
  Truck,
  Layers,
  Award,
} from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette }) => {
  const { lang, setLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'Pickup #p0 Accepted', text: 'Collector Rajesh Kumar is en route with scale.', time: '4m ago', read: false },
    { id: 2, title: 'Rate Alert: Copper Spike', text: 'Copper wire prices rose +₹15/kg today in Mumbai mandi.', time: '1h ago', read: false },
    { id: 3, title: 'Traceability Verified', text: 'Batch #B-9402 arrived at Green Earth Metals.', time: '3h ago', read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { to: '/rates', label: 'RATES (₹/KG)', labelHi: 'स्क्रैप दरें' },
    { to: '/calculator', label: 'SMART CALCULATOR', labelHi: 'कैलकुलेटर' },
    { to: '/track', label: 'LIVE TRACKER', labelHi: 'लाइव ट्रैकर' },
    { to: '/collectors', label: 'COLLECTORS', labelHi: 'कबाड़ीवाले' },
    { to: '/learn', label: 'SEGREGATION GUIDE', labelHi: 'गाइड' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0A]/85 backdrop-blur-md border-b border-[#1F221F] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Left Brand Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <span className="w-10 h-10 rounded-sm bg-[#A3E635] text-[#0A0B0A] font-display text-2xl font-black flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.3)] group-hover:scale-105 transition-transform">
              KC
            </span>
            <div className="hidden sm:block">
              <span className="font-heading font-black text-xl text-[#F5F5F5] tracking-wider block leading-none">
                KABADIWALA CONNECT
              </span>
              <span className="font-mono text-[9px] text-[#A3E635] tracking-widest block uppercase mt-1">
                SCRAP · COMMUNITY · CHAIN
              </span>
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-sm transition-all flex items-center gap-2 uppercase tracking-wider font-semibold ${
                    isActive
                      ? 'text-[#A3E635] bg-[#A3E635]/10 border border-[#A3E635]/30'
                      : 'text-[#C8C8C8] hover:text-[#F5F5F5] hover:bg-[#141614]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#A3E635] animate-ping' : 'bg-transparent'
                    }`}
                  />
                  <span>{lang === 'hi' ? link.labelHi : link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Toggles */}
          <div className="flex items-center gap-2">
            {/* Command Palette Trigger (Ctrl+K) */}
            <button
              onClick={onOpenCommandPalette}
              aria-label="Search and command palette"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#141614] border border-[#1F221F] hover:border-[#6A6E6A] rounded-sm text-xs font-mono text-[#6A6E6A] hover:text-[#F5F5F5] transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>⌘K</span>
            </button>

            {/* Language Toggle (EN / HI) */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 rounded-sm bg-[#141614] border border-[#1F221F] text-xs font-mono font-bold text-[#A3E635] hover:border-[#A3E635] transition"
              aria-label="Toggle language"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-sm bg-[#141614] border border-[#1F221F] text-[#C8C8C8] hover:text-[#A3E635] flex items-center justify-center transition"
              aria-label="Toggle visual mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="w-9 h-9 rounded-sm bg-[#141614] border border-[#1F221F] text-[#C8C8C8] hover:text-[#A3E635] flex items-center justify-center transition relative"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                )}
              </button>

              {/* Notification Drawer */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0A0B0A] border-2 border-[#1F221F] rounded-sm shadow-2xl p-4 space-y-3 z-50 corner-brackets">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1F221F] text-xs font-mono">
                    <span className="font-bold text-[#F5F5F5] uppercase">TELEMETRY ALERTS</span>
                    <span className="text-[#A3E635]">{unreadCount} NEW</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-sm border text-xs font-mono space-y-1 transition ${
                          !n.read
                            ? 'bg-[#141614] border-[#A3E635]/40 text-[#F5F5F5]'
                            : 'bg-[#050605] border-[#1F221F] text-[#6A6E6A]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#A3E635]">{n.title}</span>
                          <span className="text-[10px] text-[#6A6E6A]">{n.time}</span>
                        </div>
                        <p className="text-[11px] font-body text-[#C8C8C8]">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Dropdown or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={
                    user.role === 'COLLECTOR'
                      ? '/collector'
                      : user.role === 'RECYCLER'
                      ? '/recycler'
                      : user.role === 'MUNICIPALITY'
                      ? '/municipality'
                      : '/dashboard'
                  }
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#141614] border border-[#A3E635] text-xs font-mono font-bold text-[#A3E635] rounded-sm uppercase hover:bg-[#A3E635] hover:text-[#0A0B0A] transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-xs font-mono text-[#6A6E6A] hover:text-[#FF6B5E] px-2 py-1"
                >
                  OUT
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-xs font-mono font-bold text-[#F5F5F5] rounded-sm uppercase transition"
              >
                <span>LOGIN</span>
              </Link>
            )}

            {/* Primary CTA (Book Pickup) */}
            <Link
              to="/book"
              className="px-4 py-2 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-lime flex items-center gap-1.5 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'hi' ? 'बुक करें' : 'BOOK PICKUP'}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-sm bg-[#141614] border border-[#1F221F] text-[#F5F5F5] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 py-6 bg-[#0A0B0A] border-b border-[#1F221F] space-y-4 font-mono text-sm">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-sm text-[#C8C8C8] hover:text-[#A3E635] hover:bg-[#141614]"
                >
                  {lang === 'hi' ? link.labelHi : link.label}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#1F221F] space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#A3E635] hover:bg-[#141614]"
              >
                HOUSEHOLD DASHBOARD
              </Link>
              <Link
                to="/collector"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#A3E635] hover:bg-[#141614]"
              >
                COLLECTOR TERMINAL
              </Link>
              <Link
                to="/recycler"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#A3E635] hover:bg-[#141614]"
              >
                RECYCLER BATCH TRACEABILITY
              </Link>
              <Link
                to="/municipality"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#A3E635] hover:bg-[#141614]"
              >
                MUNICIPALITY GOVERNANCE
              </Link>
              <Link
                to="/rewards"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-[#FFB020] hover:bg-[#141614]"
              >
                GREEN LEADERBOARD & REWARDS
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Sticky Bottom Tab Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0B0A]/95 backdrop-blur-md border-t border-[#1F221F] h-16 flex items-center justify-around px-2 font-mono text-[10px]">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${
            location.pathname === '/' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span>HOME</span>
        </Link>
        <Link
          to="/rates"
          className={`flex flex-col items-center gap-1 ${
            location.pathname === '/rates' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>RATES</span>
        </Link>
        <Link
          to="/book"
          className="flex flex-col items-center gap-1 text-[#A3E635] font-bold"
        >
          <div className="w-10 h-10 rounded-full bg-[#A3E635] text-[#0A0B0A] flex items-center justify-center -mt-5 shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span>BOOK</span>
        </Link>
        <Link
          to="/track"
          className={`flex flex-col items-center gap-1 ${
            location.pathname === '/track' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>TRACK</span>
        </Link>
        <Link
          to={user ? '/dashboard' : '/auth'}
          className={`flex flex-col items-center gap-1 ${
            location.pathname.startsWith('/dashboard') || location.pathname === '/auth'
              ? 'text-[#A3E635]'
              : 'text-[#6A6E6A]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>ACCOUNT</span>
        </Link>
      </div>
    </>
  );
};