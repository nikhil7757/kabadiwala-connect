import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ratesService } from '../services/ratesService';
import { useLang } from '../hooks/useLang';

const t: Record<string, any> = {
  en: {
    heroTitle: "Turn Your Scrap into ₹Cash",
    heroSub: "Fast, reliable, and eco-friendly scrap pickup at your doorstep.",
    btnSchedule: "Schedule Pickup",
    btnRates: "View Rates",
    impact: "Impact So Far",
    recycled: "Recycled",
    testimonials: "Testimonials",
    faq: "FAQ"
  },
  hi: {
    heroTitle: "अपने कबाड़ को ₹कैश में बदलें",
    heroSub: "आपके दरवाजे पर तेज, विश्वसनीय और पर्यावरण के अनुकूल कबाड़ पिकअप।",
    btnSchedule: "पिकअप शेड्यूल करें",
    btnRates: "दरें देखें",
    impact: "अब तक का प्रभाव",
    recycled: "पुनर्नवीनीकरण",
    testimonials: "प्रशंसापत्र",
    faq: "सामान्य प्रश्न"
  }
};

export default function Home() {
  const { lang } = useLang();
  const rates = ratesService.getAll();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setCount(c => c >= 5000 ? 5000 : c + 10);
    }, 10);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center py-20 bg-emerald-50 dark:bg-slate-800 rounded-xl">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500 mb-6">
          {t[lang].heroTitle}
        </h1>
        <p className="text-xl mb-8">{t[lang].heroSub}</p>
        <div className="flex justify-center gap-4">
          <Link to="/schedule"><Button className="text-lg px-8">{t[lang].btnSchedule}</Button></Link>
          <Link to="/rates"><button className="text-lg px-8 py-2 rounded font-bold border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400">{t[lang].btnRates}</button></Link>
        </div>
      </section>

      <section className="bg-emerald-500 text-white p-2 overflow-hidden whitespace-nowrap rounded">
        <div className="animate-[marquee_20s_linear_infinite] inline-block">
          {rates.map((r: any) => (
            <span key={r.id} className="mx-4 font-bold">{r.icon} {r.name}: ₹{r.rate}/kg</span>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
          <div className="text-4xl mb-4">📍</div>
          <h3 className="text-xl font-bold mb-2">1. Schedule</h3>
          <p>Book a pickup at your convenience.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-4">⚖️</div>
          <h3 className="text-xl font-bold mb-2">2. Weigh</h3>
          <p>We weigh your scrap accurately.</p>
        </Card>
        <Card>
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold mb-2">3. Get Paid</h3>
          <p>Instant cash or digital payment.</p>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">{t[lang].impact}</h2>
        <div className="text-5xl font-extrabold text-emerald-500">{count.toLocaleString()}+ kg</div>
        <p className="text-lg">{t[lang].recycled}</p>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">{t[lang].testimonials}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {['Priya S.', 'Rahul M.', 'Anita D.'].map(name => (
            <Card key={name} className="italic">"{name} says it's the best scrap service!"</Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">{t[lang].faq}</h2>
        <div className="space-y-4 max-w-2xl mx-auto">
          <details className="p-4 bg-white dark:bg-slate-800 rounded shadow"><summary className="font-bold cursor-pointer">What items do you collect?</summary><p className="mt-2">Paper, plastic, metal, e-waste, and more.</p></details>
          <details className="p-4 bg-white dark:bg-slate-800 rounded shadow"><summary className="font-bold cursor-pointer">Is there a minimum weight?</summary><p className="mt-2">Yes, at least 10kg for free pickup.</p></details>
        </div>
      </section>
    </div>
  );
}