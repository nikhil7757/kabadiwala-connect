import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useLang } from '../../hooks/useLang';
import { useAuth } from '../../hooks/useAuth';

const navLinks = [
  { to: '/rates', label: 'Rates', labelHi: 'दरें' },
  { to: '/calculator', label: 'Calculator', labelHi: 'कैलकुलेटर' },
  { to: '/schedule', label: 'Schedule', labelHi: 'शेड्यूल' },
  { to: '/track', label: 'Track', labelHi: 'ट्रैक' },
  { to: '/collectors', label: 'Find Collectors', labelHi: 'कलेक्टर खोजें' },
];

const mockNotifications = [
  { id: 1, text: 'Your pickup #p12 was accepted!', time: '2 mins ago', unread: true },
  { id: 2, text: 'Collector Rajesh is on the way.', time: '10 mins ago', unread: true },
  { id: 3, text: 'Pickup completed. You earned Rs.340!', time: '1 hr ago', unread: false },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const unread = mockNotifications.filter(n => n.unread).length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-emerald-600 dark:text-emerald-400">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">KC</span>
          <span className="hidden sm:block">Kabadiwala Connect</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive(link.to)
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'hi' ? link.labelHi : link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {/* Language */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="px-2 py-1 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(v => !v)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
              aria-label="Notifications"
            >
              🔔
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700 font-bold text-sm">Notifications</div>
                {mockNotifications.map(n => (
                  <div key={n.id} className={`p-3 border-b border-slate-100 dark:border-slate-700 last:border-0 ${n.unread ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{n.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={user.role === 'COLLECTOR' ? '/collector' : '/dashboard'}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); nav('/'); }}
                className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-lg text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm"
            >
              Login
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setShowMenu(v => !v)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setShowMenu(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive(link.to)
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'hi' ? link.labelHi : link.label}
            </Link>
          ))}
          {user && (
            <Link
              to={user.role === 'COLLECTOR' ? '/collector' : '/dashboard'}
              onClick={() => setShowMenu(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}