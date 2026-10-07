import React from 'react';
import { Menu, Plus, Search, Bell } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { ProfileDropdown } from '../common/ProfileDropdown';

export const DashboardTopbar = ({ onToggleMobile, title = 'Dashboard' }) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            AI-Assisted Estimation Workspace
          </p>
        </div>
      </div>

      {/* Right: Quick actions + Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          to="/new-estimate"
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          className="hidden sm:inline-flex"
        >
          New Estimate
        </Button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

        <LanguageSelector />
        <ThemeToggle />
        <ProfileDropdown />
      </div>
    </header>
  );
};
