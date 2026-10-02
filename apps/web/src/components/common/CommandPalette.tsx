import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  TrendingUp,
  Truck,
  Calculator,
  Award,
  Layers,
  Sparkles,
  X,
  Compass,
} from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { useTheme } from '../../hooks/useTheme';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Schedule Instant Pickup', desc: 'Dispatch local verified kabadiwala', path: '/book', icon: Sparkles },
    { title: 'Check Live Scrap Mandi Rates', desc: 'Browse ₹/kg rates across 15 categories', path: '/rates', icon: TrendingUp },
    { title: 'Smart Payout Calculator', desc: 'Calculate scrap value & environmental offset', path: '/calculator', icon: Calculator },
    { title: 'GPS Live Pickup Tracker', desc: 'View moving dispatch map pin & status timeline', path: '/track', icon: Truck },
    { title: 'Verified Collectors Directory', desc: '3D digital ID cards & verified operator network', path: '/collectors', icon: Compass },
    { title: 'Household Citizen Portal', desc: 'Pickups, earnings & carbon savings report', path: '/dashboard', icon: Layers },
    { title: 'Collector Terminal', desc: 'Accept requests & complete on-the-spot weighing', path: '/collector', icon: Truck },
    { title: 'Recycler Batch Traceability', desc: 'Verify incoming purity logs & lot manifests', path: '/recycler', icon: Layers },
    { title: 'Municipality Governance Audit', desc: 'Ward-wise volume & landfill diversion', path: '/municipality', icon: Award },
    { title: 'Green Rewards & Leaderboard', desc: 'Redeem eco-points & earn sustainability badges', path: '/rewards', icon: Award },
    { title: 'Segregation & Recycling Guide', desc: 'Learn hazardous sorting + take 5-question quiz', path: '/learn', icon: Compass },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.desc.toLowerCase().includes(query.toLowerCase())
  );

  const runAction = (path?: string, customFn?: () => void) => {
    onClose();
    if (customFn) customFn();
    else if (path) navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#0A0B0A] border-2 border-[#A3E635] shadow-[0_0_50px_rgba(163,230,53,0.25)] rounded-sm overflow-hidden corner-brackets"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1F221F] bg-[#141614]">
          <Search className="w-5 h-5 text-[#A3E635]" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to page... (e.g. rates, book, tracker)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F5F5F5] font-mono text-sm outline-none placeholder:text-[#6A6E6A]"
          />
          <button onClick={onClose} className="text-[#6A6E6A] hover:text-[#F5F5F5]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.map((action, i) => {
            const Icon = action.icon;
            return (
              <div
                key={i}
                onClick={() => runAction(action.path)}
                className="p-3 rounded-sm hover:bg-[#141614] flex items-center justify-between cursor-pointer group transition-colors border border-transparent hover:border-[#1F221F]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#050605] border border-[#1F221F] group-hover:border-[#A3E635] flex items-center justify-center text-[#A3E635]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading text-sm uppercase text-[#F5F5F5] group-hover:text-[#A3E635] font-bold">
                      {action.title}
                    </div>
                    <div className="font-mono text-xs text-[#6A6E6A]">{action.desc}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6A6E6A] group-hover:text-[#A3E635] group-hover:translate-x-1 transition-transform" />
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center font-mono text-xs text-[#6A6E6A]">
              NO MATCHING COMMANDS FOUND FOR "{query}".
            </div>
          )}
        </div>

        {/* Quick Footer Shortcut Keys */}
        <div className="px-4 py-2.5 bg-[#050605] border-t border-[#1F221F] flex items-center justify-between text-[11px] font-mono text-[#6A6E6A]">
          <div className="flex items-center gap-3">
            <span>[ESC] TO EXIT</span>
            <span>[ENTER] TO SELECT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => runAction(undefined, () => setLang(lang === 'en' ? 'hi' : 'en'))}
              className="text-[#A3E635] hover:underline"
            >
              TOGGLE HINDI ({lang.toUpperCase()})
            </button>
            <span>·</span>
            <button
              onClick={() => runAction(undefined, toggleTheme)}
              className="text-[#A3E635] hover:underline"
            >
              TOGGLE THEME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
