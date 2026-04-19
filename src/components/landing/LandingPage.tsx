import React from 'react';
import { AnimatedGraphBackground } from './AnimatedGraphBackground';
import { HeroSection } from './HeroSection';
import { TrustIndicators } from './TrustIndicators';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 opacity-100" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />
      
      <AnimatedGraphBackground />
      
      <div className="relative z-10 flex-1 flex flex-col">
        <HeroSection />
        <TrustIndicators />
      </div>

      <footer className="relative z-10 p-8 border-t border-slate-900 text-center text-slate-500 text-xs font-mono">
        &copy; 2026 DOCINTEL LABS // BUILT FOR SCALE
      </footer>
    </main>
  );
}
