import React, { useState } from 'react';
import { Search, MapPin, Grid, Map as MapIcon } from 'lucide-react';
import { collectors, cities } from '../data/seed';
import { CollectorFlipCard } from '../components/common/CollectorFlipCard';
import { useLang } from '../hooks/useLang';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';

export const FindCollectors: React.FC = () => {
  const { lang } = useLang();
  const [selectedCity, setSelectedCity] = useState('all');
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const filtered = collectors.filter((col) => {
    const matchesCity = selectedCity === 'all' || col.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch =
      col.name.toLowerCase().includes(search.toLowerCase()) ||
      col.city.toLowerCase().includes(search.toLowerCase()) ||
      col.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchesRating = col.rating >= minRating;
    return matchesCity && matchesSearch && matchesRating;
  });

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              VERIFIED DIRECTORY // INFORMAL NETWORK
            </span>
          </div>
          <h1
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-[#F5F5F5] uppercase tracking-tight"
          >
            {lang === 'hi' ? 'प्रमाणित कबाड़ीवाले खोजें' : 'FIND VERIFIED COLLECTORS'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? '12 से अधिक शहरों में सरकार द्वारा डिजिटल पहचान प्रमाणित कबाड़ीवाले।'
              : 'ID-verified informal operators equipped with certified digital scales and direct UPI integration.'}
          </p>
        </div>

        {/* Filters and View Switcher */}
        <div
          data-qa-check="card"
          className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets mb-10 space-y-4 min-w-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Search Input */}
            <div className="relative">
              <Icon icon={Search} size={16} className="absolute left-3 top-3.5 text-[#6A6E6A]" />
              <input
                type="text"
                placeholder="Search collector name or scrap..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-h-[44px] pl-9 pr-4 py-2 bg-[#050605] border border-[#1F221F] focus:border-[#A3E635] font-mono text-xs text-[#F5F5F5] rounded-sm outline-none"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] text-[#F5F5F5] font-mono text-xs py-2 px-3 outline-none focus:border-[#A3E635] rounded-sm"
              >
                <option value="all">All Metro Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Min Rating Filter */}
            <div>
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full min-h-[44px] bg-[#050605] border border-[#1F221F] text-[#F5F5F5] font-mono text-xs py-2 px-3 outline-none focus:border-[#A3E635] rounded-sm"
              >
                <option value={0}>All Ratings</option>
                <option value={4.0}>4.0★ &amp; above</option>
                <option value={4.5}>4.5★ &amp; above</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-end gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                data-qa-check="button"
                className={`min-h-[44px] px-3.5 py-2 border rounded-sm flex items-center gap-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] font-bold'
                    : 'bg-[#050605] text-[#C8C8C8] border-[#1F221F]'
                }`}
              >
                <Icon icon={Grid} size={16} />
                <span>GRID</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                data-qa-check="button"
                className={`min-h-[44px] px-3.5 py-2 border rounded-sm flex items-center gap-1.5 transition ${
                  viewMode === 'map'
                    ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635] font-bold'
                    : 'bg-[#050605] text-[#C8C8C8] border-[#1F221F]'
                }`}
              >
                <Icon icon={MapIcon} size={16} />
                <span>MAP</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode: Grid (Equal-Height Collector Cards) */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch min-w-0">
            {filtered.map((col) => (
              <CollectorFlipCard key={col.id} collector={col} />
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center font-mono text-xs text-[#6A6E6A] bg-[#141614] border border-[#1F221F] p-8">
                NO VERIFIED OPERATORS FOUND MATCHING YOUR CRITERIA.
              </div>
            )}
          </div>
        ) : (
          /* View Mode: Interactive Simulated Radar / Map View */
          <div className="relative h-[480px] sm:h-[550px] bg-[#050605] border-2 border-[#1F221F] rounded-sm overflow-hidden corner-brackets scanline shadow-2xl min-w-0">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #1F221F 1px, transparent 1px), linear-gradient(to bottom, #1F221F 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-[#0A0B0A]/90 border border-[#1F221F] font-mono text-xs text-[#A3E635] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-ping" />
              <span>{filtered.length} ACTIVE KABADIWALAS PINNED ACROSS METRO ZONES</span>
            </div>

            {filtered.map((col, i) => {
              const xPos = 12 + ((i * 27) % 78);
              const yPos = 15 + ((i * 39) % 70);

              return (
                <div
                  key={col.id}
                  style={{ left: `${xPos}%`, top: `${yPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-[#141614] border-2 border-[#A3E635] flex items-center justify-center text-[#A3E635] font-bold font-mono text-xs shadow-[0_0_15px_rgba(163,230,53,0.5)] group-hover:scale-125 transition-transform min-h-[36px] min-w-[36px]">
                    {col.name[0]}
                  </div>

                  <div className="hidden group-hover:block absolute bottom-10 left-1/2 -translate-x-1/2 w-48 p-3 bg-[#0A0B0A] border border-[#A3E635] rounded-sm text-xs font-mono shadow-2xl z-20 pointer-events-none">
                    <div className="font-bold text-[#F5F5F5]">{col.name}</div>
                    <div className="text-[#A3E635]">{col.city} · {col.rating}★</div>
                    <div className="text-[10px] text-[#6A6E6A] mt-1">Tap card to book</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
};

export default FindCollectors;