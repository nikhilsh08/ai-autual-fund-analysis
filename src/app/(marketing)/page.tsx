import BentoStats from "@/components/BentoStats";
import FeaturedBento from "@/components/FeaturedBento";
import LogoTicker from "@/components/LogoTicker";
import ReformHero from "@/components/ReformHero";
import TestimonialGrid from "@/components/TestimonialGrid";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
  <>
    <ReformHero />
    <LogoTicker />
    <BentoStats />
    <FeaturedBento  />
    <TestimonialGrid />
    {/* CTA Section */}
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto bg-zinc-50 border border-zinc-200 rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden shadow-sm">
         <div className="absolute inset-0 bg-noise opacity-30" />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100 blur-[100px] rounded-full pointer-events-none" />
         
         <h2 className="relative text-4xl md:text-6xl font-medium tracking-tighter text-zinc-900 mb-8">
           Ready to accelerate?
         </h2>
         <p className="relative text-zinc-600 text-lg max-w-xl mx-auto mb-10">
           Join 10,000+ engineers building the future. Start your free trial today.
         </p>
         <div className="relative flex flex-col sm:flex-row justify-center gap-4">
           <Button  className="h-12 px-8 text-base" >Start Learning</Button>
           <Button variant="outline" className="h-12 px-8 text-base bg-white border-zinc-300">Contact Sales</Button>
         </div>
      </div>
    </section>
  </>
  );
}
