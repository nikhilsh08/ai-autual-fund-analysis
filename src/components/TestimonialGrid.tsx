"use client"
import { Terminal, Shield, Layers } from 'lucide-react';
const TestimonialGrid = () => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 blur-2xl rounded-3xl opacity-80" />
          <div className="relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-8 md:p-12">
              <div className="mb-8 text-blue-600">
                <Terminal size={32} />
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium leading-tight text-zinc-900 mb-8">
                "The depth of the Mutual Fund analysis track is unmatched. It's not just theory; these are the exact strategies used by professional fund managers."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200" />
                <div>
                  <div className="text-zinc-900 font-medium">Rajesh Kumar</div>
                  <div className="text-zinc-500 text-sm">Portfolio Manager</div>
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 px-8 py-4 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500 font-mono">
              <span>CERTIFIED INVESTOR</span>
              <span>BATCH W23</span>
            </div>
          </div>
        </div>

        <div className="space-y-12 pl-0 lg:pl-12">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-900 flex items-center gap-2">
              <Shield className="text-zinc-500" size={20} /> Data-Driven Analysis
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Our strategies are backtested against 10 years of market data. We don't guess; we follow proven mathematical models.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-zinc-900 flex items-center gap-2">
              <Layers className="text-zinc-500" size={20} /> Actionable Frameworks
            </h3>
            <p className="text-zinc-600 leading-relaxed">
              Learn specific frameworks for debt, equity, and hybrid funds. Our structured approach adapts to your risk profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialGrid
