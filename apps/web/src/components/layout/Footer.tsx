import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">KC</span>
            <span className="font-bold text-white">Kabadiwala Connect</span>
          </div>
          <p className="text-sm text-slate-400">Connecting households with verified scrap collectors across India. Transparent rates, doorstep pickup.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white mb-3">Services</h4>
          <div className="space-y-2 text-sm">
            <Link to="/schedule" className="block hover:text-emerald-400 transition">Schedule Pickup</Link>
            <Link to="/rates" className="block hover:text-emerald-400 transition">Scrap Rates</Link>
            <Link to="/calculator" className="block hover:text-emerald-400 transition">Rate Calculator</Link>
            <Link to="/track" className="block hover:text-emerald-400 transition">Track Pickup</Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h4 className="font-bold text-white mb-3">Account</h4>
          <div className="space-y-2 text-sm">
            <Link to="/login" className="block hover:text-emerald-400 transition">Login / Sign Up</Link>
            <Link to="/dashboard" className="block hover:text-emerald-400 transition">User Dashboard</Link>
            <Link to="/collector" className="block hover:text-emerald-400 transition">Collector Dashboard</Link>
            <Link to="/rewards" className="block hover:text-emerald-400 transition">Rewards & Impact</Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold text-white mb-3">Company</h4>
          <div className="space-y-2 text-sm">
            <Link to="/about" className="block hover:text-emerald-400 transition">About Us</Link>
            <Link to="/contact" className="block hover:text-emerald-400 transition">Contact</Link>
            <Link to="/privacy" className="block hover:text-emerald-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-emerald-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 max-w-7xl mx-auto">
        <span>&copy; 2026 Kabadiwala Connect. All rights reserved.</span>
        <span>🌱 Helping India recycle better, one pickup at a time.</span>
      </div>
    </footer>
  );
}