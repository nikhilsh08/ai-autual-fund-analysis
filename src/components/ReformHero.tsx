"use client"
import { Cpu, } from 'lucide-react';
import { Button } from './ui/button';
import { Course } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReformHeroProps {
  course?: Course | null;
}

const ReformHero: React.FC<ReformHeroProps> = ({ course }) => {
  const router = useRouter();

  const handleBuyNow = () => {
    if (course) {
      router.push(`/checkout?courseId=${course.id}`);
    } else {
      // Fallback or scroll to courses
      console.log("No course available");
    }
  };

  return (
    <section className="pt-28 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[600px] flex items-center bg-zinc-50 border border-zinc-200 shadow-sm">

          <div className="absolute inset-0 w-full h-full">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-400/10 blur-[100px] rounded-full" />
            <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-indigo-400/10 blur-[80px] rounded-full" />
            <div className="absolute inset-0 bg-noise opacity-30" />
          </div>

          <div className="relative z-10 p-8 md:p-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-medium text-zinc-600 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              {course ? "New Course Available" : "New Courses Available"}
            </div>

            <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-zinc-900 mb-8 leading-[0.95]">
              {course ? (
                <>
                  {course.title}
                </>
              ) : (
                <>
                  Master the future of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">software development.</span>
                </>
              )}
            </h1>

            <p className="text-lg text-zinc-600 max-w-xl mb-10 leading-relaxed">
              {course ? course.description : "Institutional-grade curriculum for developers. Automate your learning path with AI-driven diagnostics and expert-led modules."}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="h-12 px-8" onClick={handleBuyNow}>
                Buy Now
              </Button>
              {course ? (
                <Link href={`/${course.staticRoute || 'master-mutual-funds'}`}>
                  <Button variant="outline" className="h-12 px-8 bg-white/50 backdrop-blur-sm border-zinc-200 text-zinc-900">
                    View Details
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" className="h-12 px-8 bg-white/50 backdrop-blur-sm border-zinc-200 text-zinc-900">
                  View Syllabus
                </Button>
              )}
            </div>
          </div>

          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-[400px]">
            <div className="bg-white/60 backdrop-blur-xl border border-zinc-200 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Cpu size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-zinc-900">{course?.title || "System Architecture"}</div>
                  <div className="text-xs text-zinc-500">Module 1 • In Progress</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-blue-600 rounded-full" />
                </div>
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>15% Complete</span>
                  <span>Many hours remaining</span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-12 -left-12 bg-white/80 backdrop-blur-xl border border-zinc-200 rounded-xl p-4 shadow-xl w-48">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-bold text-zinc-900">Live Session</span>
              </div>
              <div className="text-sm text-zinc-600">{course?.title ? "Join now..." : "Dr. Elena Vance is coding..."}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReformHero;
