
import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Minus, Plus, Clock, Users, Calendar, Sparkles } from 'lucide-react';

interface TheDecisionProps {
  theme: 'dark' | 'light';
}

const PathCard: React.FC<{
  title: string;
  items: string[];
  cost: string;
  isPremium?: boolean;
  isDark: boolean;
}> = ({ title, items, cost, isPremium, isDark }) => (
  <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all ${
    isPremium 
      ? (isDark ? 'bg-white text-black border-white shadow-[0_30px_60px_rgba(255,255,255,0.1)]' : 'bg-black text-white border-black shadow-[0_30px_60px_rgba(0,0,0,0.1)]') 
      : (isDark ? 'bg-white/[0.02] border-white/10 text-gray-400' : 'bg-white border-black/5 shadow-sm text-gray-600')
  }`}>
    <h4 className={`text-xl font-black uppercase tracking-widest mb-8 transition-theme ${
      isPremium ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-gray-500' : 'text-gray-800')
    }`}>{title}</h4>
    <ul className="space-y-4 mb-10">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm md:text-base leading-relaxed">
          {isPremium ? (
            <Plus size={18} className={`mt-1 flex-shrink-0 transition-theme ${isDark ? 'text-black/40' : 'text-white/40'}`} />
          ) : (
            <Minus size={18} className={`mt-1 flex-shrink-0 opacity-30 transition-theme ${isDark ? 'text-white' : 'text-black'}`} />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <div className={`pt-6 border-t transition-theme ${isPremium ? (isDark ? 'border-black/10' : 'border-white/10') : (isDark ? 'border-white/5' : 'border-black/5')}`}>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Total Cost</p>
      <p className={`text-2xl font-black transition-theme ${isPremium ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-white' : 'text-black')}`}>{cost}</p>
    </div>
  </div>
);

export const TheDecision: React.FC<TheDecisionProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-[#f8f9fa] border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">The Decision</h2>
          <h3 className={`text-4xl md:text-6xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            Two Paths Forward
          </h3>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24">
          <PathCard 
            isDark={isDark}
            title="Path A: Continue As-Is"
            items={[
              "Keep meaning to check your portfolio 'someday'",
              "Keep trusting recommendations without verification",
              "Keep wondering if your funds are actually good",
              "Keep postponing the audit for another 6 months"
            ]}
            cost="₹0 today. Unknown cost over time."
          />
          <PathCard 
            isDark={isDark}
            isPremium
            title="Path B: Get The Tools"
            items={[
              "Run your first portfolio analysis this weekend",
              "Know exactly where your money is going",
              "Verify recommendations with data, not hope",
              "Spend 15 minutes/month staying on top of everything"
            ]}
            cost="₹999 once. Capability forever."
          />
        </div>

        {/* Testimonials Quote Grid */}
        <div className="mb-24">
          <h4 className="text-[10px] font-black tracking-[0.4em] text-gray-600 uppercase mb-10 text-center">What 500+ Investors Chose</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "For the first time in 6 years of investing, I actually understand what I own.", name: "Sneha K." },
              { text: "Found ₹14,000/year in unnecessary overlap. Workshop paid for itself 14x.", name: "Rohit M." },
              { text: "My advisor was surprised I could ask such specific questions. Good surprise.", name: "Arun P." }
            ].map((t, i) => (
              <div key={i} className="space-y-4">
                <p className={`italic leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>"{t.text}"</p>
                <p className={`text-xs font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>— {t.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Information Block */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 border rounded-[3rem] p-10 md:p-14 transition-all ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/5 shadow-xl'}`}>
          <div className="space-y-8">
            <h5 className="text-sm font-black uppercase tracking-widest text-gray-500">Workshop Details</h5>
            <div className="space-y-6">
              {[
                { Icon: Calendar, label: "Sunday, 14th April" },
                { Icon: Clock, label: "4 hours (live + recording)" },
                { Icon: Users, label: "50 seats remaining" },
                { Icon: Sparkles, label: "₹999 (one-time)", bold: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <item.Icon className={`transition-theme ${isDark ? 'text-white/40' : 'text-black/40'}`} size={18} />
                  <span className={`text-sm ${item.bold ? 'font-bold' : 'font-medium'} transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h5 className={`text-sm font-black uppercase tracking-widest transition-theme ${isDark ? 'text-green-500/70' : 'text-green-600'}`}>What You Get</h5>
            <ul className="space-y-4">
              {[
                "6 institutional-grade AI prompts",
                "Live portfolio analysis",
                "IRR calculator for ULIPs",
                "Workshop recording (permanent)",
                "Monthly audit framework"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm transition-theme text-gray-400">
                  <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className={`text-sm font-black uppercase tracking-widest transition-theme ${isDark ? 'text-red-500/70' : 'text-red-600'}`}>What You Don't Get</h5>
            <ul className="space-y-4">
              {[
                "Fund recommendations",
                "Hot tips",
                "Recurring fees",
                "Manipulation tactics"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm transition-theme text-gray-500">
                  <XCircle size={14} className="opacity-30 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Final Sticky Enrollment CTA */}
        <div className="mt-24 text-center">
          <button className={`px-20 py-8 rounded-[2rem] font-black text-3xl transition-all active:scale-95 shadow-2xl mb-8 ${isDark ? 'bg-white text-black hover:scale-[1.02] shadow-white/10' : 'bg-black text-white hover:scale-[1.02] shadow-black/10'}`}>
            ENROLL NOW — ₹999
          </button>
          <p className="text-gray-500 text-sm tracking-wide font-medium">
            Next cohort starts in 7 days. Once the 50 slots are filled, applications close.
          </p>
        </div>
      </div>
    </section>
  );
};
