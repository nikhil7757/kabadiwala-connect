import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useLang } from '../../hooks/useLang';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="p-4 bg-emerald-500 text-white flex justify-between items-center shadow">
      <Link to="/" className="font-bold text-xl">Kabadiwala Connect</Link>
      <div className="flex gap-4 items-center">
        <Link to="/rates">Rates</Link>
        <Link to="/schedule">Schedule</Link>
        <button onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</button>
        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}>{lang.toUpperCase()}</button>
        {user ? (
          <>
            <Link to={user.role === 'COLLECTOR' ? '/collector' : '/dashboard'}>Dashboard</Link>
            <button onClick={() => { logout(); nav('/'); }}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-emerald-600 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}