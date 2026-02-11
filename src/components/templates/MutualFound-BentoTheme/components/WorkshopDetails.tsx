
import React from 'react';
import { 
  Clock, 
  Layers, 
  BarChart3, 
  ShieldAlert, 
  Search, 
  PieChart, 
  Calculator, 
  CheckCircle2, 
  XCircle,
  Copy,
  Layout,
  PlayCircle,
  CalendarDays
} from 'lucide-react';

interface WorkshopDetailsProps {
  theme: 'dark' | 'light';
}

const ToolCard: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode; isDark: boolean }> = ({ num, title, desc, icon, isDark }) => (
  <div className={`p-6 rounded-2xl border transition-all group ${isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]' : 'border-black/5 bg-white shadow-sm hover:shadow-md'}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 text-white/40 group-hover:text-white group-hover:bg-white/10' : 'bg-black/5 text-black/40 group-hover:text-black group-hover:bg-black/10'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Tool {num}</span>
    </div>
    <h4 className={`font-bold text-lg mb-2 leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{title}</h4>
    <p className={`text-sm leading-relaxed transition-theme ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{desc}</p>
  </div>
);

export const WorkshopDetails: React.FC<WorkshopDetailsProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section id="workshop" className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">The Workshop</h2>
          <h3 className={`text-3xl md:text-5xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            4 Hours. 6 Verification Tools. <br className="hidden md:block" />
            <span className={`text-transparent bg-clip-text bg-gradient-to-b ${isDark ? 'from-white to-gray-600' : 'from-black to-gray-600'}`}>Lifetime Capability.</span>
          </h3>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400 mt-12">
            {[
              { Icon: Clock, label: "4-Hour Live Session" },
              { Icon: Layout, label: "No Excel Required" },
              { Icon: Copy, label: "Copy-Paste AI Prompts" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-theme ${isDark ? 'bg-white/5 text-white' : 'bg-black/5 text-black'}`}>
                  <item.Icon size={14} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* What this is & What happens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          <div className="space-y-6">
            <h4 className={`text-xl font-bold border-l-2 pl-4 transition-theme ${isDark ? 'border-white text-white' : 'border-black text-black'}`}>What This Is</h4>
            <div className={`space-y-4 text-lg leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>A live, 4-hour workshop where you learn to run institutional-grade portfolio analysis using AI.</p>
              <p>No finance background required. No Excel skills needed. <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>If you can copy-paste text, you can do this.</span></p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className={`text-xl font-bold border-l-2 pl-4 transition-theme ${isDark ? 'border-white text-white' : 'border-black text-black'}`}>What Happens</h4>
            <div className={`space-y-4 text-lg leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>You don't just watch. You follow along—on <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>YOUR portfolio</span>, with <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>YOUR funds</span>.</p>
              <p>By the end of 4 hours, you'll have analyzed your own funds and identified problems you didn't know existed.</p>
            </div>
          </div>
        </div>

        {/* 6 Tools Grid */}
        <div className="mb-24">
          <h4 className="text-sm font-black tracking-[0.2em] text-gray-600 uppercase mb-10 text-center">The 6 Tools You'll Master</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard isDark={isDark} num={1} title='The "Am I Actually Diversified?" Analysis' desc='Reveals whether your 4-5 "different" funds are secretly the same 30 stocks.' icon={<Layers />} />
            <ToolCard isDark={isDark} num={2} title='The "Bang For Your Buck" Calculator' desc="Reveals whether your fund's returns are actually good for the risk it's taking." icon={<BarChart3 />} />
            <ToolCard isDark={isDark} num={3} title='The "Crash Protection" Verifier' desc="Reveals whether your fund actually protects downside—or just claims to." icon={<ShieldAlert />} />
            <ToolCard isDark={isDark} num={4} title='The "Hidden Bets" Detector' desc="Reveals which stocks your fund manager is buying that aren't even in the benchmark." icon={<Search />} />
            <ToolCard isDark={isDark} num={5} title='The "Where Is The Money?" Mapper' desc="Reveals which sectors your fund is overweight/underweight compared to benchmark." icon={<PieChart />} />
            <ToolCard isDark={isDark} num={6} title='The "ULIP Truth" Calculator' desc="Reveals the actual IRR of any ULIP/endowment plan vs mutual fund + term insurance." icon={<Calculator />} />
          </div>
        </div>

        {/* Takeaways & Disclaimers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-24">
          {/* What you walk away with */}
          <div className={`p-10 rounded-3xl border transition-all ${isDark ? 'border-white/10 bg-white/[0.03]' : 'border-black/5 bg-[#fafafa]'}`}>
            <h4 className={`text-2xl font-bold flex items-center gap-3 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
              <CheckCircle2 className="text-green-500" />
              What You Walk Away With
            </h4>
            <ul className="space-y-4 mt-8">
              <li className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 size={16} className="mt-1 text-green-500/50" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}><span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>6 copy-paste AI prompts</span> (yours forever)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 size={16} className="mt-1 text-green-500/50" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}><span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Your own portfolio fully analysed</span> (done during live session)</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <CheckCircle2 size={16} className="mt-1 text-green-500/50" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Framework for interpreting AI outputs accurately</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <PlayCircle size={16} className="mt-1 text-gray-400" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Workshop recording to rewatch anytime</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <CalendarDays size={16} className="mt-1 text-gray-400" />
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Monthly audit routine (15 minutes/month)</span>
              </li>
            </ul>
          </div>

          {/* What you don't get */}
          <div className={`p-10 rounded-3xl border space-y-8 relative overflow-hidden transition-theme ${isDark ? 'border-white/5 bg-black' : 'border-black/5 bg-white shadow-sm'}`}>
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
              <XCircle size={120} className={isDark ? 'text-white' : 'text-black'} />
            </div>
            <h4 className={`text-2xl font-bold flex items-center gap-3 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
              <XCircle className="text-red-500/50" />
              What You Don't Get
            </h4>
            <ul className="space-y-4 relative z-10">
              {[
                "Fund recommendations (\"buy this, sell that\")",
                "Individual stock tips",
                "Complex trading strategies",
                "Get-rich-quick schemes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500 line-through decoration-gray-400">
                  <XCircle size={16} className="mt-1 opacity-50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className={`pt-4 border-t relative z-10 transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                This is <span className={isDark ? 'text-gray-300' : 'text-black'}>verification capability</span>, not investment advice. You'll learn to <span className={isDark ? 'text-gray-300' : 'text-black'}>CHECK</span> recommendations—not receive them.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
           <button className={`px-16 py-8 rounded-2xl font-black text-2xl transition-all active:scale-95 mb-6 shadow-2xl ${isDark ? 'bg-white text-black hover:scale-[1.02] shadow-white/5' : 'bg-black text-white hover:scale-[1.02] shadow-black/10'}`}>
              ENROLL NOW — ₹999
           </button>
           <p className="text-gray-500 text-sm">Next live workshop starts in 7 days. Limited slots remaining.</p>
        </div>
      </div>
    </section>
  );
};
