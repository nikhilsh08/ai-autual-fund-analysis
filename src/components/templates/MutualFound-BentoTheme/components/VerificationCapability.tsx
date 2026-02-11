
import React from 'react';
import { Clock, CheckCircle2, XCircle, Search, Target, ShieldAlert, BarChart3, Zap } from 'lucide-react';

interface VerificationCapabilityProps {
  theme: 'dark' | 'light';
}

const ComparisonCard: React.FC<{
  question: string;
  withoutTools: string;
  withTools: string;
  time: string;
  icon: React.ReactNode;
  isDark: boolean;
}> = ({ question, withoutTools, withTools, time, icon, isDark }) => (
  <div className={`group border rounded-3xl overflow-hidden transition-all ${isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-black/5 bg-white shadow-sm hover:shadow-md'}`}>
    <div className={`p-6 border-b flex items-center gap-4 transition-theme ${isDark ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.01]'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10' : 'bg-black/5 text-black/40 group-hover:text-black group-hover:bg-black/10'}`}>
        {icon}
      </div>
      <h4 className={`font-bold text-lg leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{question}</h4>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Without Tools */}
      <div className={`p-6 border-b md:border-b-0 md:border-r transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-2 mb-3 opacity-50">
          <XCircle size={14} className="text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">Without Tools</span>
        </div>
        <p className={`text-sm leading-relaxed transition-theme ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{withoutTools}</p>
      </div>
      
      {/* With Tools */}
      <div className={`p-6 transition-theme ${isDark ? 'bg-white/[0.03]' : 'bg-green-50/[0.3]'}`}>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={14} className="text-green-500" />
          <span className={`text-[10px] font-black uppercase tracking-widest transition-theme ${isDark ? 'text-white/70' : 'text-black/70'}`}>With Tools</span>
        </div>
        <p className={`text-sm leading-relaxed font-medium transition-theme ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
          {withTools}
        </p>
      </div>
    </div>
    
    <div className={`px-6 py-3 flex items-center gap-2 transition-theme ${isDark ? 'bg-white/5' : 'bg-black/[0.02]'}`}>
      <Clock size={12} className="text-gray-500" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Time to verify: {time}</span>
    </div>
  </div>
);

export const VerificationCapability: React.FC<VerificationCapabilityProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">Verification Capability</h2>
          <h3 className={`text-3xl md:text-5xl font-bold tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            What Changes When <br className="hidden md:block" />
            You Have The Tools
          </h3>
          <div className={`max-w-2xl mx-auto space-y-4 text-lg transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>This isn't about becoming a finance expert. It's about being able to <span className={isDark ? 'text-white' : 'text-black font-semibold'}>CHECK</span> what you're told by anyone.</p>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-black/60'}`}>Here's what becomes possible with the right AI prompts:</p>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <ComparisonCard 
            isDark={isDark}
            icon={<Target />}
            question="Are my 4 funds actually diversified?"
            withoutTools="No idea. You assume 4 funds = 4 different portfolios. You hope for the best."
            withTools="You discover: 67% overlap. You're paying 4 expense ratios for essentially the same 30 stocks."
            time="10 minutes"
          />
          <ComparisonCard 
            isDark={isDark}
            icon={<BarChart3 />}
            question="Is my fund's 18% return actually good?"
            withoutTools="Looks great! You're happy. 18% sounds like a huge number."
            withTools="You discover: Nifty did 22%. Your fund took MORE risk for LESS return. An index fund would have beaten it."
            time="5 minutes"
          />
          <ComparisonCard 
            isDark={isDark}
            icon={<ShieldAlert />}
            question="Does this fund actually protect during crashes?"
            withoutTools="Advisor says yes. You hope it's true and wait for the next crash to find out."
            withTools="You discover: During the 2020 crash, this 'balanced' fund fell MORE than pure equity. It failed its primary job."
            time="5 minutes"
          />
          <ComparisonCard 
            isDark={isDark}
            icon={<Search />}
            question="What is my fund manager actually buying?"
            withoutTools="You see 'Large Cap Fund' and assume it's safe and stable. You trust the label."
            withTools="You discover: 8.4% of your 'large cap' fund is in small caps. Hidden bets you didn't sign up for."
            time="5 minutes"
          />
          <div className="lg:col-span-2">
            <ComparisonCard 
              isDark={isDark}
              icon={<Zap />}
              question="Is this ULIP better than mutual fund + term insurance?"
              withoutTools="Trust the bank manager's recommendation because it sounds 'convenient'."
              withTools="You run the IRR. You see the actual return comparison vs. a simple term plan. You make an informed choice."
              time="15 minutes"
            />
          </div>
        </div>

        {/* Efficiency Summary */}
        <div className={`max-w-4xl mx-auto rounded-3xl p-10 border transition-theme ${isDark ? 'border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent' : 'border-black/5 bg-white shadow-xl'}`}>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Efficiency Audit</p>
                <h4 className={`text-2xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The Time Paradox</h4>
              </div>
              
              <div className="space-y-4">
                <div className={`flex justify-between items-end border-b pb-4 transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <span className="text-gray-400">Total Portfolio Audit Time:</span>
                  <span className={`text-2xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>~50 minutes</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500">Traditional DIY Time:</span>
                  <span className={`text-lg font-medium text-red-400/70 line-through decoration-gray-700`}>12-14 hours</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm italic italic">
                ...or more commonly, you just don't do it at all.
              </p>
            </div>
            
            <div className="flex-1 text-center md:text-right">
              <p className={`text-5xl font-black mb-6 tracking-tighter transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
                93% <br />
                <span className="text-xl font-normal text-gray-500 tracking-normal">Time Reduction</span>
              </p>
              <button className={`px-8 py-4 rounded-xl font-bold transition-all shadow-xl w-full md:w-auto ${isDark ? 'bg-white text-black hover:scale-[1.02]' : 'bg-black text-white hover:scale-[1.02]'}`}>
                ENROLL NOW — ₹999
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
