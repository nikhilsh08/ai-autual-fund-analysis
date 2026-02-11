
import React from 'react';
import { Calculator, AlertTriangle, TrendingDown, Quote, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

interface IncentiveProblemProps {
  theme: 'dark' | 'light';
}

const CommissionCard: React.FC<{ 
  title: string; 
  investment: string; 
  earnings: string; 
  multiplier?: string;
  isWarning?: boolean;
  isDark: boolean;
}> = ({ title, investment, earnings, multiplier, isWarning, isDark }) => (
  <div className={`p-8 rounded-3xl border transition-all relative overflow-hidden ${isWarning 
    ? (isDark ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-red-500/20 bg-red-50/[0.5]') 
    : (isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white shadow-sm')}`}>
    {multiplier && (
      <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
        {multiplier} Higher
      </div>
    )}
    <h4 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-6">{title}</h4>
    <div className="space-y-6">
      <div>
        <p className="text-xs text-gray-500 uppercase mb-1">Your Investment</p>
        <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>{investment}</p>
      </div>
      <div className={`h-px w-full ${isDark ? 'bg-white/5' : 'bg-black/5'}`}></div>
      <div>
        <p className="text-xs text-gray-500 uppercase mb-1">Distributor Earns (10Y)</p>
        <p className={`text-3xl font-black ${isWarning ? 'text-red-500' : (isDark ? 'text-white' : 'text-black')}`}>{earnings}</p>
      </div>
    </div>
  </div>
);

const DialogBox: React.FC<{ role: string; text: string; highlight?: boolean; isDark: boolean }> = ({ role, text, highlight, isDark }) => (
  <div className={`p-5 rounded-2xl border transition-theme ${highlight 
    ? (isDark ? 'border-white/20 bg-white/10 text-white' : 'border-black/10 bg-black/5 text-black font-medium') 
    : (isDark ? 'border-white/5 bg-white/[0.02] text-gray-400' : 'border-black/5 bg-white text-gray-600')}`}>
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">{role}</span>
    <p className={`text-base ${highlight ? 'italic' : ''}`}>"{text}"</p>
  </div>
);

export const IncentiveProblem: React.FC<IncentiveProblemProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-[#fcfcfc] border-black/5'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Munger Quote */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="relative mb-8">
            <div className={`w-32 h-32 rounded-full border-2 overflow-hidden flex items-center justify-center transition-theme ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-white/10' : 'bg-white border-black/5 shadow-lg'}`}>
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Charlie_Munger_in_2019.jpg/220px-Charlie_Munger_in_2019.jpg" 
                 alt="Charlie Munger" 
                 className={`w-full h-full object-cover ${isDark ? 'grayscale opacity-80' : ''}`}
               />
            </div>
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-tighter shadow-xl transition-theme ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              Charlie Munger
            </div>
          </div>
          <blockquote className={`text-2xl md:text-4xl font-serif italic max-w-3xl leading-snug transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            "Show me the incentive, and I will show you the outcome."
          </blockquote>
        </div>

        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            Why Your Bank Manager Might <br className="hidden md:block" />
            Recommend a ULIP
          </h2>
          <div className={`max-w-2xl mx-auto space-y-4 transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Commission-based advisors get paid differently for different products. This isn't about good vs bad advisors—it's about understanding incentive structures.</p>
            <p className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Verify recommendations with facts, not hearsay.</p>
          </div>
        </div>

        {/* Commission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <CommissionCard 
            isDark={isDark}
            title="Product 1: Equity Mutual Fund" 
            investment="₹1,00,000 (One-time)" 
            earnings="₹10,000 - 15,000" 
          />
          <CommissionCard 
            isDark={isDark}
            title="Product 2: ULIP / Endowment" 
            investment="₹1,00,000 / Year" 
            earnings="₹40,000 - 70,000" 
            multiplier="4-7X"
            isWarning
          />
        </div>

        <div className={`border rounded-3xl p-8 md:p-12 mb-24 transition-theme ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-lg'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className={`text-2xl font-bold mb-6 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The Math is Simple.</h3>
              <p className={`text-lg leading-relaxed mb-6 transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                A distributor can earn 4-7x more by recommending a ULIP instead of a mutual fund + term insurance.
              </p>
              <div className={`p-6 rounded-2xl border transition-theme ${isDark ? 'bg-black/40 border-white/5' : 'bg-[#fafafa] border-black/5'}`}>
                <p className={`font-bold mb-2 flex items-center gap-2 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
                  <AlertTriangle className="text-yellow-500" size={18} />
                  The Question:
                </p>
                <p className={`italic transition-theme ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>"When someone recommends a ULIP, is it better for YOUR wealth creation, or for their commission structure?"</p>
              </div>
            </div>
            <div className="space-y-4 text-center">
               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-theme ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                  <Calculator className={isDark ? 'text-white' : 'text-black'} size={32} />
               </div>
               <h4 className={`text-xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The Solution:</h4>
               <p className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b ${isDark ? 'from-white to-gray-500' : 'from-black to-gray-500'}`}>
                 Run the IRR calculation yourself.
               </p>
            </div>
          </div>
        </div>

        {/* Before vs After Scenario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Before */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
              <TrendingDown size={14} className="text-red-500" />
              Before (Without Tools)
            </h4>
            <div className="space-y-4">
              <DialogBox isDark={isDark} role="Bank Manager" text="This ULIP is perfect for your children's education." />
              <DialogBox isDark={isDark} role="You" text="Okay, sounds good." highlight />
              <p className="text-xs text-red-500 font-bold uppercase tracking-widest pt-2">No way to verify. Trust-based trap.</p>
            </div>
          </div>

          {/* After */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-500" />
              After (With IRR Prompt)
            </h4>
            <div className="space-y-4">
              <DialogBox isDark={isDark} role="You" text="I ran the IRR calculation. This ULIP returns 4.2% annually. Nifty 50 has averaged 12%. Why is this better for me?" highlight />
              <DialogBox isDark={isDark} role="Bank Manager" text="[silence]" />
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest pt-2 flex items-center gap-2">
                <DollarSign size={14} />
                Saved: ₹50,000 - ₹2,00,000 mistake.
              </p>
            </div>
          </div>
        </div>

        {/* Closing Statistic */}
        <div className="max-w-3xl mx-auto text-center">
          <div className={`mb-12 p-8 border rounded-2xl transition-theme ${isDark ? 'border-red-500/10 bg-red-500/[0.01]' : 'border-red-500/20 bg-red-50/50'}`}>
            <h5 className={`text-xl font-bold mb-4 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The Uncomfortable Fact:</h5>
            <p className={`text-lg transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              For every 1 new mutual fund investor in India, roughly <span className={`font-bold underline decoration-red-500/50 underline-offset-4 ${isDark ? 'text-white' : 'text-black'}`}>5 families</span> are sold low-return insurance plans.
            </p>
          </div>
          
          <h4 className={`text-3xl font-black mb-10 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Don't be a statistic.</h4>
          
          <button className={`group relative px-12 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 flex items-center gap-4 mx-auto ${isDark ? 'bg-white text-black shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02]' : 'bg-black text-white shadow-xl hover:scale-[1.02]'}`}>
            ENROLL NOW — ₹999
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
