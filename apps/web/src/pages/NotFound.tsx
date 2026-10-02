import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FF6B5E]/10 border-2 border-[#FF6B5E] text-[#FF6B5E] flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="font-display text-8xl text-stroke text-[#F5F5F5]">404</div>

        <h2 className="font-heading text-2xl uppercase font-bold text-[#F5F5F5]">
          PAGE LOST IN URBAN TRANSIT
        </h2>

        <p className="font-mono text-xs text-[#6A6E6A]">
          The scrap route or digital lot manifest you requested does not exist on this server.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#A3E635] text-[#0A0B0A] font-heading text-base font-bold uppercase rounded-sm glow-lime hover:bg-[#bbf451] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO HOME BASE</span>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;