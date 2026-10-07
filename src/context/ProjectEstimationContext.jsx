import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { estimateProject } from '../services/estimation/estimationEngine.js';
import { estimateApi } from '../services/estimateApi.js';
import { projectApi } from '../services/projectApi.js';

const ProjectEstimationContext = createContext();

const DRAFT_STORAGE_KEY = 'estimateai_draft_v6';
const ESTIMATION_STORAGE_KEY = 'estimateai_last_estimation_v6';

import {
  FOOD_DELIVERY_DEMO_PROJECT,
  FOOD_DELIVERY_DEMO_FEATURES,
  ECOMMERCE_DEMO_PROJECT,
  ECOMMERCE_DEMO_FEATURES,
} from '../data/demoProjects.js';

export {
  FOOD_DELIVERY_DEMO_PROJECT,
  FOOD_DELIVERY_DEMO_FEATURES,
  ECOMMERCE_DEMO_PROJECT,
  ECOMMERCE_DEMO_FEATURES,
};

export const ProjectEstimationProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved'
  const [needsRecalculation, setNeedsRecalculation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Phase 6 Project & Version identity
  const [currentProjectId, setCurrentProjectId] = useState('prj_food_delivery_platform');
  const [currentVersionNumber, setCurrentVersionNumber] = useState(3);
  const [viewedHistoricalVersion, setViewedHistoricalVersion] = useState(null);

  // Initialize Project State (Default to Food Delivery Demo)
  const [project, setProject] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.project && parsed.project.name) return parsed.project;
      }
    } catch (e) {
      console.warn('Failed to parse draft project', e);
    }
    return FOOD_DELIVERY_DEMO_PROJECT;
  });

  // Initialize Features State
  const [features, setFeatures] = useState(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (Array.isArray(parsed.features) && parsed.features.length > 0) {
          return parsed.features;
        }
      }
    } catch (e) {
      console.warn('Failed to parse draft features', e);
    }
    return FOOD_DELIVERY_DEMO_FEATURES;
  });

  // Estimation Result State
  const [estimationResult, setEstimationResult] = useState(() => {
    try {
      const savedEst = localStorage.getItem(ESTIMATION_STORAGE_KEY);
      if (savedEst) return JSON.parse(savedEst);
    } catch (e) {
      console.warn('Failed to parse cached estimation', e);
    }
    try {
      return estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
    } catch (e) {
      return null;
    }
  });

  // Autosave Draft to localStorage
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({
            currentProjectId,
            currentVersionNumber,
            project,
            features,
            currentStep,
            hasUnsavedChanges,
            savedAt: new Date().toISOString(),
          })
        );
        setSaveStatus('saved');
      } catch (err) {
        console.error('Failed to save draft', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [project, features, currentStep, currentProjectId, currentVersionNumber, hasUnsavedChanges]);

  // Project update helper
  const updateProject = useCallback((fieldOrUpdates, value) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setProject((prev) => {
      if (typeof fieldOrUpdates === 'string') {
        return { ...prev, [fieldOrUpdates]: value };
      }
      return { ...prev, ...fieldOrUpdates };
    });
  }, []);

  const updateTechnology = useCallback((category, val) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setProject((prev) => ({
      ...prev,
      technology: {
        ...prev.technology,
        [category]: val,
      },
    }));
  }, []);

  const updateRequirements = useCallback((reqKey, val) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setProject((prev) => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [reqKey]: val,
      },
    }));
  }, []);

  // Feature operations
  const addFeature = useCallback((featureData) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setFeatures((prev) => {
      const newOrder = prev.length + 1;
      const newFeature = {
        id: `feat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: featureData.name.trim(),
        description: (featureData.description || '').trim(),
        category: featureData.category || 'Core Functionality',
        priority: featureData.priority || 'Must Have',
        dependencies: Array.isArray(featureData.dependencies) ? featureData.dependencies : [],
        source: featureData.source || 'User Edited',
        order: newOrder,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newFeature];
    });
  }, []);

  const addFeaturesBulk = useCallback((newFeatureList = []) => {
    if (!newFeatureList || !newFeatureList.length) return;
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setFeatures((prev) => {
      let currentOrder = prev.length;
      const formatted = newFeatureList.map((f) => {
        currentOrder++;
        return {
          id: f.id || `feat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: f.name.trim(),
          description: (f.description || '').trim(),
          category: f.category || 'Core Functionality',
          priority: f.priority || 'Must Have',
          complexityLevel: f.complexityLevel || 'Medium',
          dependencies: Array.isArray(f.dependencies) ? f.dependencies : [],
          source: f.source || 'AI Requirement Extraction',
          order: currentOrder,
          createdAt: new Date().toISOString(),
        };
      });
      return [...prev, ...formatted];
    });
  }, []);

  const updateFeature = useCallback((id, updates) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, source: 'User Edited' } : f))
    );
  }, []);

  const deleteFeature = useCallback((id) => {
    setNeedsRecalculation(true);
    setHasUnsavedChanges(true);
    setFeatures((prev) => {
      const filtered = prev.filter((f) => f.id !== id);
      return filtered.map((f, idx) => ({ ...f, order: idx + 1 }));
    });
  }, []);

  const moveFeature = useCallback((id, direction) => {
    setHasUnsavedChanges(true);
    setFeatures((prev) => {
      const index = prev.findIndex((f) => f.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const newFeatures = [...prev];
      const temp = newFeatures[index];
      newFeatures[index] = newFeatures[targetIndex];
      newFeatures[targetIndex] = temp;

      return newFeatures.map((f, i) => ({ ...f, order: i + 1 }));
    });
  }, []);

  // Recalculate / Run Estimation Engine (Deterministic via estimateApi)
  const runEstimation = useCallback(async () => {
    if (!project || !features || features.length === 0) {
      throw new Error('Project and at least one feature are required for estimation.');
    }

    const result = await estimateApi.calculateEstimate(project, features);
    setEstimationResult(result);
    setNeedsRecalculation(false);
    // Note: hasUnsavedChanges remains true until explicitly saved as a version!

    try {
      localStorage.setItem(ESTIMATION_STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      console.error('Failed to cache estimation result', e);
    }

    return result;
  }, [project, features]);

  // Phase 6: Save Current Calculation as a New Immutable Version
  const saveCurrentAsNewVersion = useCallback(
    async ({ notes = '', createdBy = 'Lead Architect' } = {}) => {
      if (!estimationResult) {
        throw new Error('No calculated estimate available to save.');
      }

      // Ensure we have a project ID
      let targetProjId = currentProjectId;
      if (!targetProjId) {
        const createdProj = await projectApi.createProject({
          name: project.name || 'Untitled Project',
          description: project.description,
          projectType: project.projectType,
          domain: project.domain,
          project,
          features,
        });
        targetProjId = createdProj.id;
        setCurrentProjectId(targetProjId);
      }

      // Save immutable version snapshot
      const savedVersion = await projectApi.saveEstimateVersion(targetProjId, {
        inputSnapshot: {
          project: JSON.parse(JSON.stringify(project)),
          features: JSON.parse(JSON.stringify(features)),
        },
        outputSnapshot: JSON.parse(JSON.stringify(estimationResult)),
        notes,
        createdBy,
      });

      setCurrentVersionNumber(savedVersion.versionNumber);
      setHasUnsavedChanges(false);
      setNeedsRecalculation(false);

      return savedVersion;
    },
    [currentProjectId, project, features, estimationResult]
  );

  // Phase 6: Load a project from storage
  const loadProject = useCallback(async (projectId) => {
    const proj = await projectApi.getProjectById(projectId);
    setCurrentProjectId(proj.id);
    setCurrentVersionNumber(proj.latestVersionNumber || 1);
    setViewedHistoricalVersion(null);

    const inputDraft = proj.inputDraft || {};
    if (inputDraft.project) {
      setProject(inputDraft.project);
    }
    if (Array.isArray(inputDraft.features)) {
      setFeatures(inputDraft.features);
    }

    // Load latest version's outputSnapshot or compute it
    if (proj.versions && proj.versions.length > 0) {
      const latestVer = proj.versions[0];
      setEstimationResult(latestVer.outputSnapshot);
    } else if (inputDraft.project && inputDraft.features?.length > 0) {
      const res = estimateProject(inputDraft.project, inputDraft.features);
      setEstimationResult(res);
    }

    setHasUnsavedChanges(false);
    setNeedsRecalculation(false);
  }, []);

  // Phase 6: Use a historical version as starting point (Cloning without mutating history)
  const useVersionAsStartingPoint = useCallback((version) => {
    if (!version || !version.inputSnapshot) {
      throw new Error('Invalid version snapshot.');
    }

    const clonedProject = JSON.parse(JSON.stringify(version.inputSnapshot.project || {}));
    const clonedFeatures = JSON.parse(JSON.stringify(version.inputSnapshot.features || []));

    setProject(clonedProject);
    setFeatures(clonedFeatures);
    setViewedHistoricalVersion(null);
    setHasUnsavedChanges(true);
    setNeedsRecalculation(true);

    // Calculate temporary scenario result
    try {
      const temporaryCalc = estimateProject(clonedProject, clonedFeatures);
      setEstimationResult(temporaryCalc);
    } catch (e) {
      console.warn('Initial recalculation error on starting point clone', e);
    }
  }, []);

  // Phase 6: View a historical version in readonly snapshot mode
  const viewHistoricalVersion = useCallback((version) => {
    setViewedHistoricalVersion(version);
  }, []);

  const clearHistoricalView = useCallback(() => {
    setViewedHistoricalVersion(null);
  }, []);

  // Load demo presets
  const loadDemoPreset = useCallback((presetName = 'food-delivery') => {
    if (presetName === 'ecommerce') {
      setCurrentProjectId('prj_ecommerce_omnichannel');
      setCurrentVersionNumber(1);
      setProject(ECOMMERCE_DEMO_PROJECT);
      setFeatures(ECOMMERCE_DEMO_FEATURES);
      const res = estimateProject(ECOMMERCE_DEMO_PROJECT, ECOMMERCE_DEMO_FEATURES);
      setEstimationResult(res);
    } else {
      setCurrentProjectId('prj_food_delivery_platform');
      setCurrentVersionNumber(3);
      setProject(FOOD_DELIVERY_DEMO_PROJECT);
      setFeatures(FOOD_DELIVERY_DEMO_FEATURES);
      const res = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES);
      setEstimationResult(res);
    }
    setViewedHistoricalVersion(null);
    setHasUnsavedChanges(false);
    setNeedsRecalculation(false);
  }, []);

  const resetDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(ESTIMATION_STORAGE_KEY);
    setCurrentProjectId('prj_food_delivery_platform');
    setCurrentVersionNumber(3);
    setViewedHistoricalVersion(null);
    setProject(FOOD_DELIVERY_DEMO_PROJECT);
    setFeatures(FOOD_DELIVERY_DEMO_FEATURES);
    setCurrentStep(1);
    setSaveStatus('saved');
    setHasUnsavedChanges(false);
    setNeedsRecalculation(false);
    setEstimationResult(estimateProject(FOOD_DELIVERY_DEMO_PROJECT, FOOD_DELIVERY_DEMO_FEATURES));
  }, []);

  return (
    <ProjectEstimationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        currentProjectId,
        setCurrentProjectId,
        currentVersionNumber,
        setCurrentVersionNumber,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        viewedHistoricalVersion,
        viewHistoricalVersion,
        clearHistoricalView,
        project,
        updateProject,
        updateTechnology,
        updateRequirements,
        features,
        setFeatures,
        addFeature,
        addFeaturesBulk,
        updateFeature,
        deleteFeature,
        moveFeature,
        saveStatus,
        needsRecalculation,
        resetDraft,
        loadDemoPreset,
        loadProject,
        useVersionAsStartingPoint,
        saveCurrentAsNewVersion,
        estimationResult,
        runEstimation,
      }}
    >
      {children}
    </ProjectEstimationContext.Provider>
  );
};

export const useProjectEstimation = () => {
  const context = useContext(ProjectEstimationContext);
  if (!context) {
    throw new Error('useProjectEstimation must be used within a ProjectEstimationProvider');
  }
  return context;
};
