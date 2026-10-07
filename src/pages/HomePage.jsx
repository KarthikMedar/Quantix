import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Button } from '../components/common/Button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const context = useOutletContext();
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <Hero onOpenAbout={context?.openAboutModal} />

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Bottom CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-brand-600 via-brand-700 to-navy-900 text-white shadow-2xl border border-brand-400/30 overflow-hidden text-center">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-violet/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Deterministic-First Engineering</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Turn Software Ideas Into Intelligent Estimates?
              </h2>

              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                Experience algorithmic software requirement decomposition, timeline forecasting, and budget modeling designed for modern engineering teams.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  to={isAuthenticated ? "/dashboard" : "/signup"}
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto text-brand-700 font-bold hover:bg-white"
                >
                  Start Estimating Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={context?.openAboutModal}
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                >
                  Explore Architecture
                </Button>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2 text-xs text-blue-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Transparent scoping • Instant sandbox access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
