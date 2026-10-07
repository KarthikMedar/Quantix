import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  validateFullName, 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  validateConfirmPassword 
} from '../utils/validators';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const nameErr = validateFullName(formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validatePassword(formData.password, 6);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setIsSubmitting(false);

    if (result.success) {
      showToast(`Account created successfully! Welcome, ${result.user.name}.`, 'success');
      navigate('/dashboard');
    } else {
      showToast(result.error || 'Failed to create account', 'error');
      setErrors((prev) => ({
        ...prev,
        form: result.error,
      }));
    }
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
          {/* Left Column: Visual Brand Pitch */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-navy-900 via-brand-950 to-slate-900 text-white overflow-hidden">
            {/* Ambient Backing Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-violet/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-xs font-semibold text-brand-300">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Join EstimateAI</span>
              </div>
              <h2 className="text-2xl font-bold leading-snug">
                Eliminate Project Estimation Guesswork.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Transform requirements into exact developer timelines, team allocations, and milestone budgets.
              </p>
            </div>

            {/* Feature List */}
            <div className="relative z-10 space-y-3.5 my-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">AI Requirement Analysis</span>
                  Automatic breakdown of epics, features, and risk points.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">Resource & Cost Sizing</span>
                  Tailor engineering rosters with localized market rates.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white block">Client-Ready Reports</span>
                  Share defensible estimates with stakeholders & team leads.
                </div>
              </div>
            </div>

            {/* Guarantee Badge */}
            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Free sandbox tier • No credit card required</span>
            </div>
          </div>

          {/* Right Column: Sign Up Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto space-y-6">
              {/* Header */}
              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Create Your EstimateAI Account
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Start estimating software projects with AI precision.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Form Level Error */}
                {errors.form && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                    {errors.form}
                  </div>
                )}

                {/* Full Name */}
                <Input
                  label="Full Name"
                  id="signup-name"
                  name="name"
                  placeholder="e.g. Karthik Medar"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                  autoComplete="name"
                />

                {/* Email Address */}
                <Input
                  label="Email Address"
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoComplete="email"
                />

                {/* Phone Number */}
                <Input
                  label="Phone Number"
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                  autoComplete="tel"
                />

                {/* Password */}
                <Input
                  label="Password"
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="new-password"
                />

                {/* Confirm Password */}
                <Input
                  label="Confirm Password"
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                  autoComplete="new-password"
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full justify-center shadow-lg hover:shadow-brand-500/25 mt-2"
                >
                  Create Account
                </Button>
              </form>

              {/* Footer switch to Sign In */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
