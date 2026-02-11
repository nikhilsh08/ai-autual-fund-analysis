
import React from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, MessageCircle, Clock, Zap, ShieldCheck } from 'lucide-react';

interface FAQProps {
  theme: 'dark' | 'light';
}

const FAQItem: React.FC<{ question: string; children: React.ReactNode; icon?: React.ReactNode; isDark: boolean }> = ({ question, children, icon, isDark }) => (
  <div className={`p-8 rounded-3xl border transition-all group ${isDark ? 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02]' : 'border-black/5 bg-white shadow-sm hover:shadow-md'}`}>
    <div className="flex items-start gap-4 mb-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 text-white/40 group-hover:text-white' : 'bg-black/5 text-black/40 group-hover:text-black'}`}>
        {icon || <HelpCircle size={20} />}
      </div>
      <h4 className={`text-xl md:text-2xl font-bold leading-tight transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-black'}`}>{question}</h4>
    </div>
    <div className={`pl-14 space-y-4 text-lg leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
      {children}
    </div>
  </div>
);

export const FAQ: React.FC<FAQProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-black border-white/5' : 'bg-white border-black/5'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">Common Queries</h2>
          <h3 className={`text-4xl md:text-5xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            You Might Be Asking...
          </h3>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          <FAQItem isDark={isDark} question="I already have an advisor I trust." icon={<ShieldCheck size={20} />}>
            <p>Good. Keep them. This isn't about replacing advisors. It's about <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>verifying recommendations</span>.</p>
            <p>Your advisor says "this fund has great risk-adjusted returns." Now you can check. <span className={`italic ${isDark ? 'text-white' : 'text-black'}`}>Trust, but verify.</span></p>
            <p className="text-sm">The best advisors will appreciate that you're engaged. The problematic ones will be uncomfortable. Either way, you'll know where you stand.</p>
          </FAQItem>

          <FAQItem isDark={isDark} question="What if the prompts stop working when AI changes?" icon={<Zap size={20} />}>
            <p>AI models improve. They don't regress. These prompts use fundamental financial calculations. The methodology doesn't change because ChatGPT updates.</p>
            <p>If anything, outputs get <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>MORE accurate</span> over time, not less.</p>
          </FAQItem>

          <FAQItem isDark={isDark} question="What if I don't have time for a 4-hour workshop?" icon={<Clock size={20} />}>
            <p>You get the recording. Pause when you need to run the prompts yourself. Finish over a weekend.</p>
            <p className={isDark ? 'text-white' : 'text-black font-semibold'}>The prompts are yours forever—use them whenever you're ready.</p>
          </FAQItem>

          <FAQItem isDark={isDark} question="What if I don't like it?" icon={<MessageCircle size={20} />}>
            <p>At ₹999, we're not offering blanket refunds. Here's why: We want <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>committed learners</span>, not "let me check it out" energy.</p>
            <p>Our ask: Only enrol if you're actually going to DO the work. Watch the workshop. Run the prompts on YOUR portfolio. Build the habit.</p>
            <p className={`text-sm border-t pt-4 italic transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>500+ people have taken this workshop. The results speak for themselves.</p>
          </FAQItem>
        </div>

        {/* Final Outro CTA */}
        <div className={`mt-24 text-center p-12 rounded-[3rem] border transition-theme ${isDark ? 'border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent' : 'border-black/5 bg-white shadow-xl'}`}>
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs mb-6">One Last Decision</p>
          <h4 className={`text-3xl md:text-4xl font-black mb-10 leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            Take back control <br className="hidden md:block" /> 
            of your financial truth.
          </h4>
          <div className="flex flex-col items-center gap-6">
            <button className={`px-16 py-7 rounded-2xl font-black text-2xl transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:scale-105' : 'bg-black text-white hover:scale-105'}`}>
              ENROLL NOW — ₹999
            </button>
            <div className="flex items-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
              {[
                "Live Session",
                "Lifetime Prompts",
                "Institutional Data"
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
