"use client";
import React, { useEffect } from 'react';
import { Hero } from './components/Hero';
import { GuiltActivation } from './components/GuiltActivation';
import { InformationAsymmetry } from './components/InformationAsymmetry';
import { IncentiveProblem } from './components/IncentiveProblem';
import { VerificationCapability } from './components/VerificationCapability';
import { ProofItWorks } from './components/ProofItWorks';
import { WorkshopDetails } from './components/WorkshopDetails';
import { WhoTeachesThis } from './components/WhoTeachesThis';
import { WhatWeSacrifice } from './components/WhatWeSacrifice';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { TheDecision } from './components/TheDecision';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const MutualFoundBentoTheme = () => {
      const theme = 'light';

  useEffect(() => {
    document.documentElement.className = theme;
  }, []);
  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#111]">
      <div className="grainy-bg fixed inset-0 z-0"></div>
      <Navbar theme={theme} />
      <main className="relative z-10">
        <Hero theme={theme} />
        <GuiltActivation theme={theme} />
        <InformationAsymmetry theme={theme} />
        <IncentiveProblem theme={theme} />
        <VerificationCapability theme={theme} />
        <ProofItWorks theme={theme} />
        <WorkshopDetails theme={theme} />
        <WhoTeachesThis theme={theme} />
        <WhatWeSacrifice theme={theme} />
        <Pricing theme={theme} />
        <FAQ theme={theme} />
        <TheDecision theme={theme} />
      </main>
      <Footer theme={theme} />
    </div>
  );
}

export default MutualFoundBentoTheme



