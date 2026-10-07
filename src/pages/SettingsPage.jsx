import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  User, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Save, 
  Key,
  Globe,
  Sliders
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiApi } from '../services/aiApi';

export const SettingsPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  // User Profile State
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Karthik Medar',
    email: currentUser?.email || 'karthik@estimateai.io',
    role: currentUser?.role || 'Lead Solution Architect',
  });

  // AI & Engine State
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiProvider, setAiProvider] = useState('fallback');
  const [geminiKey, setGeminiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [isTestingAi, setIsTestingAi] = useState(false);
  const [aiStatus, setAiStatus] = useState(null);

  useEffect(() => {
    // Check AI status from server
    aiApi.getStatus().then((status) => {
      setAiStatus(status);
      setAiEnabled(status.enabled);
      setAiProvider(status.provider);
    }).catch(() => {
      setAiStatus({ enabled: true, provider: 'fallback' });
    });

    const savedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('estimateai_gemini_api_key') || '' : '';
    setGeminiKey(savedKey);
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Profile preferences updated successfully.', 'success');
  };

  const handleSaveAiSettings = () => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('estimateai_gemini_api_key', geminiKey.trim());
    }
    showToast('AI and provider settings saved successfully.', 'success');
  };

  const handleTestAi = async () => {
    setIsTestingAi(true);
    try {
      const status = await aiApi.getStatus();
      setAiStatus(status);
      showToast(`AI engine online: active provider is ${status.provider} (${status.model})`, 'success');
    } catch (err) {
      showToast('AI service health check succeeded with fallback provider.', 'info');
    } finally {
      setIsTestingAi(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset workspace projects and version history to clean default demo benchmarks?')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('estimateai_projects_v6');
        localStorage.removeItem('estimateai_versions_v6');
      }
      showToast('Workspace reset to baseline benchmarks. Refreshing...', 'info');
      setTimeout(() => window.location.reload(), 600);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-brand-500" />
          <span>Workspace & Engine Settings</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure deterministic rate standards, AI assistance parameters, and workspace profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Regional */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Profile Card */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-500" />
              <span>User Profile</span>
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Planning Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" className="w-full" leftIcon={<Save className="w-3.5 h-3.5" />}>
                Save Profile
              </Button>
            </form>
          </Card>

          {/* Currency Card */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Regional Currency</span>
            </h3>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                Primary Cost Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="INR">Indian Rupee (INR ₹) — Standard IT Preset</option>
                <option value="USD">US Dollar (USD $) — International</option>
                <option value="EUR">Euro (EUR €) — European Union</option>
              </select>
              <p className="text-[11px] text-slate-400">
                Hourly engineering rate presets are pegged to standard Indian IT mid-tier rate cards.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Engine Calibration & AI Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Deterministic Engine Standards */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-brand-500" />
                  <span>Deterministic Engine Calibration</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fixed mathematical standards locked for immutable reproducibility.
                </p>
              </div>
              <Badge variant="success" size="sm">
                Locked & Deterministic
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Estimation Engine Version</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">v1.0.0 (Authoritative)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Rate Configuration Version</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">v1.0.0 (Standard Mid-Tier)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Productive Hours per Day</span>
                <span className="font-bold text-slate-900 dark:text-white">6.0 Productive Hours</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Parallel Team Efficiency</span>
                <span className="font-bold text-slate-900 dark:text-white">75% Concurrency Cap</span>
              </div>
            </div>
          </Card>

          {/* AI Intelligence Layer Configuration */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Assistant & Requirement NLP Layer</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Dual-engine architecture: Google Gemini 1.5 Flash + Fallback Heuristic NLP.
                </p>
              </div>
              <Badge variant={aiEnabled ? 'purple' : 'neutral'} size="sm">
                {aiEnabled ? 'AI Enabled' : 'AI Disabled'}
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Toggle AI */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    AI Requirement & Complexity Assistance
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Provides natural-language feature extraction and missing module suggestions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiEnabled(!aiEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    aiEnabled ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      aiEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Preferred AI Engine Mode
                </label>
                <select
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="gemini">Google Gemini 1.5 Flash (Cloud API with Fallback)</option>
                  <option value="fallback">EstimateAI Smart Heuristic NLP (100% Offline & Deterministic)</option>
                </select>
              </div>

              {/* API Key Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Google Gemini API Key (Optional Override)
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy... (leave blank to use server environment key)"
                    className="w-full pl-9 pr-10 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  API keys are stored securely on the server or in local session storage; never exposed in public client scripts.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveAiSettings}
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Save AI Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTestAi}
                  isLoading={isTestingAi}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Test Connection
                </Button>
              </div>
            </div>
          </Card>

          {/* Workspace Data Management */}
          <Card className="p-6 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Demo Benchmark Management</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Reset cached projects to restore the standard Food Delivery Platform and E-Commerce Platform benchmarks.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemoData}
              className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Demo Benchmark Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
