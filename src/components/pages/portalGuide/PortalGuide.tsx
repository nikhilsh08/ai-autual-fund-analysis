"use client"
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { 
  Mail, 
  MousePointerClick, 
  UserPlus, 
  ShieldCheck, 
  BookOpen, 
  ShoppingBag, 
  PlayCircle, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  CheckCircle2,
  Video
} from 'lucide-react';

interface Step {
  phase: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  illustration: ReactNode;
}

const steps: Step[] = [
  {
    phase: "Phase 2: LMS Account Creation",
    title: "Receive Invitation",
    description: "An automated invitation email is sent to your email address (support@cashflowcrew.in) immediately after purchase.",
    icon: Mail,
    color: "bg-black",
    illustration: (
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 w-72 text-left transform transition-all duration-500 hover:shadow-md">
        <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-4">
          <div className="bg-[#F3F0E6] p-3 rounded-full border border-gray-200">
            <Mail className="text-black" size={20}/>
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-black tracking-tight">Course Invitation</h4>
            <p className="text-xs text-gray-500 font-sans font-medium">support@cashflowcrew.in</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-2 bg-gray-100 rounded-full w-full"></div>
          <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
          <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
        </div>
      </div>
    )
  },
  {
    phase: "Phase 2: LMS Account Creation",
    title: "Initiate Sign-Up",
    description: "Open the email and click the 'Sign Up' link. This redirects you to the secure CashFlowCrew learning portal.",
    icon: MousePointerClick,
    color: "bg-black",
    illustration: (
      <div className="flex flex-col items-center justify-center relative">
        <button className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-bold shadow-md flex items-center space-x-2 transition-all cursor-default relative z-10">
          <span>Complete Registration</span>
          <ChevronRight size={18} />
        </button>
        <MousePointerClick size={32} className="text-gray-400 animate-pulse absolute -bottom-6 -right-4 z-20" />
      </div>
    )
  },
  {
    phase: "Phase 2: LMS Account Creation",
    title: "Register Account",
    description: "Fill out the quick portal form: Name, Email (pre-filled for you), secure Password, and Captcha code.",
    icon: UserPlus,
    color: "bg-black",
    illustration: (
      <div className="w-full max-w-xs space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 bg-gray-200 rounded-full"></div>
          <div className="h-10 border border-gray-200 rounded-lg"></div>
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-10 bg-[#F3F0E6] border border-gray-200 rounded-lg flex items-center px-3">
             <span className="text-sm font-sans font-semibold text-gray-500">support@cashflowcrew.in</span>
          </div>
        </div>
        <div className="h-10 mt-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-xs text-gray-400 font-bold tracking-widest border-b border-gray-300 border-dashed pb-0.5">CAPTCHA</span>
        </div>
      </div>
    )
  },
  {
    phase: "Phase 2: LMS Account Creation",
    title: "Verify Email",
    description: "A secure One-Time Password (OTP) is sent to your email. Enter this OTP on the portal to verify your account.",
    icon: ShieldCheck,
    color: "bg-black",
    illustration: (
      <div className="flex flex-col items-center space-y-6">
        <ShieldCheck size={48} className="text-black" strokeWidth={1.5} />
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5, 6].map((num, i) => (
            <div key={i} className="w-10 h-12 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-lg font-bold text-black shadow-sm">
              <span className="animate-pulse opacity-60" style={{ animationDelay: `${i * 100}ms` }}>•</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    phase: "Phase 3: Finalizing Course Access",
    title: "Claim the Course",
    description: "Once inside, you'll see your course details. Click 'Enroll Now' and scroll down to 'Purchase'.",
    icon: BookOpen,
    color: "bg-black",
    illustration: (
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm w-64 transform transition-all duration-500 hover:-translate-y-1">
        <div className="w-full h-32 bg-[#F3F0E6] rounded-xl flex items-center justify-center mb-5 border border-gray-100">
          <BookOpen size={36} className="text-gray-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-2 mb-5">
          <div className="h-2.5 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
        </div>
        <button className="w-full bg-black text-white py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
          Enroll Now
        </button>
      </div>
    )
  },
  {
    phase: "Phase 3: Finalizing Course Access",
    title: "Redeem Pre-paid Access",
    description: "Because you already securely paid on our main website, the portal recognizes your access. Your total is ₹0. Click 'Continue'.",
    icon: ShoppingBag,
    color: "bg-black",
    illustration: (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-left w-full max-w-xs relative overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-sans font-black text-gray-500 uppercase tracking-widest">Order Summary</h3>
          <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded text-[10px] font-sans font-black tracking-wide">PRE-PAID</span>
        </div>
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
          <span className="text-gray-600 font-sans text-sm font-bold">Total Due</span>
          <div className="text-right">
             <span className="text-2xl font-serif font-black text-black block">₹0.00</span>
             <span className="text-[10px] font-sans text-gray-400 font-semibold">(Already Paid)</span>
          </div>
        </div>
        <button className="w-full bg-black font-sans text-white py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors">
          Confirm & Continue
        </button>
      </div>
    )
  },
  {
    phase: "Phase 3: Finalizing Course Access",
    title: "Start Learning",
    description: "A success message appears! You are fully enrolled. Click 'Proceed to the Course' to start watching your lessons.",
    icon: PlayCircle,
    color: "bg-black",
    illustration: (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="bg-[#F3F0E6] border border-gray-200 text-black px-6 py-3 rounded-full text-sm font-sans font-bold flex items-center space-x-2 shadow-sm">
           <CheckCircle2 size={18} className="text-green-600" />
           <span>Course Unlocked Successfully</span>
        </div>
        <div className="relative w-64 h-36 bg-[#111111] rounded-2xl overflow-hidden shadow-xl flex items-center justify-center border border-gray-800 group cursor-pointer">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl">
            <Play size={28} className="text-black ml-1 fill-black" />
          </div>
        </div>
      </div>
    )
  }
];

export default function PortalGuide() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const activeItem = timelineRef.current.querySelector(`[data-step="${currentStep}"]`);
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentStep]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per slide for better reading time
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = (): void => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handlePrev = (): void => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const reset = (): void => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const activeStepInfo: Step = steps[currentStep];
  const IconComponent = activeStepInfo.icon;

  return (
    <div className="min-h-screen bg-[#F3F0E6] flex items-center justify-center p-2 sm:p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#E4E0D5] h-[95vh] md:h-[750px] max-h-[900px]">
        
        {/* Left Sidebar: Timeline */}
        <div className="w-full md:w-1/3 md:max-w-[320px] bg-[#EBE7DD] p-5 sm:p-6 md:p-8 flex flex-col border-b md:border-b-0 md:border-r border-[#DCD8CB] relative z-20 shrink-0">
          <div className="mb-4 md:mb-10 flex flex-row md:flex-col justify-between items-center md:items-start">
            <div>
              <h2 className="text-xl md:text-2xl font-serif font-black text-black flex items-center gap-2 tracking-tight">
                CashFlowCrew
              </h2>
              <p className="text-[10px] sm:text-[11px] text-gray-500 font-sans uppercase tracking-widest mt-0.5 md:mt-1 font-bold">Portal Access Guide</p>
            </div>
          </div>
          
          <div ref={timelineRef} className="flex-none md:flex-1 overflow-x-auto md:overflow-y-auto no-scrollbar relative w-full pb-2 md:pb-0 scroll-smooth">
            <div className="flex md:block w-max md:w-auto relative px-1 md:px-0">
              {/* Desktop Line */}
              <div className="absolute left-[15px] top-4 bottom-8 w-[2px] bg-[#DCD8CB] z-0 hidden md:block"></div>
              {/* Mobile Line */}
              <div className="absolute top-[15px] left-4 right-8 h-[2px] bg-[#DCD8CB] z-0 block md:hidden"></div>
              
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isPast = index < currentStep;
                
                return (
                  <div 
                    key={index} 
                    data-step={index}
                    className={`relative z-10 flex flex-row items-center md:items-start space-x-2 sm:space-x-3 md:space-x-5 cursor-pointer transition-all duration-300 mr-4 sm:mr-6 md:mr-0 md:mb-8 last:mr-4 md:last:mr-0 last:mb-0 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-75'}`}
                    onClick={() => { setCurrentStep(index); setIsPlaying(false); }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 border-[3px] relative z-10 ${isActive ? 'bg-black border-gray-300' : isPast ? 'bg-black border-transparent' : 'bg-white border-gray-300'}`}>
                      <StepIcon size={14} className={isActive || isPast ? 'text-white' : 'text-gray-400'} />
                    </div>
                    <div className="pt-0 md:pt-1.5 whitespace-nowrap md:whitespace-normal">
                      <p className={`text-xs sm:text-sm font-bold font-sans transition-colors ${isActive ? 'text-black' : 'text-gray-500'}`}>
                        <span className="md:hidden">{index + 1}. </span>{step.title}
                      </p>
                      {isActive && (
                        <p className="hidden md:block text-[10px] text-gray-500 font-sans mt-1 uppercase font-bold tracking-widest">
                          Step {index + 1} of {steps.length}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Area: Animation & Content */}
        <div className="w-full md:flex-1 p-5 sm:p-8 md:p-14 flex flex-col relative overflow-y-auto md:overflow-hidden bg-[#FAFAF8] h-full">
          
          {/* Phase Badge */}
          <div className="mb-6 md:mb-10 flex items-center shrink-0">
            <span className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-sans font-black uppercase tracking-widest bg-[#EBE7DD] text-black border border-[#DCD8CB]">
              {activeStepInfo.phase}
            </span>
          </div>

          {/* Main Animated Content */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto min-h-[250px] md:min-h-0">
            {/* Illustration Area */}
            <div 
              key={`illustration-${currentStep}`}
              className="h-48 sm:h-56 md:h-64 w-full flex items-center justify-center mb-6 md:mb-10 animate-[fadeInUp_0.5s_ease-out_forwards] shrink-0 transform scale-90 sm:scale-100"
            >
              {activeStepInfo.illustration}
            </div>
            
            {/* Text Area */}
            <div 
              key={`text-${currentStep}`}
              className="text-center animate-[fadeIn_0.6s_ease-out_forwards] shrink-0"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black mb-3 md:mb-4 text-black flex items-center justify-center gap-2 sm:gap-3 tracking-tight">
                <IconComponent size={24} className="text-black hidden sm:block" strokeWidth={2.5} />
                {activeStepInfo.title}
              </h1>
              <p className="text-sm sm:text-base font-sans text-gray-600 max-w-sm mx-auto leading-relaxed font-medium px-2 md:px-0">
                {activeStepInfo.description}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 md:mt-12 flex flex-col xl:flex-row items-center justify-between border-t border-[#EAE6DA] pt-4 md:pt-6 gap-4 xl:gap-0 shrink-0">
            
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full xl:w-auto font-sans">
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${isPlaying ? 'bg-[#EBE7DD] text-black hover:bg-[#DCD8CB]' : 'bg-black text-white hover:bg-gray-800 shadow-md'}`}
               >
                 {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                 <span>{isPlaying ? 'Pause' : 'Auto-Play'}</span>
               </button>

               {/* Video Guide Option */}
               {/* <button 
                 onClick={() => alert("This would open the video tutorial popup/modal.")}
                 className="flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold bg-transparent text-black border-2 border-black hover:bg-[#EBE7DD] transition-all"
                 title="Confused? Watch the video guide."
               >
                 <Video size={16} />
                 <span className="hidden sm:inline">Watch Video Guide</span>
                 <span className="sm:hidden">Video</span>
               </button> */}
            </div>

            <div className="flex space-x-2 justify-center w-full xl:w-auto">
              <button 
                onClick={reset}
                className="p-2.5 sm:p-3 rounded-full bg-white border border-[#DCD8CB] text-gray-600 hover:bg-[#EBE7DD] hover:text-black transition-colors"
                title="Start Over"
              >
                <RotateCcw size={16} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="p-2.5 sm:p-3 rounded-full bg-white border border-[#DCD8CB] text-gray-600 hover:bg-[#EBE7DD] hover:text-black disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="p-2.5 sm:p-3 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-30 transition-colors shadow-md"
              >
                <ChevronRight size={16} className="sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}