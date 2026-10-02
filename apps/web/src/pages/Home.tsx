import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { HeroReel } from '../components/common/HeroReel';
import { RateTicker } from '../components/common/RateTicker';
import { StatsStrip } from '../components/common/StatsStrip';
import { ScrollChainStory } from '../components/common/ScrollChainStory';
import { CollectorFlipCard } from '../components/common/CollectorFlipCard';
import { StoryCarousel } from '../components/common/StoryCarousel';
import { BookingPanel } from '../components/common/BookingPanel';
import { StickyCtaBar } from '../components/common/StickyCtaBar';
import { ratesService } from '../services/ratesService';
import { collectors } from '../data/seed';
import { useLang } from '../hooks/useLang';

export const Home: React.FC = () => {
  const { lang } = useLang();
  const topRates = ratesService.getAll().slice(0, 6);
  const featuredCollectors = collectors.slice(0, 4);

  return (
    <div className="relative bg-[#0A0B0A] text-[#F5F5F5] min-h-screen">
      {/* 1. Cinematic Ken Burns Hero Reel */}
      <HeroReel />

      {/* 2. Live Mandi Rate Ticker Marquee */}
      <RateTicker />

      {/* 3. Count-up Stats Strip */}
      <StatsStrip />

      {/* 4. Pinned Informal to Formal Chain Story */}
      <ScrollChainStory />

      {/* 5. Scrap Rates Preview Section */}
      <section className="py-24 bg-[#0A0B0A] border-b border-[#1F221F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-[#A3E635]" />
                <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                  03 // TRANSPARENT MARKET VALUE
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
                {lang === 'hi' ? 'लाइव स्क्रैप मंडी दरें' : 'LIVE SCRAP MANDI RATES'}
              </h2>
            </div>

            <Link
              to="/rates"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#A3E635] hover:text-[#bbf451] transition"
            >
              <span>{lang === 'hi' ? 'सभी 15 श्रेणियां देखें' : 'VIEW ALL 15 CATEGORIES'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRates.map((item: any) => (
              <div
                key={item.id}
                className="p-6 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-all duration-300 corner-brackets group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl p-3 bg-[#050605] border border-[#1F221F] rounded-sm">
                    {item.icon}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-[#F5F5F5] uppercase group-hover:text-[#A3E635] transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xs font-mono text-[#6A6E6A] uppercase">
                      CATEGORY: {item.category}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-2xl font-black text-[#A3E635]">
                    ₹{item.rate}
                  </div>
                  <div className="text-[11px] text-[#6A6E6A]">PER KG</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/calculator"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] rounded-sm text-xs font-mono font-bold uppercase text-[#F5F5F5] hover:bg-[#1B1E1B] transition"
            >
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <span>ESTIMATE YOUR HOUSEHOLD SCRAP PAYOUT IN 30 SECONDS →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. 3D Flip Card Collectors Section */}
      <section className="py-24 bg-[#050605] border-b border-[#1F221F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-[#A3E635]" />
                <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                  04 // VERIFIED OPERATOR NETWORK
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight">
                {lang === 'hi' ? 'प्रमाणित कबाड़ीवाले' : 'GOVT-VERIFIED COLLECTORS'}
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-mono text-[#6A6E6A]">
                TAP ANY CARD TO REVEAL OFFICIAL DIGITAL ID & SPECIALTIES
              </p>
            </div>

            <Link
              to="/collectors"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#A3E635] hover:text-[#bbf451] transition"
            >
              <span>{lang === 'hi' ? 'सभी कबाड़ीवाले देखें' : 'EXPLORE DIRECTORY (12+ METROS)'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCollectors.map((col) => (
              <CollectorFlipCard key={col.id} collector={col} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Draggable Story Carousel */}
      <StoryCarousel />

      {/* 8. Technical Booking Console */}
      <BookingPanel />

      {/* 9. Floating Sticky Bottom Bar */}
      <StickyCtaBar />
    </div>
  );
};
export default Home;