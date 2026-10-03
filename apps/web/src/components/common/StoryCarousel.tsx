import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

const STORIES = [
  {
    id: 1,
    name: 'Priya Sharma',
    city: 'Bandra, Mumbai',
    role: 'Household Citizen',
    quote:
      'We had 3 cartons of old textbooks and broken electronics. Booked Rajesh through Kabadiwala Connect — he arrived in 35 mins with a certified digital scale. ₹1,420 credited directly to GPay in 60 seconds. Flawless service.',
    rating: 5,
    scrapType: '24 KG COPPER & PAPER',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    city: 'Dharavi, Mumbai',
    role: 'Informal Collector (12 yrs in field)',
    quote:
      'Before Kabadiwala Connect, I spent hours shouting on the road burning fuel. Now I receive direct doorstep requests with verified weights on my mobile. My monthly earnings jumped from ₹18,000 to ₹34,000.',
    rating: 5,
    scrapType: 'TOP 5% RECOVERY OPERATOR',
    avatar: 'RK',
  },
  {
    id: 3,
    name: 'Col. Amit Verma (Retd.)',
    city: 'Kalyani Nagar, Pune',
    role: 'RWA President (420 Apartments)',
    quote:
      'Our residential society implemented Kabadiwala Connect across all 6 towers. Every Saturday pickup is tracked with QR traceability. We have diverted over 8.4 tonnes from PMC landfills in 3 months.',
    rating: 5,
    scrapType: 'COMMUNITY HOUSING PARTNER',
    avatar: 'AV',
  },
  {
    id: 4,
    name: 'Sunita Rao',
    city: 'Indiranagar, Bengaluru',
    role: 'Tech Consultant',
    quote:
      'The e-waste transparency is what impressed me. Usually, old laptop batteries and cables end up burnt in toxic backyards. Here, the digital batch tracked my old Dell motherboard straight to a licensed recycler.',
    rating: 5,
    scrapType: 'E-WASTE DIVERSION',
    avatar: 'SR',
  },
];

/**
 * Standardized Ground Stories / Testimonials Section (Phase 3 Component)
 * - Safe layout without negative margins or z-index collisions
 * - Accessible 44px carousel controls
 * - Inside standardized <Container>
 */
export const StoryCarousel: React.FC = () => {
  const { lang } = useLang();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STORIES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section
      className="py-12 sm:py-16 lg:py-24 bg-[#050605] border-b border-[#1F221F]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-0.5 bg-[#A3E635]" />
              <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
                05 // PROVEN GROUND IMPACT
              </span>
            </div>
            <h2
              data-qa-check="heading"
              className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
            >
              {lang === 'hi' ? 'नागरिकों और कबाड़ियों के अनुभव' : 'GROUND TRUTH STORIES'}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#6A6E6A] font-body max-w-xl">
              Real voices from citizens, informal operators, and housing societies.
            </p>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIdx((p) => (p === 0 ? STORIES.length - 1 : p - 1))}
              aria-label="Previous story"
              data-qa-check="button"
              className="w-12 h-12 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] rounded-sm flex items-center justify-center transition min-h-[44px] min-w-[44px]"
            >
              <Icon icon={ChevronLeft} size={20} />
            </button>
            <button
              onClick={() => setActiveIdx((p) => (p + 1) % STORIES.length)}
              aria-label="Next story"
              data-qa-check="button"
              className="w-12 h-12 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635] text-[#F5F5F5] rounded-sm flex items-center justify-center transition min-h-[44px] min-w-[44px]"
            >
              <Icon icon={ChevronRight} size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
          >
            {STORIES.map((story) => (
              <div key={story.id} className="w-full shrink-0 px-1">
                <div
                  data-qa-check="card"
                  className="p-6 sm:p-10 bg-[#141614] border border-[#1F221F] hover:border-[#A3E635]/60 transition-colors corner-brackets space-y-6"
                >
                  {/* Top Bar with rating & badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1 text-[#FFB020]">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Icon key={i} icon={Star} size={16} className="fill-[#FFB020] text-[#FFB020]" />
                      ))}
                    </div>
                    <span
                      data-qa-check="badge"
                      className="px-2.5 py-1 bg-[#050605] border border-[#1F221F] text-xs font-mono text-[#A3E635] rounded-sm"
                    >
                      {story.scrapType}
                    </span>
                  </div>

                  {/* Quote Body */}
                  <div className="relative">
                    <p className="text-base sm:text-xl text-[#F5F5F5] font-body leading-relaxed italic">
                      "{story.quote}"
                    </p>
                  </div>

                  {/* Author Persona */}
                  <div className="flex items-center gap-4 pt-4 border-t border-[#1F221F]">
                    <div
                      data-qa-check="avatar"
                      className="w-12 h-12 rounded-sm bg-[#050605] border border-[#1F221F] flex items-center justify-center font-display text-lg text-[#A3E635] font-bold shrink-0 aspect-square"
                    >
                      {story.avatar}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-heading text-base sm:text-lg font-bold text-[#F5F5F5] uppercase truncate">
                        {story.name}
                      </h4>
                      <p className="text-xs font-mono text-[#6A6E6A] truncate">
                        {story.role} · <span className="text-[#C8C8C8]">{story.city}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {STORIES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeIdx === i ? 'w-8 bg-[#A3E635]' : 'w-2 bg-[#1F221F] hover:bg-[#6A6E6A]'
              }`}
              aria-label={`Jump to story ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default StoryCarousel;
