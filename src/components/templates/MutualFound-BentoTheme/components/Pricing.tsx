
import React from 'react';
import { CheckCircle2, IndianRupee, TrendingUp, ShieldCheck, Zap, ArrowRight, Info, Clock, Users, Calendar } from 'lucide-react';

interface PricingProps {
  theme: 'dark' | 'light';
}

const PricingTable: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className={`w-full overflow-hidden rounded-3xl border transition-theme ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white shadow-sm'}`}>
    <div className={`grid grid-cols-2 border-b p-4 md:p-6 transition-theme ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/[0.02]'}`}>
      <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Tool / Service</span>
      <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 text-right">Annual Cost</span>
    </div>
    {[
      { name: "Bloomberg Terminal", price: "₹18,00,000 / year" },
      { name: "Morningstar Direct", price: "₹3,50,000 / year" },
      { name: "ACE Equity (Institutional)", price: "₹1,00,000+ / year" },
      { name: "Fee-only RIA", price: "₹50,000 - 2,00,000 / year" },
    ].map((item, i) => (
      <div key={i} className={`grid grid-cols-2 p-4 md:p-6 border-b last:border-0 hover:bg-black/[0.01] transition-colors ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <span className={`text-sm md:text-base transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.name}</span>
        <span className={`text-sm md:text-base font-medium text-right font-mono transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{item.price}</span>
      </div>
    ))}
  </div>
);

const BenefitRow: React.FC<{ title: string; access: string | React.ReactNode; isDark: boolean }> = ({ title, access, isDark }) => (
  <div className={`flex justify-between items-center py-4 border-b last:border-0 transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
    <span className={`text-sm md:text-base transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</span>
    <span className={`text-sm font-bold uppercase tracking-tighter transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{access}</span>
  </div>
);

export const Pricing: React.FC<PricingProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">The Price</h2>
          <h3 className={`text-4xl md:text-6xl font-black tracking-tighter mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            ₹999. <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white/40 to-white' : 'from-black/40 to-black'}`}>Once. Forever.</span>
          </h3>
        </div>

        {/* Context Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-5 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
              <Info size={14} />
              First, Some Context
            </h4>
            <p className={`text-lg leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              What does <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>institutional-grade</span> portfolio analysis normally cost? These tools run the exact same calculations you'll learn in this workshop.
            </p>
            <div className={`p-6 rounded-2xl italic text-sm text-gray-500 border transition-theme ${isDark ? 'bg-white/[0.03] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
              "You're not paying for a 'course'. You're paying for the access to the frameworks used by the top 1% of the industry."
            </div>
          </div>
          <div className="lg:col-span-7">
            <PricingTable isDark={isDark} />
          </div>
        </div>

        {/* Your Investment & Value Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 items-stretch">
          {/* Main Investment Card */}
          <div className={`p-10 rounded-[3rem] flex flex-col justify-between transition-all ${isDark ? 'bg-white text-black shadow-[0_40px_100px_rgba(255,255,255,0.1)]' : 'bg-black text-white shadow-2xl shadow-black/20'}`}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] mb-8 opacity-40">Your Investment</p>
              <h4 className="text-7xl font-black mb-4 tracking-tighter">₹999</h4>
              <p className="text-xl font-bold mb-10 opacity-60 italic leading-tight">One time. Lifetime access.</p>
              
              <div className="space-y-3 mb-12">
                 {[
                   "4-hour live workshop",
                   "6 copy-paste AI prompts",
                   "Full portfolio audit (done live)"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-bold opacity-80">
                      <CheckCircle2 size={16} />
                      {item}
                   </div>
                 ))}
              </div>
            </div>
            
            <button className={`w-full py-6 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
              ENROLL NOW
              <ArrowRight size={24} />
            </button>
          </div>

          {/* Breakdown Card */}
          <div className={`p-10 rounded-[3rem] border flex flex-col transition-theme ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white shadow-sm'}`}>
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">What You Get</h4>
              <span className="text-[10px] font-bold opacity-20 uppercase tracking-widest">Access Terms</span>
            </div>
            
            <div className="flex-1">
              <BenefitRow isDark={isDark} title="4-hour live workshop" access={<CheckCircle2 size={16} className="text-green-500" />} />
              <BenefitRow isDark={isDark} title="6 copy-paste AI prompts" access="Lifetime" />
              <BenefitRow isDark={isDark} title="Workshop recording" access="Lifetime" />
              <BenefitRow isDark={isDark} title="Interpretation frameworks" access={<CheckCircle2 size={16} className="text-green-500" />} />
              <BenefitRow isDark={isDark} title="Your portfolio analysed" access="During Session" />
              <BenefitRow isDark={isDark} title="Monthly audit routine" access="Lifetime" />
            </div>

            <div className={`mt-12 p-6 rounded-2xl border space-y-4 transition-theme ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
              <div className="flex items-start gap-3">
                <TrendingUp className="text-green-500 mt-1" size={16} />
                <p className="text-xs text-gray-400 leading-relaxed">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>The Math:</span> Average fee savings discovered: ₹11,000/year. One avoided ULIP mistake: ₹50,000-2,00,000.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Meta & Final Hook */}
        <div className={`max-w-4xl mx-auto rounded-[2.5rem] border p-8 md:p-12 overflow-hidden relative transition-theme ${isDark ? 'border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent' : 'border-black/5 bg-white shadow-xl'}`}>
          <div className={`absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            <Zap size={300} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="space-y-8">
              <h5 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">Upcoming Workshop</h5>
              
              <div className="space-y-4">
                {[
                  { Icon: Calendar, label: "Sunday, 14th April", sub: "Date" },
                  { Icon: Clock, label: "10:00 AM — 02:00 PM IST", sub: "Time" },
                  { Icon: Users, label: "Limited to 50 slots", sub: "Seats" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-theme ${isDark ? 'bg-white/5 text-white/60' : 'bg-black/5 text-black/60'}`}>
                      <item.Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{item.sub}</p>
                      <p className={`font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right">
              <p className="text-red-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap size={14} className="fill-red-400" />
                Limited Offer
              </p>
              <h4 className={`text-3xl font-black mb-6 leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
                Price increases to <br />
                <span className="text-gray-500 line-through decoration-white/20">₹1,499</span> next month.
              </h4>
              <p className="text-gray-500 text-sm mb-8 max-w-[280px]">
                Break-even in one insight. One avoided mistake. One verified decision.
              </p>
              <button className={`px-12 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:scale-[1.05]' : 'bg-black text-white hover:scale-[1.05]'}`}>
                ENROLL NOW — ₹999
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
