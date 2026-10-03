import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLang } from '../../hooks/useLang';
import { Container } from '../layout/Container';
import { Icon } from './Icon';

interface FaqItem {
  id: string;
  q: string;
  qHi: string;
  a: string;
  aHi: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'scales',
    q: 'How do I know the weighing scale is accurate?',
    qHi: 'मुझे कैसे पता चलेगा कि तराजू सटीक है?',
    a: 'Every certified collector uses a Bluetooth-enabled digital scale calibrated according to government Legal Metrology standards. Weight readings sync directly to your mobile screen in real time before confirmation.',
    aHi: 'प्रत्येक प्रमाणित कबाड़ीवाला सरकारी मानकों के अनुसार कैलिब्रेटेड डिजिटल तराजू का उपयोग करता है। पुष्टि से पहले वजन सीधे आपके मोबाइल स्क्रीन पर सिंक होता है।',
  },
  {
    id: 'payment',
    q: 'How does payment work? Are there deductions?',
    qHi: 'भुगतान कैसे होता है? क्या कोई कटौती है?',
    a: 'Zero deductions. You receive 100% of the benchmark rate for your scrap weight. Payment is made instantly at your doorstep via UPI (GPay, PhonePe, Paytm) or cash.',
    aHi: 'शून्य कटौती। आपको अपने वजन के अनुसार पूरी दर मिलती है। भुगतान आपके दरवाजे पर तुरंत UPI या नकद के माध्यम से किया जाता है।',
  },
  {
    id: 'verification',
    q: 'Who are the collectors? Is it safe for households?',
    qHi: 'कबाड़ीवाले कौन हैं? क्या यह घरों के लिए सुरक्षित है?',
    a: 'All collectors in our directory are government ID-verified, police-checked informal operators issued official QR passes under the Ministry of Mines initiative. You can view their full credentials before dispatch.',
    aHi: 'हमारी डायरेक्टरी के सभी कबाड़ीवाले सरकारी पहचान सत्यापित हैं और उन्हें आधिकारिक डिजिटल पास जारी किए गए हैं। आप बुकिंग से पहले उनका विवरण देख सकते हैं।',
  },
  {
    id: 'traceability',
    q: 'Where does my scrap go after doorstep pickup?',
    qHi: 'पिकअप के बाद मेरा कबाड़ कहां जाता है?',
    a: 'Scrap is sorted at local micro-hubs, assigned a cryptographic batch QR code, and routed directly to JNARDDC-accredited recycling mills. Nothing is dumped in landfills or open burning yards.',
    aHi: 'कबाड़ को स्थानीय माइक्रो-हब में छांटकर डिजिटल बैच क्यूआर दिया जाता है और सीधे पंजीकृत रीसाइक्लिंग मिलों को भेजा जाता है। लैंडफिल में कुछ नहीं जाता।',
  },
  {
    id: 'minimum',
    q: 'Is there a minimum weight requirement for pickup?',
    qHi: 'क्या पिकअप के लिए कोई न्यूनतम वजन सीमा है?',
    a: 'No rigid minimum. Doorstep pickups starting from 5 kg or mixed recyclable bundles are supported free of charge in all active metro zones.',
    aHi: 'कोई कठोर न्यूनतम सीमा नहीं। सभी सक्रिय मेट्रो क्षेत्रों में 5 किलो या उससे अधिक के मिश्रित कबाड़ के लिए मुफ्त पिकअप उपलब्ध है।',
  },
];

/**
 * Standardized FAQ Accordion Section (Phase 3 Component)
 * - Accessible disclosure with 44px min tap targets
 * - Inside standardized <Container>
 * - Consistent heading hierarchy
 */
export const FaqAccordion: React.FC = () => {
  const { lang } = useLang();
  const [openId, setOpenId] = useState<string | null>('scales');

  const toggle = (id: string) => {
    setOpenId((curr) => (curr === id ? null : id));
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-[#0A0B0A] border-b border-[#1F221F]">
      <Container>
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              06 // FREQUENTLY ASKED QUESTIONS
            </span>
          </div>
          <h2
            data-qa-check="heading"
            className="font-display text-4xl sm:text-6xl text-[#F5F5F5] uppercase tracking-tight"
          >
            {lang === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'CLEAR ANSWERS'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6A6E6A] font-body max-w-xl">
            {lang === 'hi'
              ? 'पारदर्शी दरों, तौल सटीकता और रीसाइक्लिंग प्रक्रियाओं के बारे में आवश्यक जानकारी।'
              : 'Everything you need to know about doorstep scrap recovery, digital scale audits, and instant payouts.'}
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="max-w-3xl space-y-3 min-w-0">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                data-qa-check="card"
                className="bg-[#141614] border border-[#1F221F] rounded-sm transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  data-qa-check="button"
                  className="w-full min-h-[52px] px-5 py-3.5 flex items-center justify-between gap-4 text-left transition-colors hover:bg-[#1B1E1B]"
                >
                  <span className="font-heading text-base sm:text-lg font-bold uppercase text-[#F5F5F5] tracking-wide">
                    {lang === 'hi' ? faq.qHi : faq.q}
                  </span>
                  <Icon
                    icon={ChevronDown}
                    size={18}
                    className={`text-[#A3E635] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm font-body text-[#C8C8C8] leading-relaxed border-t border-[#1F221F]">
                    {lang === 'hi' ? faq.aHi : faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default FaqAccordion;
