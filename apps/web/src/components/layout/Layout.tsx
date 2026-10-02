import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FilmGrain } from '../common/FilmGrain';
import { CommandPalette } from '../common/CommandPalette';

export const Layout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0B0A] text-[#F5F5F5] selection:bg-[#A3E635] selection:text-[#0A0B0A] transition-colors relative">
      {/* 1. Lerped Drifting Film-Grain Overlay */}
      <FilmGrain />

      {/* 2. Global Command Palette (Ctrl/Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* 3. Fixed Glass Navbar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* 4. Full-Width Responsive Main Body */}
      <main className="flex-1 w-full pt-18 pb-16 sm:pb-0">
        <Outlet />
      </main>

      {/* 5. Giant Monolith Outlined Footer */}
      <Footer />
    </div>
  );
};
export default Layout;