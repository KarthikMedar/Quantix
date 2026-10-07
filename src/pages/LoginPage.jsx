import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Activity,
  Layers,
  HelpCircle
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/validators';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleValidate = () => {
    const newErrors = {};
    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(password, 6);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      const params = new URLSearchParams(window.location.search);
      const target = params.get('redirect') || '/dashboard';
      navigate(target);
    } else {
      showToast(result.error || 'Failed to sign in', 'error');
      setErrors((prev) => ({
        ...prev,
        auth: result.error,
      }));
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('karthik@estimateai.io');
    setPassword('Demo@1234');
    setErrors({});
    showToast('Demo credentials auto-filled', 'info', 2000);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast('Password reset instructions have been dispatched to your email address.', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 transition-colors">
      {/* Top Bar Navigation */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-20">
        <Logo size="default" />
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-navy-900">
          {/* Left Column: Animated AI Visual Panel */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-navy-900 via-brand-950 to-slate-900 text-white overflow-hidden">
            {/* Ambient Backing Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-xs font-semibold text-brand-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>AI Engineering Intelligence</span>
              </div>
              <h2 className="text-2xl font-bold leading-snug">
                Architectural Clarity from Day One.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to generate detailed software project estimations, evaluate team compositions, and forecast project budgets with confidence.
              </p>
            </div>

            {/* Simulated Live Analytics Visual */}
            <div className="relative z-10 my-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-brand-400" />
                  Active Workspace Engine
                </span>
                <span className="text-emerald-400 font-mono">v1.0 Live</span>
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-400 to-accent-violet w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>Requirement Confidence</span>
                  <span>96.4%</span>
                </div>
              </div>
            </div>

            {/* Bottom Test Credentials Quick Fill Box */}
            <div className="relative z-10 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-200">Demo Account</p>
                  <p className="text-[11px] text-slate-400 font-mono">karthik@estimateai.io</p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="px-2.5 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-medium border border-brand-500/30 transition-colors"
                >
                  Quick Fill
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Sign in to continue planning your projects.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* General Auth Error */}
                {errors.auth && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                    {errors.auth}
                  </div>
                )}

                {/* Email Field */}
                <Input
                  label="Email Address"
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                />

                {/* Password Field */}
                <Input
                  label="Password"
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  error={errors.password}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="current-password"
                  rightAction={
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  }
                />

                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full justify-center shadow-lg hover:shadow-brand-500/25 mt-2"
                >
                  Sign In
                </Button>
              </form>

              {/* Quick Demo Fill link for mobile */}
              <div className="lg:hidden text-center pt-1">
                <button
                  type="button"
                  onClick={handleQuickDemoFill}
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                >
                  Click to Auto-fill Demo Credentials
                </button>
              </div>

              {/* Footer switch to Sign Up */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
