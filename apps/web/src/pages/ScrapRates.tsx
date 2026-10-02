import React, { useState } from 'react';
import { Search, TrendingUp, ArrowUpRight, Scale, Filter } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ratesService } from '../services/ratesService';
import { useLang } from '../hooks/useLang';

export const ScrapRates: React.FC = () => {
  const { lang } = useLang();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState('6'); // Default Copper

  const allRates = ratesService.getAll();
  const trendData = ratesService.getTrends(selectedItem);

  const categories = ['all', 'metal', 'e-waste', 'plastic', 'paper', 'glass'];

  const filtered = allRates.filter((item: any) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeItemData = allRates.find((r: any) => r.id === selectedItem) || allRates[0];

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              OFFICIAL MANDI RATES // LIVE BENCHMARK
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            {lang === 'hi' ? 'दैनिक स्क्रैप दरें' : 'DAILY SCRAP RATES'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? 'राष्ट्रीय धातु और पुनर्चक्रण मंडियों के अनुसार प्रमाणित दरें। कोई छिपी कटौती नहीं।'
              : 'Indexed to the Ministry of Mines & national commodity recycling exchanges. Zero hidden deductions.'}
          </p>
        </div>

        {/* 7-Day Trend Chart Showcase */}
        <div className="mb-12 bg-[#141614] border border-[#1F221F] p-6 sm:p-8 corner-brackets">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F221F] gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#A3E635] mb-1 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>7-DAY HISTORICAL PRICE INDEX</span>
              </div>
              <h3 className="font-heading text-2xl font-bold uppercase text-[#F5F5F5]">
                {activeItemData.name} — ₹{activeItemData.rate}/KG
              </h3>
            </div>
            <div className="text-right font-mono text-xs text-[#6A6E6A]">
              <span>MARKET VARIANCE: </span>
              <span className="text-[#A3E635] font-bold">+4.2% THIS WEEK</span>
            </div>
          </div>

          <div className="h-64 sm:h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="limeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3E635" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#6A6E6A" tick={{ fontSize: 12, fill: '#6A6E6A' }} />
                <YAxis stroke="#6A6E6A" tick={{ fontSize: 12, fill: '#6A6E6A' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A0B0A',
                    borderColor: '#1F221F',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    color: '#F5F5F5',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#A3E635"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#limeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider rounded-sm border transition-all ${
                  selectedCategory === c
                    ? 'bg-[#A3E635] text-[#0A0B0A] border-[#A3E635]'
                    : 'bg-[#141614] text-[#C8C8C8] border-[#1F221F] hover:border-[#6A6E6A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-[#6A6E6A]" />
            <input
              type="text"
              placeholder="Search 15 materials..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[#141614] border border-[#1F221F] focus:border-[#A3E635] font-mono text-xs text-[#F5F5F5] rounded-sm outline-none"
            />
          </div>
        </div>

        {/* Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item: any) => {
            const isSelected = selectedItem === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                className={`p-6 bg-[#141614] border rounded-sm cursor-pointer transition-all corner-brackets flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#A3E635] shadow-[0_0_15px_rgba(163,230,53,0.2)]'
                    : 'border-[#1F221F] hover:border-[#6A6E6A]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-[#050605] border border-[#1F221F] rounded-sm">
                      {item.icon}
                    </span>
                    <div>
                      <h4 className="font-heading text-lg font-bold text-[#F5F5F5] uppercase">
                        {item.name}
                      </h4>
                      <span className="text-xs font-mono text-[#6A6E6A] uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#A3E635] flex items-center">
                    LIVE
                    <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1F221F] flex items-end justify-between font-mono">
                  <div>
                    <span className="text-[10px] text-[#6A6E6A] block">DOORSTEP RATE:</span>
                    <span className="text-3xl font-black text-[#A3E635]">₹{item.rate}</span>
                    <span className="text-xs text-[#6A6E6A]"> / KG</span>
                  </div>
                  <button className="px-3 py-1 bg-[#050605] border border-[#1F221F] hover:border-[#A3E635] text-[11px] text-[#C8C8C8] uppercase font-bold rounded-sm">
                    {isSelected ? 'VIEWING TREND' : 'VIEW TREND'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ScrapRates;