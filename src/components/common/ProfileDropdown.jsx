import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ShieldCheck, ChevronDown, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ProfileDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAuthenticated, logout, userInitials } = useAuth();
  const { showToast } = useToast();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    showToast('You have been successfully logged out.', 'info');
    navigate('/login');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-brand-500/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User profile menu"
      >
        {isAuthenticated ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-violet text-white font-bold text-xs flex items-center justify-center shadow-sm border border-white/20">
            {userInitials}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-300 dark:border-slate-700">
            <User className="w-4 h-4" />
          </div>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-2xl glass-dropdown shadow-2xl py-2 z-50 animate-scaleUp text-left"
          role="menu"
        >
          {isAuthenticated ? (
            <>
              {/* User info summary */}
              <div className="px-4 py-2.5 border-b border-slate-200/80 dark:border-slate-800/80">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'EstimateAI User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || ''}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{currentUser?.role || 'Planner'}</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  role="menuitem"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Dashboard Overview</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  role="menuitem"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings & Preferences</span>
                </Link>
              </div>

              {/* Logout */}
              <div className="pt-1 border-t border-slate-200/80 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800/80">
                Guest Visitor
              </div>
              <div className="py-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  role="menuitem"
                >
                  <LogIn className="w-4 h-4 text-brand-500" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                  role="menuitem"
                >
                  <UserPlus className="w-4 h-4 text-accent-violet" />
                  <span>Create Account</span>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
