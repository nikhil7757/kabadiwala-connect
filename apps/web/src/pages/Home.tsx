import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroReel } from '../components/common/HeroReel';
import { RateTicker } from '../components/common/RateTicker';
import { StatsStrip } from '../components/common/StatsStrip';
import { HowItWorks } from '../components/common/HowItWorks';
import { ScrapRatesSection } from '../components/common/ScrapRatesSection';
import { CollectorFlipCard } from '../components/common/CollectorFlipCard';
import { ScrollChainStory } from '../components/common/ScrollChainStory';
import { PartnerStrip } from '../components/common/PartnerStrip';
import { StoryCarousel } from '../components/common/StoryCarousel';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { BookingPanel } from '../components/common/BookingPanel';
import { StickyCtaBar } from '../components/common/StickyCtaBar';
import { Container } from '../components/layout/Container';
import { Icon } from '../components/common/Icon';
import { collectors } from '../data/seed';
import { useLang } from '../hooks/useLang';

/**
 * Standardized Home Page (Phase 3 Layout Reconstruction)
 * Clean, consistent section-by-section order:
 * 1. Header (Sticky Glass via Layout)
 * 2. Hero (2 cols desktop, stacked mobile, fluid clamp headline)
 * 3. Rate Ticker (Marquee track)
 * 4. Stats Strip (2x2 on mobile, 4 columns on desktop, count-up)
 * 5. How It Works (3 steps, equal-height cards, decorative connectors)
 * 6. Scrap Rates (Responsive table on desktop, cards on mobile, wrapping filter chips)
 * 7. Verified Collectors (Equal-height cards in a grid)
 * 8. Informal-to-Formal Chain (Horizontal stepper on desktop, vertical on mobile)
 * 9. Accredited Partners & Recyclers Strip (Marquee track)
 * 10. Impact & Ground Stories Carousel
 * 11. FAQ Accordion
 * 12. Direct Booking Console
 * 13. Sticky Action Bar
 * 14. Footer (4-column collapsing to 1 via Layout)
 */
export const Home: React.FC = () => {
  const { lang } = useLang();
  const featuredCollectors = collectors.slice(0, 4);

  return (
    <div className="relative bg-[#0A0B0A] text-[#F5F5F5] min-h-screen overflow-x-clip">
      {/* 1. Hero Section */}
      <HeroReel />

      {/* 2. Live Mandi Rate Ticker Marquee */}
      <RateTicker />

      {/* 3. Stats Strip: 2x2 mobile / 4 desktop */}
      <StatsStrip />

      {/* 4. How It Works: 3 steps, equal-height cards */}
      <HowItWorks />

      {/* 5. Scrap Rates: Responsive table on desktop, cards on mobile */}
      <ScrapRatesSection />

      {/* 6. Verified Collectors: Equal-height grid */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#050605] border-b border-[#1F221F]">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-0.5 bg-[#A3E635]" />
                <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                  04 // VERIFIED OPERATOR NETWORK
                </span>
              </div>
              <h2
                data-qa-check="heading"
                className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
              >
                {lang === 'hi' ? 'प्रमाणित कबाड़ीवाले' : 'GOVT-VERIFIED COLLECTORS'}
              </h2>
              <p className="mt-2 text-sm sm:text-base font-body text-[#6A6E6A]">
                Equipped with legal metrology-certified digital scales and official digital ID passes.
              </p>
            </div>

            <Link
              to="/collectors"
              data-qa-check="button"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-[#A3E635] hover:text-[#bbf451] transition min-h-[44px]"
            >
              <span>{lang === 'hi' ? 'सभी कबाड़ीवाले देखें' : 'EXPLORE DIRECTORY (12+ METROS)'}</span>
              <Icon icon={ArrowRight} size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch min-w-0">
            {featuredCollectors.map((col) => (
              <CollectorFlipCard key={col.id} collector={col} />
            ))}
          </div>
        </Container>
      </section>

      {/* 7. Informal to Formal Chain Story */}
      <ScrollChainStory />

      {/* 8. Partner / Recycler Logo Strip Marquee */}
      <section className="py-12 bg-[#0A0B0A] border-b border-[#1F221F]">
        <Container className="mb-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#6A6E6A] tracking-widest uppercase font-bold">
              ACCREDITED INDUSTRIAL RECYCLING MILLS &amp; MUNICIPAL PARTNERS
            </span>
          </div>
        </Container>
        <PartnerStrip marquee />
      </section>

      {/* 9. Ground Truth Stories Carousel */}
      <StoryCarousel />

      {/* 10. FAQ Accordion */}
      <FaqAccordion />

      {/* 11. Technical Booking Console */}
      <BookingPanel />

      {/* 12. Floating Sticky Bottom Bar (Desktop/Tablet) */}
      <StickyCtaBar />
    </div>
  );
};

export default Home;