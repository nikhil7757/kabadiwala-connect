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
  Layers,
  Truck,
} from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../common/Logo';
import { Icon } from '../common/Icon';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
}

/**
 * Standardized 3-Zone Sticky Glass Navbar (Phase 1, 2, 3)
 * Zone 1: Brand Logo & Wordmark (min-w-0, shrink-0)
 * Zone 2: Navigation Links (hidden on mobile, lg:flex, min-w-0)
 * Zone 3: Actions & Mobile Drawer Toggle (min-w-0, flex items-center, no collision)
 */
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
    { to: '/calculator', label: 'CALCULATOR', labelHi: 'कैलकुलेटर' },
    { to: '/track', label: 'LIVE TRACKER', labelHi: 'लाइव ट्रैकर' },
    { to: '/collectors', label: 'COLLECTORS', labelHi: 'कबाड़ीवाले' },
    { to: '/learn', label: 'GUIDE', labelHi: 'गाइड' },
  ];

  return (
    <>
      {/* 1. Main Sticky Header */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[30] h-[var(--header-h,72px)] bg-[#0A0B0A]/90 backdrop-blur-md border-b border-[#1F221F] transition-colors"
      >
        <div className="max-w-[1280px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4 min-w-0">
          {/* Zone 1: Logo & Brand Text */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 min-w-0 group"
            data-qa-check="nav-logo"
            aria-label="Kabadiwala Connect Home"
          >
            <Logo size="md" />
            <div className="hidden sm:flex flex-col min-w-0">
              <span className="font-heading font-black text-lg md:text-xl text-[#F5F5F5] tracking-wider leading-none uppercase truncate group-hover:text-[#A3E635] transition-colors">
                KABADIWALA CONNECT
              </span>
              <span className="font-mono text-[9px] text-[#A3E635] tracking-widest uppercase mt-1 leading-none">
                SCRAP · COMMUNITY · CHAIN
              </span>
            </div>
          </Link>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 font-mono text-xs min-w-0"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  data-qa-check="nav-item"
                  className={`px-3 py-2 rounded-sm transition-all flex items-center gap-1.5 uppercase tracking-wider font-semibold whitespace-nowrap min-h-[44px] ${
                    isActive
                      ? 'text-[#A3E635] bg-[#A3E635]/10 border border-[#A3E635]/30'
                      : 'text-[#C8C8C8] hover:text-[#F5F5F5] hover:bg-[#141614]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-[#A3E635]' : 'bg-transparent'
                    }`}
                  />
                  <span>{lang === 'hi' ? link.labelHi : link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Quick Toggles */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            {/* Command Palette Trigger (Desktop 2xl) */}
            <button
              onClick={onOpenCommandPalette}
              aria-label="Search and command palette"
              data-qa-check="button"
              className="hidden 2xl:inline-flex items-center gap-2 px-3 py-1.5 min-h-[44px] bg-[#141614] border border-[#1F221F] hover:border-[#6A6E6A] rounded-sm text-xs font-mono text-[#6A6E6A] hover:text-[#F5F5F5] transition"
            >
              <Icon icon={Search} size={16} />
              <span>⌘K</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-sm bg-[#141614] border border-[#1F221F] text-xs font-mono font-bold text-[#A3E635] hover:border-[#A3E635] transition flex items-center justify-center"
              aria-label="Toggle language between English and Hindi"
              data-qa-check="button"
            >
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>

            {/* Theme Switcher (Desktop/Tablet; Mobile available in drawer) */}
            <button
              onClick={toggleTheme}
              className="hidden sm:flex min-h-[44px] min-w-[44px] rounded-sm bg-[#141614] border border-[#1F221F] text-[#C8C8C8] hover:text-[#A3E635] items-center justify-center transition"
              aria-label="Toggle visual theme mode"
              data-qa-check="button"
            >
              <Icon icon={isDark ? Sun : Moon} size={16} />
            </button>

            {/* Notification Bell (Hidden on small mobile to avoid crowding; accessible in drawer) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="min-h-[44px] min-w-[44px] rounded-sm bg-[#141614] border border-[#1F221F] text-[#C8C8C8] hover:text-[#A3E635] flex items-center justify-center transition relative"
                aria-label="View notifications"
                data-qa-check="button"
              >
                <Icon icon={Bell} size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
                )}
              </button>

              {/* Notification Drawer Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-32px)] bg-[#0A0B0A] border-2 border-[#1F221F] rounded-sm shadow-2xl p-4 space-y-3 z-[40] corner-brackets">
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

            {/* Auth Link (Desktop) */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
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
                  data-qa-check="button"
                  className="min-h-[44px] px-3 py-1.5 bg-[#141614] border border-[#A3E635] text-xs font-mono font-bold text-[#A3E635] rounded-sm uppercase hover:bg-[#A3E635] hover:text-[#0A0B0A] transition flex items-center gap-1.5"
                >
                  <Icon icon={User} size={16} />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  data-qa-check="button"
                  className="min-h-[44px] min-w-[44px] text-xs font-mono text-[#6A6E6A] hover:text-[#FF6B5E] p-2 flex items-center justify-center"
                >
                  OUT
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                data-qa-check="button"
                className="hidden md:inline-flex items-center justify-center min-h-[44px] px-3.5 py-1.5 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-xs font-mono font-bold text-[#F5F5F5] rounded-sm uppercase transition"
              >
                LOGIN
              </Link>
            )}

            {/* Primary Action Button: Book Pickup (Desktop) */}
            <Link
              to="/book"
              data-qa-check="button"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-sm font-bold uppercase tracking-wider rounded-sm glow-lime active:scale-95 transition"
            >
              <Icon icon={Sparkles} size={16} />
              <span>{lang === 'hi' ? 'बुक करें' : 'BOOK PICKUP'}</span>
            </Link>

            {/* Mobile Hamburger Toggle (Visible < 1280px) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden min-h-[44px] min-w-[44px] rounded-sm bg-[#141614] border border-[#1F221F] text-[#F5F5F5] flex items-center justify-center"
              aria-label="Toggle navigation drawer"
              data-qa-check="button"
            >
              <Icon icon={mobileMenuOpen ? X : Menu} size={20} />
            </button>
          </div>
        </div>

        {/* 2. Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            role="dialog"
            aria-label="Mobile Navigation"
            className="xl:hidden fixed top-[var(--header-h,72px)] left-0 right-0 max-h-[calc(100vh-var(--header-h,72px)-var(--bottom-nav-h,64px))] overflow-y-auto bg-[#0A0B0A] border-b border-[#1F221F] p-4 space-y-4 font-mono text-sm shadow-2xl z-[40]"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  data-qa-check="nav-item"
                  className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-sm text-[#C8C8C8] hover:text-[#A3E635] hover:bg-[#141614]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635]" />
                  <span>{lang === 'hi' ? link.labelHi : link.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1F221F] space-y-2">
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                data-qa-check="button"
                className="flex items-center justify-center gap-2 min-h-[48px] w-full bg-[#A3E635] text-[#0A0B0A] font-heading font-bold text-sm uppercase tracking-wider rounded-sm"
              >
                <Icon icon={Sparkles} size={16} />
                <span>{lang === 'hi' ? 'स्क्रैप पिकअप बुक करें' : 'BOOK DOORSTEP PICKUP'}</span>
              </Link>

              <div className="flex items-center justify-between pt-2 border-t border-[#1F221F] text-xs">
                <span className="text-[#6A6E6A]">APPEARANCE</span>
                <button
                  onClick={toggleTheme}
                  data-qa-check="button"
                  className="flex items-center gap-2 px-3 py-2 bg-[#141614] border border-[#1F221F] text-[#C8C8C8] hover:text-[#A3E635] rounded-sm min-h-[44px]"
                >
                  <Icon icon={isDark ? Sun : Moon} size={16} />
                  <span>{isDark ? 'LIGHT MODE' : 'DARK MODE'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-[#A3E635] bg-[#141614] border border-[#1F221F] rounded-sm text-center min-h-[44px] flex items-center justify-center"
                >
                  CITIZEN PORTAL
                </Link>
                <Link
                  to="/collector"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-[#A3E635] bg-[#141614] border border-[#1F221F] rounded-sm text-center min-h-[44px] flex items-center justify-center"
                >
                  COLLECTOR TERMINAL
                </Link>
                <Link
                  to="/recycler"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-[#C8C8C8] bg-[#141614] border border-[#1F221F] rounded-sm text-center min-h-[44px] flex items-center justify-center"
                >
                  RECYCLER TRACE
                </Link>
                <Link
                  to="/municipality"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-xs text-[#C8C8C8] bg-[#141614] border border-[#1F221F] rounded-sm text-center min-h-[44px] flex items-center justify-center"
                >
                  GOVERNANCE
                </Link>
              </div>

              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  data-qa-check="button"
                  className="flex items-center justify-center min-h-[44px] w-full text-xs font-mono font-bold text-[#F5F5F5] bg-[#141614] border border-[#1F221F] rounded-sm uppercase mt-2"
                >
                  SIGN IN / REGISTER
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  data-qa-check="button"
                  className="w-full min-h-[44px] text-xs font-mono text-[#FF6B5E] bg-[#141614] border border-[#1F221F] rounded-sm uppercase mt-2 flex items-center justify-center"
                >
                  LOGOUT ({user.name})
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. Mobile Sticky Bottom Tab Bar (sm:hidden, height = var(--bottom-nav-h)) */}
      <nav
        role="navigation"
        aria-label="Mobile Bottom Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-[20] h-[var(--bottom-nav-h,64px)] bg-[#0A0B0A]/95 backdrop-blur-md border-t border-[#1F221F] flex items-center justify-around px-2 font-mono text-[10px] pb-[env(safe-area-inset-bottom)]"
      >
        <Link
          to="/"
          data-qa-check="nav-item"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] gap-1 ${
            location.pathname === '/' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Icon icon={Radio} size={16} />
          <span>HOME</span>
        </Link>

        <Link
          to="/rates"
          data-qa-check="nav-item"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] gap-1 ${
            location.pathname === '/rates' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Icon icon={Layers} size={16} />
          <span>RATES</span>
        </Link>

        {/* Center Booking Action: No negative margins, safe in-bar layout */}
        <Link
          to="/book"
          data-qa-check="button"
          aria-label="Book scrap pickup"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[48px] gap-1 text-[#A3E635] font-bold"
        >
          <div className="w-8 h-8 rounded-sm bg-[#A3E635] text-[#0A0B0A] flex items-center justify-center shadow-md">
            <Icon icon={Sparkles} size={16} />
          </div>
          <span className="text-[9px]">BOOK</span>
        </Link>

        <Link
          to="/track"
          data-qa-check="nav-item"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] gap-1 ${
            location.pathname === '/track' ? 'text-[#A3E635]' : 'text-[#6A6E6A]'
          }`}
        >
          <Icon icon={Truck} size={16} />
          <span>TRACK</span>
        </Link>

        <Link
          to={user ? '/dashboard' : '/auth'}
          data-qa-check="nav-item"
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[48px] gap-1 ${
            location.pathname.startsWith('/dashboard') || location.pathname === '/auth'
              ? 'text-[#A3E635]'
              : 'text-[#6A6E6A]'
          }`}
        >
          <Icon icon={User} size={16} />
          <span>ACCOUNT</span>
        </Link>
      </nav>
    </>
  );
};

export default Navbar;