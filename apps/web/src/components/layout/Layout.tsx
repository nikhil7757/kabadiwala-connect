import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { FilmGrain } from '../common/FilmGrain';
import { CommandPalette } from '../common/CommandPalette';

/**
 * Standardized Shell Layout (Phase 1 Foundation)
 * - Safe area padding matching --header-h and --bottom-nav-h
 * - Zero overlap between fixed elements and page content
 * - min-w-0 on main container to prevent flex child overflow
 */
export const Layout: React.FC = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0B0A] text-[#F5F5F5] selection:bg-[#A3E635] selection:text-[#0A0B0A] transition-colors relative overflow-x-clip">
      {/* 1. Subtle Drifting Film-Grain Overlay */}
      <FilmGrain />

      {/* 2. Global Command Palette (Ctrl/Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* 3. Fixed Glass Navbar */}
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      {/* 4. Full-Width Responsive Main Body with safe-area spacing */}
      <main className="flex-1 w-full pt-[var(--header-h,72px)] pb-[calc(var(--bottom-nav-h,64px)+env(safe-area-inset-bottom,0px))] sm:pb-0 min-w-0">
        <Outlet />
      </main>

      {/* 5. Giant Monolith Outlined Footer */}
      <Footer />
    </div>
  );
};

export default Layout;