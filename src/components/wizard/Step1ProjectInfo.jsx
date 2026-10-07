import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Info, 
  Check, 
  Layers, 
  Shield, 
  Cpu, 
  Sparkles,
  Users,
  Compass,
  Clock
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Badge } from '../common/Badge';
import { useProjectEstimation } from '../../context/ProjectEstimationContext';
import { useToast } from '../../context/ToastContext';

export const Step1ProjectInfo = ({ onNext }) => {
  const navigate = useNavigate();
  const { project, updateProject, updateTechnology, updateRequirements } = useProjectEstimation();
  const { showToast } = useToast();

  const [errors, setErrors] = useState({});

  // Dropdown options
  const PROJECT_TYPES = [
    'Web Application',
    'Mobile Application',
    'Web + Mobile Application',
    'SaaS Platform',
    'E-Commerce',
    'FinTech',
    'HealthTech',
    'EdTech',
    'Social Media',
    'Enterprise Software',
    'AI / Machine Learning',
    'IoT Application',
    'Gaming',
    'Government / Public Service',
    'Other',
  ];

  const PLATFORMS = [
    'Web',
    'Android',
    'iOS',
    'Windows',
    'macOS',
    'Linux',
    'Cross Platform',
  ];

  const DOMAINS = [
    'Education',
    'Healthcare',
    'Finance',
    'E-Commerce',
    'Travel',
    'Food & Restaurant',
    'Entertainment',
    'Social Networking',
    'Transportation',
    'Real Estate',
    'Technology',
    'Government',
    'Other',
  ];

  const COMPLEXITY_LEVELS = [
    {
      level: 'Low',
      title: 'Low Complexity',
      description: 'Simple functionality, standard CRUD workflows, and limited external integrations.',
      badgeVariant: 'brand',
    },
    {
      level: 'Medium',
      title: 'Medium Complexity',
      description: 'Multiple interrelated modules, standard authentication, and moderate technical requirements.',
      badgeVariant: 'warning',
    },
    {
      level: 'High',
      title: 'High Complexity',
      description: 'Complex third-party integrations, advanced multi-tenant workflows, or high-concurrency scaling.',
      badgeVariant: 'purple',
    },
    {
      level: 'Very High',
      title: 'Very High Complexity',
      description: 'Highly complex architectures involving AI/ML, real-time streaming, strict financial security, or distributed microservices.',
      badgeVariant: 'danger',
    },
  ];

  const USER_SCALE_PRESETS = ['100', '1,000', '10,000', '100,000', '1,000,000+'];
  const TIMELINE_PRESETS = ['8 weeks', '12 weeks', '16 weeks', '24 weeks', '6 months'];

  const FRONTEND_OPTIONS = ['React', 'Angular', 'Vue', 'Flutter', 'Next.js', 'Other'];
  const BACKEND_OPTIONS = ['Node.js', 'Python', 'Java', '.NET', 'Go', 'Other'];
  const DATABASE_OPTIONS = ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis', 'Other'];

  const AUTH_OPTIONS = [
    'Email/Password',
    'Google Login',
    'Phone OTP',
    'Social Login',
    'Multi-factor Authentication',
  ];

  const SECURITY_OPTIONS = [
    'Basic Security',
    'Advanced Security',
    'Financial/High-Security Requirements',
  ];

  const INTEGRATION_OPTIONS = [
    'Payment Gateway',
    'Maps',
    'Email Service',
    'SMS',
    'Cloud Storage',
    'Third-party APIs',
    'Social Media APIs',
    'Other',
  ];

  // Platform toggle helper
  const handleTogglePlatform = (p) => {
    const current = project.platforms || [];
    let updated;
    if (current.includes(p)) {
      if (current.length === 1) {
        showToast('At least one target platform is required.', 'warning');
        return;
      }
      updated = current.filter((item) => item !== p);
    } else {
      updated = [...current, p];
    }
    updateProject('platforms', updated);
    if (errors.platforms) setErrors((prev) => ({ ...prev, platforms: null }));
  };

  // Tech preference toggle helper
  const handleToggleTech = (category, tech) => {
    const currentList = project.technology[category] || [];
    let updated;
    if (currentList.includes(tech)) {
      updated = currentList.filter((t) => t !== tech);
    } else {
      updated = [...currentList, tech];
    }
    updateTechnology(category, updated);
  };

  // Requirement toggle helper
  const handleToggleAuth = (authOption) => {
    const currentList = project.requirements.authentication || [];
    let updated;
    if (currentList.includes(authOption)) {
      updated = currentList.filter((a) => a !== authOption);
    } else {
      updated = [...currentList, authOption];
    }
    updateRequirements('authentication', updated);
  };

  const handleToggleIntegration = (integrationOption) => {
    const currentList = project.requirements.integrations || [];
    let updated;
    if (currentList.includes(integrationOption)) {
      updated = currentList.filter((i) => i !== integrationOption);
    } else {
      updated = [...currentList, integrationOption];
    }
    updateRequirements('integrations', updated);
  };

  // Step 1 Validation
  const validateForm = () => {
    const newErrors = {};

    if (!project.name || !project.name.trim()) {
      newErrors.name = 'Project name is required.';
    } else if (project.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters.';
    } else if (project.name.trim().length > 100) {
      newErrors.name = 'Project name must be less than 100 characters.';
    }

    if (!project.description || !project.description.trim()) {
      newErrors.description = 'Project description is required.';
    } else if (project.description.trim().length < 10) {
      newErrors.description = 'Please provide a more descriptive overview (at least 10 characters).';
    } else if (project.description.length > 1000) {
      newErrors.description = 'Project description cannot exceed 1000 characters.';
    }

    if (!project.type) {
      newErrors.type = 'Please select a project type.';
    } else if (project.type === 'Other' && (!project.customType || !project.customType.trim())) {
      newErrors.customType = 'Please specify the project type.';
    }

    if (!project.platforms || project.platforms.length === 0) {
      newErrors.platforms = 'Please select at least one target platform.';
    }

    if (!project.complexity) {
      newErrors.complexity = 'Please select an initial complexity assessment.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateForm()) {
      showToast('Please resolve the required fields before continuing.', 'error');
      // Scroll to the top error smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Form Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Create New Project
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tell us about the software project you want to estimate.
        </p>
      </div>

      {/* Main Form Cards */}
      <div className="space-y-6">
        {/* SECTION 1: CORE PROJECT IDENTITY */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-500" />
              General Project Information
            </h3>
            <p className="text-xs text-slate-400">
              Basic identifiers and business scope for the estimation model.
            </p>
          </div>

          <div className="space-y-5">
            {/* Project Name */}
            <div>
              <Input
                label="Project Name"
                id="project-name"
                name="name"
                placeholder="e.g. Smart Food Delivery Platform"
                value={project.name}
                onChange={(e) => {
                  updateProject('name', e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                error={errors.name}
                required
              />
            </div>

            {/* Project Description with Character Counter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="project-description"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Project Description <span className="text-rose-500 ml-1 font-bold">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    project.description.length > 950
                      ? 'text-rose-500 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {project.description.length} / 1000
                </span>
              </div>

              <textarea
                id="project-description"
                rows={4}
                maxLength={1000}
                placeholder="Describe what your software should do, who will use it, and what problem it is intended to solve."
                value={project.description}
                onChange={(e) => {
                  updateProject('description', e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
                }}
                className={`w-full rounded-xl border text-sm p-3.5 transition-all outline-none resize-none bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                  errors.description
                    ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                }`}
              />

              {errors.description && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Project Type & Business Domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Project Type */}
              <div>
                <label
                  htmlFor="project-type"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Project Type <span className="text-rose-500 ml-1 font-bold">*</span>
                </label>
                <select
                  id="project-type"
                  value={project.type}
                  onChange={(e) => {
                    updateProject('type', e.target.value);
                    if (errors.type) setErrors((prev) => ({ ...prev, type: null }));
                  }}
                  className={`w-full rounded-xl border py-2.5 px-3.5 text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 outline-none transition-all ${
                    errors.type
                      ? 'border-rose-400 dark:border-rose-600 focus:border-rose-500'
                      : 'border-slate-300 dark:border-slate-700/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                  }`}
                >
                  <option value="">-- Select Project Type --</option>
                  {PROJECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                {errors.type && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.type}</span>
                  </div>
                )}

                {/* If Other, display extra input */}
                {project.type === 'Other' && (
                  <div className="mt-3">
                    <Input
                      label="Specify Project Type"
                      placeholder="e.g. Decentralized Blockchain Gateway"
                      value={project.customType}
                      onChange={(e) => {
                        updateProject('customType', e.target.value);
                        if (errors.customType) setErrors((prev) => ({ ...prev, customType: null }));
                      }}
                      error={errors.customType}
                      required
                    />
                  </div>
                )}
              </div>

              {/* Business Domain */}
              <div>
                <label
                  htmlFor="business-domain"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Business Domain <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  id="business-domain"
                  value={project.businessDomain}
                  onChange={(e) => updateProject('businessDomain', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700/80 py-2.5 px-3.5 text-sm bg-white dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="">-- Select Business Domain --</option>
                  {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                      {domain}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  Assists the AI in benchmarking industry compliance & workflows.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 2: TARGET PLATFORMS & SCALE */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-500" />
              Target Platforms & Expected Users
            </h3>
            <p className="text-xs text-slate-400">
              Select all platforms you plan to support and anticipated initial user volume.
            </p>
          </div>

          {/* Platforms Multi-select */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Target Platform <span className="text-rose-500 ml-1 font-bold">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Select one or more</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PLATFORMS.map((platform) => {
                const isSelected = (project.platforms || []).includes(platform);
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleTogglePlatform(platform)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all duration-200 text-left ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm ring-1 ring-brand-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span>{platform}</span>
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-brand-500 border-brand-500 text-white'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.platforms && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-500 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.platforms}</span>
              </div>
            )}
          </div>

          {/* Expected Users */}
          <div>
            <label
              htmlFor="expected-users"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Expected Number of Users <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Approximate number of users expected to use the system.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="expected-users"
                  type="text"
                  placeholder="e.g. 10,000"
                  value={project.expectedUsers}
                  onChange={(e) => updateProject('expectedUsers', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Preset Scale Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {USER_SCALE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateProject('expectedUsers', preset)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                      project.expectedUsers === preset
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Requested Delivery Timeline */}
          <div>
            <label
              htmlFor="requested-timeline"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
            >
              Target Delivery Timeline <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Your requested deadline to benchmark feasibility against the estimation engine.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="requested-timeline"
                  type="text"
                  placeholder="e.g. 12 weeks or 3 months"
                  value={project.requestedTimeline || ''}
                  onChange={(e) => updateProject('requestedTimeline', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/80 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Preset Timeline Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                {TIMELINE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateProject('requestedTimeline', preset)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                      project.requestedTimeline === preset
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 3: PROJECT COMPLEXITY ASSESSMENT */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-500" />
                Initial Project Complexity <span className="text-rose-500 font-bold">*</span>
              </h3>
              <Badge variant="neutral" size="sm">
                Self-Assessment
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select your initial estimate of the project's overall architectural complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {COMPLEXITY_LEVELS.map((item) => {
              const isSelected = project.complexity === item.level;
              return (
                <div
                  key={item.level}
                  onClick={() => {
                    updateProject('complexity', item.level);
                    if (errors.complexity) setErrors((prev) => ({ ...prev, complexity: null }));
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-50/60 dark:bg-brand-950/60 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                    <Badge variant={item.badgeVariant} size="sm">
                      {item.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {errors.complexity && (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.complexity}</span>
            </div>
          )}

          {/* Important Disclaimer Note */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <p className="leading-relaxed">
              <strong>Notice:</strong> This is only your initial assessment. In later phases, the estimation engine will analyze the detailed features and architectural load, and may adjust the recommended complexity level.
            </p>
          </div>
        </Card>

        {/* SECTION 4: TECHNOLOGY PREFERENCES (OPTIONAL) */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Technology Preferences <span className="text-slate-400 font-normal">(Optional)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Specify preferred tech stacks or allow EstimateAI to recommend the optimal stack.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-brand-600 dark:text-brand-400">
              <input
                type="checkbox"
                checked={project.technology.recommendLater}
                onChange={(e) => updateTechnology('recommendLater', e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span>I don't know / Recommend technology later</span>
            </label>
          </div>

          {!project.technology.recommendLater && (
            <div className="space-y-4">
              {/* Frontend */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Frontend Preference
                </span>
                <div className="flex flex-wrap gap-2">
                  {FRONTEND_OPTIONS.map((tech) => {
                    const isSelected = (project.technology.frontend || []).includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleToggleTech('frontend', tech)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Backend */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Backend Preference
                </span>
                <div className="flex flex-wrap gap-2">
                  {BACKEND_OPTIONS.map((tech) => {
                    const isSelected = (project.technology.backend || []).includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleToggleTech('backend', tech)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Database */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Database Preference
                </span>
                <div className="flex flex-wrap gap-2">
                  {DATABASE_OPTIONS.map((tech) => {
                    const isSelected = (project.technology.database || []).includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleToggleTech('database', tech)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                          isSelected
                            ? 'bg-brand-500 text-white border-brand-500'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* SECTION 5: PROJECT REQUIREMENTS (OPTIONAL) */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-500" />
              Security & Integration Requirements <span className="text-slate-400 font-normal">(Optional)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Anticipated auth protocols, compliance levels, and third-party services.
            </p>
          </div>

          <div className="space-y-5">
            {/* Authentication requirements */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Authentication Methods
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AUTH_OPTIONS.map((auth) => {
                  const isChecked = (project.requirements.authentication || []).includes(auth);
                  return (
                    <label
                      key={auth}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleAuth(auth)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{auth}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Security level */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Security Level
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SECURITY_OPTIONS.map((sec) => (
                  <label
                    key={sec}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-medium transition-colors ${
                      project.requirements.security === sec
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="security-level"
                      checked={project.requirements.security === sec}
                      onChange={() => updateRequirements('security', sec)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span>{sec}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Third-Party Integrations */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Third-Party Integrations
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INTEGRATION_OPTIONS.map((intg) => {
                  const isChecked = (project.requirements.integrations || []).includes(intg);
                  return (
                    <label
                      key={intg}
                      className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-300"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleIntegration(intg)}
                        className="rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span>{intg}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/dashboard')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Back to Dashboard
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md"
        >
          Next: Add Features →
        </Button>
      </div>
    </div>
  );
};
