import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="p-8 bg-slate-900 text-slate-300 text-center">
      <div className="flex justify-center gap-4 mb-4">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
      </div>
      <p>&copy; 2026 Kabadiwala Connect. All rights reserved.</p>
    </footer>
  );
}