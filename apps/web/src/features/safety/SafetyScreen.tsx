import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Tv,
  BatteryCharging,
  Droplets,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { TopBar } from '../../components/common/TopBar.js';
import { FlipCard } from '../../components/common/FlipCard.js';

interface SafetyTipItem {
  code: string;
  title: string;
  body: string;
  icon: React.ReactNode;
  audioKey: string;
}

const SAFETY_TIPS: SafetyTipItem[] = [
  {
    code: 'burning',
    title: 'No Burning (केबल न जलाएँ)',
    body: 'Never burn cables. The smoke is poisonous. Sell whole cables to an authorized buyer for better profit.',
    icon: <Flame className="w-8 h-8 text-kc-danger stroke-[2.2]" />,
    audioKey: 'safety_burning',
  },
  {
    code: 'crt',
    title: 'Do Not Break CRT (CRT न तोड़ें)',
    body: 'Never break old TV or monitor glass. The vacuum tube can implode violently and spray toxic lead glass.',
    icon: <Tv className="w-8 h-8 text-kc-danger stroke-[2.2]" />,
    audioKey: 'safety_crt',
  },
  {
    code: 'battery',
    title: 'Safe Batteries (बैटरी संभालें)',
    body: 'Keep lithium and lead batteries dry and apart. Never puncture, press or throw in fire. Fire hazard!',
    icon: <BatteryCharging className="w-8 h-8 text-kc-warn stroke-[2.2]" />,
    audioKey: 'safety_battery',
  },
  {
    code: 'acid',
    title: 'No Acid Bath (एसिड न डालें)',
    body: 'Never pour acid on PCBs or motherboards. Acid creates dangerous fumes and destroys recoverable trace metals.',
    icon: <Droplets className="w-8 h-8 text-kc-danger stroke-[2.2]" />,
    audioKey: 'safety_acid',
  },
  {
    code: 'gloves',
    title: 'Wear Gloves (दस्ताने पहनें)',
    body: 'Always wear thick safety gloves when handling broken metal casings. Wash hands thoroughly with soap before eating.',
    icon: <ShieldCheck className="w-8 h-8 text-kc-success stroke-[2.2]" />,
    audioKey: 'safety_gloves',
  },
  {
    code: 'children',
    title: 'Keep Children Away (बच्चों से दूर)',
    body: 'Keep scrap collection bags away from children and domestic pets. Store heavy electronic scrap in secure crates.',
    icon: <Users className="w-8 h-8 text-kc-ink-dim stroke-[2.2]" />,
    audioKey: 'safety_children',
  },
];

export const SafetyScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-kc-bg text-kc-ink flex flex-col pb-12">
      <TopBar title={t('home_safety')} />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-3 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-kc-ink mb-1">
            6 Vital Safety Rules
          </h2>
          <p className="text-xs text-kc-ink-dim">
            Tap any card to flip and read handling instructions. Tap the speaker icon to listen in your language.
          </p>
        </div>

        {/* 2-Column FlipCard Grid */}
        <div className="grid grid-cols-2 gap-3">
          {SAFETY_TIPS.map((tip) => (
            <FlipCard
              key={tip.code}
              title={tip.title}
              body={tip.body}
              icon={tip.icon}
              audioKey={tip.audioKey}
            />
          ))}
        </div>
      </main>
    </div>
  );
};
