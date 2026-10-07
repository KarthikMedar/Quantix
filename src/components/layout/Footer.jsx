import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { Sparkles, Heart, Shield, Cpu, ExternalLink } from 'lucide-react';

export const Footer = ({ onOpenAbout }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Logo size="default" showTagline={true} />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              AI-Powered Software Project Cost Estimation & Project Management Platform. Turn software ideas into intelligent, reliable project blueprints.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Phase 1 — Project Foundation Live</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors"
                >
                  About EstimateAI
                </button>
              </li>
              <li>
                <Link to="/login" className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Upcoming Engine Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Planned Engines
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-brand-500 font-mono">01</span> AI Requirement Parser
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-500 font-mono">02</span> Complexity Estimator
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-500 font-mono">03</span> Team & Resource Sizing
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-brand-500 font-mono">04</span> Timeline & Budget Models
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EstimateAI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer">
              Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
