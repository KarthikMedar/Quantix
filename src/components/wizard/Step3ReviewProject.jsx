import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  Compass, 
  Layers, 
  Cpu, 
  Shield, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Users
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useProjectEstimation } from '../../context/ProjectEstimationContext';
import { useToast } from '../../context/ToastContext';
import { projectService } from '../../services/projectService';

export const Step3ReviewProject = ({ onGoToStep, onPrev }) => {
  const navigate = useNavigate();
  const { project, features, runEstimation } = useProjectEstimation();
  const { showToast } = useToast();

  const handleContinueToEstimation = async () => {
    try {
      if (runEstimation) {
        runEstimation();
      }
      // Save current completed input specification to projectService
      await projectService.createProject({
        title: project.name,
        description: project.description,
        domain: project.businessDomain,
        type: project.type === 'Other' ? project.customType : project.type,
        platforms: project.platforms,
        complexity: project.complexity,
        expectedUsers: project.expectedUsers,
        technology: project.technology,
        requirements: project.requirements,
        features: features,
        status: 'Draft Ready for Analysis',
        createdAt: new Date().toISOString(),
      });

      showToast('Project scope successfully recorded!', 'success');
      navigate('/estimate-analysis');
    } catch (err) {
      showToast('Failed to save project review: ' + err.message, 'error');
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Must Have':
        return 'danger';
      case 'Important':
        return 'warning';
      case 'Nice to Have':
        return 'brand';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Review Project Specification
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review all collected inputs, requirements, and feature scopes before proceeding to the AI estimation engine.
        </p>
      </div>

      <div className="space-y-6">
        {/* CARD 1: PROJECT INFORMATION */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-brand-500" />
              Project Information
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Project Name
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                {project.name || 'Untitled'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Project Type
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white block mt-0.5">
                {project.type === 'Other' ? project.customType : project.type || 'Not selected'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Business Domain
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mt-0.5">
                {project.businessDomain || 'Technology'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Initial Complexity
              </span>
              <div className="mt-1">
                <Badge variant="warning" size="sm">
                  {project.complexity || 'Medium'}
                </Badge>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Expected Users
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 block mt-0.5">
                {project.expectedUsers || 'Unspecified'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                Target Platforms
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {project.platforms?.map((p) => (
                  <Badge key={p} variant="neutral" size="sm">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Project Description
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800">
                {project.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </Card>

        {/* CARD 2: TECHNOLOGY PREFERENCES */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-500" />
              Technology Preferences
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Edit
            </Button>
          </div>

          {project.technology.recommendLater ? (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 italic">
              User requested automated AI technology recommendation in later phase.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Frontend</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.technology.frontend?.length > 0
                    ? project.technology.frontend.join(', ')
                    : 'None specified'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Backend</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.technology.backend?.length > 0
                    ? project.technology.backend.join(', ')
                    : 'None specified'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block mb-1">Database</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.technology.database?.length > 0
                    ? project.technology.database.join(', ')
                    : 'None specified'}
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* CARD 3: SECURITY & INTEGRATION REQUIREMENTS */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-500" />
              Requirements & Integrations
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(1)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Authentication
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {project.requirements.authentication?.length > 0
                  ? project.requirements.authentication.join(', ')
                  : 'Standard'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Security Profile
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {project.requirements.security || 'Basic Security'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Integrations
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {project.requirements.integrations?.length > 0
                  ? project.requirements.integrations.join(', ')
                  : 'None selected'}
              </span>
            </div>
          </div>
        </Card>

        {/* CARD 4: COMPLETE FEATURES LIST */}
        <Card className="p-6 sm:p-8 bg-white dark:bg-navy-900 border-slate-200/90 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                Configured Features ({features.length})
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGoToStep(2)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Edit Features
            </Button>
          </div>

          <div className="space-y-2.5">
            {features.map((feat, idx) => (
              <div
                key={feat.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {feat.name}
                    </h5>
                    <Badge variant="neutral" size="sm">
                      {feat.category}
                    </Badge>
                    <Badge variant={getPriorityBadge(feat.priority)} size="sm">
                      {feat.priority}
                    </Badge>
                  </div>
                  {feat.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                      {feat.description}
                    </p>
                  )}
                </div>

                {feat.dependencies && feat.dependencies.length > 0 && (
                  <div className="text-[11px] text-slate-400 pl-6 sm:pl-0">
                    Depends on: {feat.dependencies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between">
        <Button
          variant="outline"
          size="md"
          onClick={onPrev}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          ← Back
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleContinueToEstimation}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="shadow-md"
        >
          Continue to Estimation →
        </Button>
      </div>
    </div>
  );
};
