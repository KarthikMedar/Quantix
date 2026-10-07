import React from 'react';
import { ArrowRight, Sparkles, BookOpen, ChevronRight, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HeroVisual } from './HeroVisual';
import { BackgroundNetwork } from './BackgroundNetwork';
import { useAuth } from '../../context/AuthContext';

export const Hero = ({ onOpenAbout }) => {
  const { isAuthenticated } = useAuth();

  const handleLearnMore = () => {
    const featuresElement = document.getElementById('features-section');
    if (featuresElement) {
      featuresElement.scrollIntoView({ behavior: 'smooth' });
    } else if (onOpenAbout) {
      onOpenAbout();
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 lg:py-24 overflow-hidden">
      {/* Subtle Animated Background */}
      <BackgroundNetwork />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-6 text-center lg:text-left space-y-6">
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span>Next-Gen Software Project Intelligence</span>
              <ChevronRight className="w-3 h-3 text-brand-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Turn Software Ideas Into{' '}
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-violet bg-clip-text text-transparent">
                Intelligent Project Estimates.
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              EstimateAI helps you analyze software requirements, understand project complexity, estimate resources, calculate development costs, and plan realistic timelines.
            </p>

            {/* Feature Bullets */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Requirement Decomposition</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Resource & Cost Modeling</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>Sprint Timeline Generation</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button
                to={isAuthenticated ? "/dashboard" : "/signup"}
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-xl hover:shadow-brand-500/30"
              >
                Start Estimating
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                leftIcon={<BookOpen className="w-4 h-4 text-slate-500" />}
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Visual Preview */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
};
