import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AboutContent } from '../components/common/AboutContent';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const AboutPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Card Wrapping Content */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 shadow-xl">
          <AboutContent />

          {/* Bottom CTAs */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              EstimateAI Foundation • Phase 1
            </span>
            <div className="flex items-center gap-3">
              <Button to="/" variant="outline" size="sm">
                Explore Landing
              </Button>
              <Button
                to={isAuthenticated ? "/dashboard" : "/signup"}
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Start Estimating
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
