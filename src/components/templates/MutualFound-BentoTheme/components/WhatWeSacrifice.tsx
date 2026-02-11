
import React from 'react';
import { XCircle, CheckCircle2, ShieldOff, ZapOff, Coins, Puzzle, Info, ArrowRight } from 'lucide-react';

interface WhatWeSacrificeProps {
  theme: 'dark' | 'light';
}

const SacrificeCard: React.FC<{ 
  title: string; 
  desc: string; 
  reason: string;
  icon: React.ReactNode;
  isDark: boolean;
}> = ({ title, desc, reason, icon, isDark }) => (
  <div className={`p-8 rounded-3xl border transition-all ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03]' : 'border-black/5 bg-white shadow-sm hover:shadow-md'}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className="text-red-500/50">
        {icon}
      </div>
      <h4 className={`font-bold text-lg line-through decoration-red-500/30 transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</h4>
    </div>
    <p className={`mb-6 leading-relaxed transition-theme ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
    <div className={`pt-6 border-t transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 italic">Why?</p>
      <p className={`text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{reason}</p>
    </div>
  </div>
);

export const WhatWeSacrifice: React.FC<WhatWeSacrificeProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">Transparency</h2>
          <h3 className={`text-3xl md:text-5xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            What We Don't Do— <br className="hidden md:block" />
            <span className={`text-transparent bg-clip-text bg-gradient-to-b ${isDark ? 'from-white to-gray-600' : 'from-black to-gray-600'}`}>And Why It Matters</span>
          </h3>
        </div>

        {/* Model Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className={`p-10 rounded-3xl border space-y-8 relative overflow-hidden transition-theme ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-[#fafafa]'}`}>
             <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
               <ShieldOff size={100} className={isDark ? 'text-white' : 'text-black'} />
             </div>
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">The Industry Model</h4>
             <ul className="space-y-4">
                {[
                  "Free webinar (builds trust)",
                  "Low-ticket course that's deliberately incomplete",
                  "High-ticket 'advanced' version for real value",
                  "Advisory/Community — the real monetisation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-500 text-sm italic">
                    <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-500/30' : 'bg-red-500/20'}`}></span>
                    Step {i+1}: {item}
                  </li>
                ))}
             </ul>
             <p className={`text-xs leading-relaxed border-t pt-6 transition-theme ${isDark ? 'text-gray-600 border-white/5' : 'text-gray-400 border-black/5'}`}>
               The business model: Withhold value at each stage. Make you feel incomplete. Charge for completion.
             </p>
          </div>

          <div className={`p-10 rounded-3xl border space-y-8 transition-theme ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/5 bg-white shadow-xl'}`}>
             <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Our Model</h4>
             <p className={`text-2xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The ₹999 workshop is <span className={`underline underline-offset-8 transition-theme ${isDark ? 'decoration-white/20' : 'decoration-black/10'}`}>COMPLETE</span>.</p>
             <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-1 text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Every prompt you need to analyse mutual funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-1 text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Every framework you need to interpret results</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-1 text-green-500" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>A working monthly audit system</span>
                </li>
             </ul>
             <div className={`p-4 rounded-xl border transition-theme ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                <p className="text-xs text-gray-400">You will <span className={isDark ? 'text-white font-bold' : 'text-black font-bold'}>NOT</span> feel like you need an "advanced version" to start using this.</p>
             </div>
          </div>
        </div>

        {/* The Sacrifices */}
        <div className="mb-24">
          <h4 className="text-sm font-black tracking-[0.2em] text-gray-600 uppercase mb-10 text-center">What We Actually Sacrifice</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SacrificeCard isDark={isDark} icon={<ShieldOff size={24} />} title="No Recommendations" desc="We could tell you which funds to buy. That's what gets clicks." reason="Recommendations create dependency. Tools create independence. We chose tools." />
            <SacrificeCard isDark={isDark} icon={<ZapOff size={24} />} title="No Recurring Fees" desc='We could charge ₹299/month for "premium updates."' reason="The prompts don't expire. AI improves automatically. One payment. Lifetime access." />
            <SacrificeCard isDark={isDark} icon={<Coins size={24} />} title="No Commissions" desc="We could partner with AMCs and earn commissions on sales." reason="Zero partnerships. Zero conflicts. When we say 'verify', we mean it." />
            <SacrificeCard isDark={isDark} icon={<Puzzle size={24} />} title="No Gaps By Design" desc="We could have saved 3 prompts for a '₹2,999 advanced workshop.'" reason="We didn't. This workshop contains everything you need to verify mutual funds." />
          </div>
        </div>

        {/* Note on Other Course */}
        <div className={`max-w-4xl mx-auto p-10 rounded-3xl border transition-theme ${isDark ? 'border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent' : 'border-black/5 bg-white shadow-xl'}`}>
          <div className="flex items-center gap-3 mb-8">
            <Info className="text-gray-500" size={20} />
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">A Note On Our Other Course</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className={`leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We have a separate <span className={`font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>₹4,000 course</span> covering equities, bonds, commodities, and goal planning.
              </p>
              <p className="text-gray-500 text-sm">
                It's a different product for a different need—not the "advanced version" of this workshop.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-theme ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-[#fafafa]'}`}>
                <span className="text-xs text-gray-400">₹999 Workshop</span>
                <span className={`text-sm font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>"Are my mutual funds good?"</span>
              </div>
              <div className={`p-4 rounded-xl border flex justify-between items-center transition-theme ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-[#fafafa]'}`}>
                <span className="text-xs text-gray-400">₹4,000 Course</span>
                <span className={`text-sm font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>"Build my entire financial system"</span>
              </div>
            </div>
          </div>
          
          <div className={`mt-12 pt-8 border-t text-center transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <p className={`italic mb-8 transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              "Take the ₹999 workshop and never buy anything else from us. You'll still have full mutual fund verification capability. We're genuinely okay with that."
            </p>
            <button className={`px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl flex items-center gap-4 mx-auto ${isDark ? 'bg-white text-black hover:scale-[1.02]' : 'bg-black text-white hover:scale-[1.02]'}`}>
              ENROLL NOW — ₹999
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
