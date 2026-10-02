import React from 'react';
import { Award, Trophy, Star, Gift, Trees, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLang } from '../hooks/useLang';

export const Rewards: React.FC = () => {
  const { lang } = useLang();

  const leaderboard = [
    { rank: 1, name: 'Priya Sharma', city: 'Mumbai', kg: 420, points: 4200, badge: 'PLATINUM GUARDIAN' },
    { rank: 2, name: 'Rohan Gupta', city: 'Pune', kg: 380, points: 3800, badge: 'GOLD DEFENDER' },
    { rank: 3, name: 'Col. Amit Verma', city: 'Pune', kg: 310, points: 3100, badge: 'COMMUNITY CHAMPION' },
    { rank: 4, name: 'Sunita Rao', city: 'Bengaluru', kg: 260, points: 2600, badge: 'E-WASTE MASTER' },
    { rank: 5, name: 'Deepak Chahar', city: 'Delhi', kg: 215, points: 2150, badge: 'COPPER SPECIALIST' },
  ];

  const badges = [
    { name: '100 KG CHAMPION', desc: 'Diverted 100+ kg from landfills', unlocked: true, icon: Trophy },
    { name: 'E-WASTE DEFENDER', desc: 'Recycled 3+ laptops or motherboards safely', unlocked: true, icon: Award },
    { name: 'COPPER CUSTODIAN', desc: 'Collected 10+ kg pure electrical scrap', unlocked: true, icon: Star },
    { name: 'ZERO LANDFILL HERO', desc: 'Maintained 6 consecutive months active', unlocked: false, icon: Trees },
  ];

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              CITIZEN MOTIVATION // CIRCULAR INCENTIVES
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            {lang === 'hi' ? 'ग्रीन रिवॉर्ड्स व लीडरबोर्ड' : 'REWARDS & LEADERBOARD'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? 'हर किलो स्क्रैप पर ग्रीन पॉइंट्स अर्जित करें और मान्यता प्राप्त बैज अनलॉक करें।'
              : 'Earn Green Citizen points for every scrap kilogram diverted. Redeem for eco-vouchers or urban afforestation drives.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Leaderboard */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1F221F]">
                <h3 className="font-heading text-xl uppercase font-bold text-[#F5F5F5]">
                  NEIGHBORHOOD RECYCLING CHAMPIONS
                </h3>
                <span className="font-mono text-xs text-[#A3E635] font-bold">TOP 5 THIS MONTH</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`p-4 rounded-sm border flex items-center justify-between transition ${
                      user.rank === 1
                        ? 'border-[#A3E635] bg-[#0A0B0A]'
                        : 'border-[#1F221F] bg-[#050605] hover:border-[#6A6E6A]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-sm font-display text-lg font-bold flex items-center justify-center ${
                          user.rank === 1
                            ? 'bg-[#A3E635] text-[#0A0B0A]'
                            : user.rank === 2
                            ? 'bg-[#FFB020] text-[#0A0B0A]'
                            : 'bg-[#141614] text-[#C8C8C8]'
                        }`}
                      >
                        0{user.rank}
                      </div>

                      <div>
                        <div className="font-heading text-base font-bold text-[#F5F5F5] uppercase">
                          {user.name}
                        </div>
                        <span className="text-[#6A6E6A] text-[11px]">
                          {user.city} · <strong className="text-[#A3E635]">{user.badge}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-sm text-[#FFB020]">{user.points} PTS</div>
                      <div className="text-[11px] text-[#6A6E6A]">{user.kg} KG RECYCLED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Badges & Voucher Store */}
          <div className="lg:col-span-5 space-y-6">
            {/* Badges Grid */}
            <div className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-4">
              <h3 className="font-heading text-lg uppercase font-bold text-[#F5F5F5] pb-2 border-b border-[#1F221F]">
                EARNED CITIZEN BADGES
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {badges.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-sm border space-y-2 ${
                        b.unlocked
                          ? 'border-[#A3E635]/60 bg-[#0A0B0A]'
                          : 'border-[#1F221F] bg-[#050605] opacity-40'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${b.unlocked ? 'text-[#A3E635]' : 'text-[#6A6E6A]'}`} />
                      <div className="font-heading text-xs font-bold uppercase text-[#F5F5F5]">
                        {b.name}
                      </div>
                      <p className="text-[10px] font-mono text-[#6A6E6A] leading-tight">
                        {b.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Redemption Store */}
            <div className="p-6 bg-[#050605] border-2 border-[#A3E635] rounded-sm corner-brackets space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F221F]">
                <span className="font-bold text-[#F5F5F5] uppercase">REDEMPTION STORE</span>
                <span className="text-[#FFB020] font-bold">BALANCE: 1,840 PTS</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-[#141614] border border-[#1F221F] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#F5F5F5]">₹100 Amazon Pay / UPI Voucher</div>
                    <div className="text-[10px] text-[#6A6E6A]">Cost: 1,000 Points</div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#A3E635] text-[#0A0B0A] font-bold uppercase rounded-sm">
                    REDEEM
                  </button>
                </div>

                <div className="p-3 bg-[#141614] border border-[#1F221F] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#F5F5F5]">Plant 1 Urban Neem Tree</div>
                    <div className="text-[10px] text-[#6A6E6A]">JNARDDC Green Initiative</div>
                  </div>
                  <button className="px-3 py-1.5 bg-[#A3E635] text-[#0A0B0A] font-bold uppercase rounded-sm">
                    DONATE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Rewards;