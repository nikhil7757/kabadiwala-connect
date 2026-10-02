import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ratesService } from '../services/ratesService';
import { useLang } from '../hooks/useLang';

const t: Record<string, any> = {
  en: {
    heroTitle: "Turn Your Scrap into ₹Cash",
    heroSub: "Fast, reliable, and eco-friendly scrap pickup at your doorstep. Over 5,000 happy households served.",
    btnSchedule: "Schedule Pickup",
    btnRates: "View Rates",
    howTitle: "How It Works",
    step1Title: "Book a Pickup",
    step1Desc: "Choose your scrap items, enter your address, and pick a convenient time slot.",
    step2Title: "We Come to You",
    step2Desc: "A verified kabadiwala arrives at your doorstep and weighs your scrap on the spot.",
    step3Title: "Get Paid Instantly",
    step3Desc: "Receive cash or UPI payment immediately at transparent, market-rate prices.",
    impactTitle: "Our Impact So Far",
    kgRecycled: "kg Recycled",
    co2Saved: "tonnes CO₂ Saved",
    pickupsDone: "Pickups Completed",
    testimonialTitle: "What Our Users Say",
    faqTitle: "Frequently Asked Questions",
  },
  hi: {
    heroTitle: "अपने कबाड़ को ₹कैश में बदलें",
    heroSub: "आपके दरवाजे पर तेज, विश्वसनीय और पर्यावरण के अनुकूल कबाड़ पिकअप। 5,000+ खुश परिवार।",
    btnSchedule: "पिकअप शेड्यूल करें",
    btnRates: "दरें देखें",
    howTitle: "यह कैसे काम करता है",
    step1Title: "पिकअप बुक करें",
    step1Desc: "अपना सामान चुनें, पता दर्ज करें और सुविधाजनक समय चुनें।",
    step2Title: "हम आपके पास आते हैं",
    step2Desc: "एक सत्यापित कबाड़ीवाला आपके दरवाजे पर आकर तौलता है।",
    step3Title: "तुरंत भुगतान पाएं",
    step3Desc: "नकद या UPI से तुरंत भुगतान — पारदर्शी बाजार दरों पर।",
    impactTitle: "हमारा प्रभाव",
    kgRecycled: "किग्रा पुनर्नवीनीकरण",
    co2Saved: "टन CO₂ बचाया",
    pickupsDone: "पिकअप पूरे",
    testimonialTitle: "उपयोगकर्ता क्या कहते हैं",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
  }
};

const testimonials = [
  { name: 'Priya Sharma', city: 'Mumbai', text: 'Collected Rs.1,200 from old newspapers and plastic bottles in one pickup! Super convenient.' },
  { name: 'Rahul Mehta', city: 'Pune', text: 'The collector arrived on time and weighed everything transparently. No bargaining needed.' },
  { name: 'Anita Desai', city: 'Bangalore', text: 'Finally a reliable scrap service. Booked from the app, collector came same day. 10/10.' },
];

const faqs = [
  { q: 'What items do you collect?', a: 'We collect paper, cardboard, plastic (PET & HDPE), metals (copper, iron, aluminium), e-waste (laptops, mobiles, CRT monitors), and glass bottles.' },
  { q: 'Is there a minimum pickup weight?', a: 'Yes, a minimum of 5 kg total is required for a free doorstep pickup in metro cities.' },
  { q: 'How is the weight measured?', a: 'Our collectors use calibrated digital scales. You can watch the weighing process live — full transparency guaranteed.' },
  { q: 'How do I get paid?', a: 'You can receive cash, or UPI / Paytm / GPay payment instantly after weighing.' },
  { q: 'Are the collectors verified?', a: 'Yes. Every collector on our platform is ID-verified, trained, and rated by users. Only collectors with 3.5+ rating are shown.' },
  { q: 'Can I reschedule or cancel a pickup?', a: 'Yes, you can reschedule or cancel up to 2 hours before the scheduled time from your dashboard.' },
];

function useCounter(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      setValue(v => {
        const next = v + step;
        if (next >= target) { clearInterval(timer); return target; }
        return next;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return Math.floor(value);
}

export default function Home() {
  const { lang } = useLang();
  const rates = ratesService.getAll();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const kg = useCounter(52340);
  const co2 = useCounter(26);
  const pickups = useCounter(3180);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-2xl">
        <div className="inline-block bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          🌱 Eco-Friendly Scrap Collection
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500 mb-6 leading-tight">
          {t[lang].heroTitle}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
          {t[lang].heroSub}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/schedule">
            <Button className="text-lg px-8 py-3 shadow-lg shadow-emerald-200 dark:shadow-emerald-900">
              {t[lang].btnSchedule}
            </Button>
          </Link>
          <Link to="/rates">
            <button className="text-lg px-8 py-3 rounded-xl font-bold border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition">
              {t[lang].btnRates}
            </button>
          </Link>
        </div>
      </section>

      {/* Rate Ticker */}
      <section className="bg-emerald-500 text-white p-3 overflow-hidden whitespace-nowrap rounded-xl shadow-md">
        <div style={{ display: 'inline-flex', animation: 'marquee 30s linear infinite' }}>
          {[...rates, ...rates].map((r: any, i: number) => (
            <span key={i} className="mx-6 font-bold text-sm">
              {r.icon} {r.name}: <span className="text-emerald-100">Rs.{r.rate}/kg</span>
            </span>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">{t[lang].howTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📅', num: '1', title: t[lang].step1Title, desc: t[lang].step1Desc },
            { icon: '⚖️', num: '2', title: t[lang].step2Title, desc: t[lang].step2Desc },
            { icon: '💰', num: '3', title: t[lang].step3Title, desc: t[lang].step3Desc },
          ].map((step) => (
            <Card key={step.num} className="text-center p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-2xl mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-emerald-700 dark:text-emerald-400">
                {step.num}. {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Impact Counters */}
      <section className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-10">{t[lang].impactTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-5xl font-extrabold">{kg.toLocaleString()}+</div>
            <div className="mt-2 text-emerald-100 font-medium">{t[lang].kgRecycled}</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold">{co2}+</div>
            <div className="mt-2 text-emerald-100 font-medium">{t[lang].co2Saved}</div>
          </div>
          <div>
            <div className="text-5xl font-extrabold">{pickups.toLocaleString()}+</div>
            <div className="mt-2 text-emerald-100 font-medium">{t[lang].pickupsDone}</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">{t[lang].testimonialTitle}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(({ name, city, text }) => (
            <Card key={name} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-amber-400 text-xl mb-3">★★★★★</div>
              <p className="text-slate-600 dark:text-slate-300 italic mb-4">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-700 font-bold text-lg">
                  {name[0]}
                </div>
                <div>
                  <div className="font-bold text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{city}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">{t[lang].faqTitle}</h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
            >
              <button
                className="w-full text-left px-6 py-4 font-semibold flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{faq.q}</span>
                <span className="text-emerald-500 text-xl ml-4">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-slate-600 dark:text-slate-300">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}