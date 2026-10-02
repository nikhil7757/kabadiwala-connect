import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { BookOpen, CheckCircle2, XCircle, Award, HelpCircle, ArrowRight } from 'lucide-react';
import { useLang } from '../hooks/useLang';

const QUIZ_QUESTIONS = [
  {
    q: 'Which plastic grade is most readily recycled into secondary textile polyester yarn?',
    options: ['PVC (Type 3)', 'PET / PETE (Type 1)', 'Polystyrene / Thermocol (Type 6)', 'Other (Type 7)'],
    correct: 1,
    explanation: 'PET bottles (Type 1) are flaked, washed, and extruded directly into recycled polyester yarn for clothing.',
  },
  {
    q: 'Why should lithium-ion batteries NEVER be dumped into mixed household scrap?',
    options: [
      'They make scrap heavier than necessary',
      'They cause catastrophic spontaneous fires during mechanical baling & compaction',
      'They dissolve cardboard',
      'They reduce the price of scrap newspaper',
    ],
    correct: 1,
    explanation: 'Damaged lithium pouch cells short-circuit and explode when compressed in standard scrap hydraulic compactors.',
  },
  {
    q: 'What is the minimum purity requirement for informal scrap copper to enter formal secondary smelting?',
    options: ['Less than 50%', 'Over 95% free of PVC insulation and lead solder', 'Exactly 100%', 'Purity does not matter'],
    correct: 1,
    explanation: 'Stripped copper wire (Berry/Birch grade) requires >95% purity to avoid toxic emissions and furnace contamination.',
  },
  {
    q: 'What is Extended Producer Responsibility (EPR) under India’s Plastic & E-waste Rules?',
    options: [
      'A tax levied on kabadiwalas',
      'A legal mandate requiring brand manufacturers to fund and verify the collection of equivalent packaging/hardware',
      'A free municipal truck service',
      'A ban on selling scrap paper',
    ],
    correct: 1,
    explanation: 'EPR forces electronics and FMCG manufacturers to purchase verified recycling certificates directly from certified recycling chains.',
  },
  {
    q: 'How does digital traceability directly benefit the informal kabadiwala?',
    options: [
      'It charges them a 25% platform fee',
      'It provides legitimate banking credentials, formal ID passes, and eliminates middleman cuts',
      'It forces them to relocate outside cities',
      'It restricts what days they can collect',
    ],
    correct: 1,
    explanation: 'Kabadiwala Connect provides digital KYC operator passes, direct UPI bank transfers, and protection from informal extortion.',
  },
];

export const Learn: React.FC = () => {
  const { lang } = useLang();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIdx]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return score;
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A3E635', '#FFB020', '#FFFFFF'],
        });
      } catch (e) {}
    }
  };

  const segregationGuides = [
    {
      title: 'E-WASTE & BATTERIES',
      code: 'HIGH HAZARD // CERTIFIED ONLY',
      rules: ['Keep batteries taped at terminals', 'Do not crack CRT monitor screens', 'Store circuit boards in dry cardboard boxes'],
      color: '#FFB020',
    },
    {
      title: 'METALS (FERROUS & NON-FERROUS)',
      code: 'HIGH VALUE // CLEAN STRIP',
      rules: ['Strip PVC sheath from copper wire for 3x higher price', 'Keep aluminum beverage cans dry and crushed', 'Separate rusted iron from galvanized sheets'],
      color: '#A3E635',
    },
    {
      title: 'RIGID & FLEXIBLE PLASTICS',
      code: 'DENSITY CATEGORIZATION',
      rules: ['Rinse PET water bottles and flatten', 'Remove paper labels from HDPE shampoo containers', 'Never mix thermoset bakelite with recyclable plastics'],
      color: '#C8C8C8',
    },
  ];

  return (
    <div className="bg-[#0A0B0A] text-[#F5F5F5] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-0.5 bg-[#A3E635]" />
            <span className="font-mono text-xs text-[#A3E635] tracking-widest uppercase font-bold">
              KNOWLEDGE REPOSITORY // CIRCULAR CITIZEN
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-[#F5F5F5] uppercase tracking-tight">
            {lang === 'hi' ? 'स्क्रैप पृथक्करण व ज्ञान' : 'SEGREGATION GUIDE & QUIZ'}
          </h1>
          <p className="mt-2 text-[#6A6E6A] font-body text-sm sm:text-base max-w-2xl">
            {lang === 'hi'
              ? 'उचित पृथक्करण से स्क्रैप का मूल्य 40% तक बढ़ जाता है। गाइड पढ़ें और 5-प्रश्नों की क्विज में भाग लें।'
              : 'Proper segregation increases the value of household scrap by up to 40% while protecting informal workers from hazardous exposure.'}
          </p>
        </div>

        {/* 3 Technical Segregation Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {segregationGuides.map((guide, i) => (
            <div
              key={i}
              className="p-6 bg-[#141614] border border-[#1F221F] rounded-sm corner-brackets space-y-4"
            >
              <span className="font-mono text-[10px] text-[#A3E635] tracking-widest block font-bold">
                {guide.code}
              </span>
              <h3 className="font-heading text-xl font-bold uppercase text-[#F5F5F5]">
                {guide.title}
              </h3>
              <ul className="space-y-2 text-xs font-mono text-[#C8C8C8]">
                {guide.rules.map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="text-[#A3E635] font-bold">›</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Interactive 5-Question Quiz Console */}
        <div className="p-6 sm:p-10 bg-[#141614] border-2 border-[#1F221F] rounded-sm corner-brackets space-y-8 shadow-2xl">
          <div className="flex items-center justify-between pb-4 border-b border-[#1F221F]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#A3E635] font-bold">
                <HelpCircle className="w-4 h-4" />
                <span>CIRCULAR ECONOMY CITIZEN TEST</span>
              </div>
              <h2 className="font-heading text-2xl uppercase font-bold text-[#F5F5F5] mt-1">
                5-QUESTION SEGREGATION AUDIT
              </h2>
            </div>
            {submitted && (
              <div className="font-mono text-sm font-bold text-[#A3E635] px-3 py-1 bg-[#A3E635]/10 border border-[#A3E635] rounded-sm">
                SCORE: {calculateScore()} / {QUIZ_QUESTIONS.length}
              </div>
            )}
          </div>

          <div className="space-y-8 font-mono text-xs">
            {QUIZ_QUESTIONS.map((q, qIdx) => {
              const selectedOpt = answers[qIdx];
              return (
                <div key={qIdx} className="space-y-3 pb-6 border-b border-[#1F221F] last:border-0">
                  <div className="font-bold text-sm text-[#F5F5F5]">
                    0{qIdx + 1}. {q.q}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'border-[#1F221F] bg-[#050605] text-[#C8C8C8] hover:border-[#6A6E6A]';
                      if (submitted) {
                        if (optIdx === q.correct) {
                          btnStyle = 'border-[#A3E635] bg-[#A3E635]/20 text-[#A3E635] font-bold';
                        } else if (isChosen) {
                          btnStyle = 'border-[#FF6B5E] bg-[#FF6B5E]/20 text-[#FF6B5E]';
                        }
                      } else if (isChosen) {
                        btnStyle = 'border-[#A3E635] bg-[#A3E635]/10 text-[#F5F5F5] font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={`p-3 rounded-sm border text-left transition-all ${btnStyle}`}
                        >
                          <span className="opacity-50 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className="p-3 bg-[#0A0B0A] border border-[#1F221F] text-[11px] text-[#A3E635]">
                      ℹ {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length}
              className="w-full py-4 bg-[#A3E635] hover:bg-[#bbf451] text-[#0A0B0A] font-heading text-lg font-bold uppercase tracking-wider rounded-sm glow-lime transition disabled:opacity-40"
            >
              SUBMIT & AUDIT QUIZ SCORE
            </button>
          ) : (
            <div className="p-6 bg-[#050605] border border-[#A3E635] rounded-sm text-center space-y-2 font-mono text-xs">
              <span className="font-bold text-base text-[#A3E635]">
                {calculateScore() >= 4 ? '🎉 EXCELLENT! VERIFIED CIRCULAR CITIZEN' : 'GOOD EFFORT! REVIEW THE EXPLANATIONS ABOVE.'}
              </span>
              <p className="text-[#6A6E6A]">50 Bonus Reward Points credited to your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Learn;
