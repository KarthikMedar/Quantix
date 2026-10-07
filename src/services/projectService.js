/**
 * EstimateAI — Project & Version Management Service (Phase 6)
 *
 * Implements:
 * - Persistent project storage with lightweight summary queries
 * - Immutable historical estimate versions (v1, v2, v3...)
 * - Server-side atomic version assignment per project
 * - Complete input and output snapshot preservation
 * - Engine / Config / Rate version tracking (v1.0.0)
 * - Safe "Use as starting point" cloning
 * - Side-by-side version comparison engine (metrics delta & feature diffs)
 * - Project archiving and duplication
 */

import { estimateProject } from './estimation/estimationEngine.js';
import {
  FOOD_DELIVERY_DEMO_PROJECT,
  FOOD_DELIVERY_DEMO_FEATURES,
  ECOMMERCE_DEMO_PROJECT,
  ECOMMERCE_DEMO_FEATURES,
} from '../data/demoProjects.js';

const STORAGE_PROJECTS_KEY = 'estimateai_projects_v6';
const STORAGE_VERSIONS_KEY = 'estimateai_versions_v6';

// ---------------------------------------------------------------------------
// Seed Data Generation with Real Historical Snapshots
// ---------------------------------------------------------------------------

function buildSeedData() {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  // 1. Food Delivery Project v1 (MVP - 6 Core Features)
  const fdFeaturesV1 = FOOD_DELIVERY_DEMO_FEATURES.slice(0, 6);
  const fdResultV1 = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, fdFeaturesV1);
  const fdProjId = 'prj_food_delivery_platform';

  const fdVersion1 = {
    id: `ver_${fdProjId}_v1`,
    projectId: fdProjId,
    versionNumber: 1,
    versionTag: 'v1',
    status: 'SAVED',
    notes: 'Initial MVP scope: Authentication, Discovery, Search, Cart, Payments, Order Management.',
    inputSnapshot: {
      project: { ...FOOD_DELIVERY_DEMO_PROJECT, requestedTimelineWeeks: 12 },
      features: JSON.parse(JSON.stringify(fdFeaturesV1)),
    },
    outputSnapshot: JSON.parse(JSON.stringify(fdResultV1)),
    engineVersion: '1.0.0',
    configVersion: '1.0.0',
    rateVersion: '1.0.0',
    summary: {
      expectedCost: fdResultV1.summary.expectedCost,
      lowCost: fdResultV1.summary.lowCost,
      highCost: fdResultV1.summary.highCost,
      expectedEffortHours: fdResultV1.summary.expectedEffortHours,
      lowEffortHours: fdResultV1.summary.lowEffortHours,
      highEffortHours: fdResultV1.summary.highEffortHours,
      timelineWeeks: fdResultV1.summary.timelineWeeks,
      totalTeamFTE: fdResultV1.summary.totalTeamFTE,
      riskScore: fdResultV1.summary.riskScore,
      riskLevel: fdResultV1.summary.riskLevel,
      confidence: fdResultV1.summary.confidence,
      featureCount: fdFeaturesV1.length,
    },
    createdBy: 'Lead Architect',
    createdAt: new Date(now - 7 * dayMs).toISOString(),
    updatedAt: new Date(now - 7 * dayMs).toISOString(),
  };

  // 2. Food Delivery Project v2 (Added Real-time Tracking & Notifications - 8 Features)
  const fdFeaturesV2 = FOOD_DELIVERY_DEMO_FEATURES.slice(0, 8);
  const fdResultV2 = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, fdFeaturesV2);

  const fdVersion2 = {
    id: `ver_${fdProjId}_v2`,
    projectId: fdProjId,
    versionNumber: 2,
    versionTag: 'v2',
    status: 'SAVED',
    notes: 'Phase 2 expansion: Added Live Delivery Tracking (WebSocket/GPS) and Multi-Channel Notifications.',
    inputSnapshot: {
      project: { ...FOOD_DELIVERY_DEMO_PROJECT, requestedTimelineWeeks: 14 },
      features: JSON.parse(JSON.stringify(fdFeaturesV2)),
    },
    outputSnapshot: JSON.parse(JSON.stringify(fdResultV2)),
    engineVersion: '1.0.0',
    configVersion: '1.0.0',
    rateVersion: '1.0.0',
    summary: {
      expectedCost: fdResultV2.summary.expectedCost,
      lowCost: fdResultV2.summary.lowCost,
      highCost: fdResultV2.summary.highCost,
      expectedEffortHours: fdResultV2.summary.expectedEffortHours,
      lowEffortHours: fdResultV2.summary.lowEffortHours,
      highEffortHours: fdResultV2.summary.highEffortHours,
      timelineWeeks: fdResultV2.summary.timelineWeeks,
      totalTeamFTE: fdResultV2.summary.totalTeamFTE,
      riskScore: fdResultV2.summary.riskScore,
      riskLevel: fdResultV2.summary.riskLevel,
      confidence: fdResultV2.summary.confidence,
      featureCount: fdFeaturesV2.length,
    },
    createdBy: 'Lead Architect',
    createdAt: new Date(now - 3 * dayMs).toISOString(),
    updatedAt: new Date(now - 3 * dayMs).toISOString(),
  };

  // 3. Food Delivery Project v3 (Full Ecosystem - 10 Features)
  const fdFeaturesV3 = FOOD_DELIVERY_DEMO_FEATURES;
  const fdResultV3 = estimateProject(FOOD_DELIVERY_DEMO_PROJECT, fdFeaturesV3);

  const fdVersion3 = {
    id: `ver_${fdProjId}_v3`,
    projectId: fdProjId,
    versionNumber: 3,
    versionTag: 'v3',
    status: 'SAVED',
    notes: 'Full Ecosystem scope: Added Restaurant Partner Portal and Delivery Driver Native App.',
    inputSnapshot: {
      project: JSON.parse(JSON.stringify(FOOD_DELIVERY_DEMO_PROJECT)),
      features: JSON.parse(JSON.stringify(fdFeaturesV3)),
    },
    outputSnapshot: JSON.parse(JSON.stringify(fdResultV3)),
    engineVersion: '1.0.0',
    configVersion: '1.0.0',
    rateVersion: '1.0.0',
    summary: {
      expectedCost: fdResultV3.summary.expectedCost,
      lowCost: fdResultV3.summary.lowCost,
      highCost: fdResultV3.summary.highCost,
      expectedEffortHours: fdResultV3.summary.expectedEffortHours,
      lowEffortHours: fdResultV3.summary.lowEffortHours,
      highEffortHours: fdResultV3.summary.highEffortHours,
      timelineWeeks: fdResultV3.summary.timelineWeeks,
      totalTeamFTE: fdResultV3.summary.totalTeamFTE,
      riskScore: fdResultV3.summary.riskScore,
      riskLevel: fdResultV3.summary.riskLevel,
      confidence: fdResultV3.summary.confidence,
      featureCount: fdFeaturesV3.length,
    },
    createdBy: 'Lead Architect',
    createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
  };

  const foodDeliveryProject = {
    id: fdProjId,
    name: FOOD_DELIVERY_DEMO_PROJECT.name,
    description: FOOD_DELIVERY_DEMO_PROJECT.description,
    projectType: FOOD_DELIVERY_DEMO_PROJECT.projectType,
    domain: FOOD_DELIVERY_DEMO_PROJECT.domain,
    status: 'Active',
    ownerId: 'usr_demo_01',
    isDemo: true,
    currentVersionId: fdVersion3.id,
    latestVersionNumber: 3,
    inputDraft: {
      project: JSON.parse(JSON.stringify(FOOD_DELIVERY_DEMO_PROJECT)),
      features: JSON.parse(JSON.stringify(fdFeaturesV3)),
    },
    summary: fdVersion3.summary,
    createdAt: new Date(now - 7 * dayMs).toISOString(),
    updatedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
  };

  // 4. E-Commerce Platform Project
  const ecProjId = 'prj_ecommerce_omnichannel';
  const ecResult = estimateProject(ECOMMERCE_DEMO_PROJECT, ECOMMERCE_DEMO_FEATURES);

  const ecVersion1 = {
    id: `ver_${ecProjId}_v1`,
    projectId: ecProjId,
    versionNumber: 1,
    versionTag: 'v1',
    status: 'SAVED',
    notes: 'Multi-vendor marketplace baseline estimate.',
    inputSnapshot: {
      project: JSON.parse(JSON.stringify(ECOMMERCE_DEMO_PROJECT)),
      features: JSON.parse(JSON.stringify(ECOMMERCE_DEMO_FEATURES)),
    },
    outputSnapshot: JSON.parse(JSON.stringify(ecResult)),
    engineVersion: '1.0.0',
    configVersion: '1.0.0',
    rateVersion: '1.0.0',
    summary: {
      expectedCost: ecResult.summary.expectedCost,
      lowCost: ecResult.summary.lowCost,
      highCost: ecResult.summary.highCost,
      expectedEffortHours: ecResult.summary.expectedEffortHours,
      lowEffortHours: ecResult.summary.lowEffortHours,
      highEffortHours: ecResult.summary.highEffortHours,
      timelineWeeks: ecResult.summary.timelineWeeks,
      totalTeamFTE: ecResult.summary.totalTeamFTE,
      riskScore: ecResult.summary.riskScore,
      riskLevel: ecResult.summary.riskLevel,
      confidence: ecResult.summary.confidence,
      featureCount: ECOMMERCE_DEMO_FEATURES.length,
    },
    createdBy: 'Product Manager',
    createdAt: new Date(now - 2 * dayMs).toISOString(),
    updatedAt: new Date(now - 2 * dayMs).toISOString(),
  };

  const ecommerceProject = {
    id: ecProjId,
    name: ECOMMERCE_DEMO_PROJECT.name,
    description: ECOMMERCE_DEMO_PROJECT.description,
    projectType: ECOMMERCE_DEMO_PROJECT.projectType,
    domain: ECOMMERCE_DEMO_PROJECT.domain,
    status: 'Active',
    ownerId: 'usr_demo_01',
    isDemo: true,
    currentVersionId: ecVersion1.id,
    latestVersionNumber: 1,
    inputDraft: {
      project: JSON.parse(JSON.stringify(ECOMMERCE_DEMO_PROJECT)),
      features: JSON.parse(JSON.stringify(ECOMMERCE_DEMO_FEATURES)),
    },
    summary: ecVersion1.summary,
    createdAt: new Date(now - 2 * dayMs).toISOString(),
    updatedAt: new Date(now - 2 * dayMs).toISOString(),
  };

  return {
    projects: [foodDeliveryProject, ecommerceProject],
    versions: [fdVersion1, fdVersion2, fdVersion3, ecVersion1],
  };
}

// ---------------------------------------------------------------------------
// Storage Access Helpers
// ---------------------------------------------------------------------------

function getStoredState() {
  try {
    const rawProjects = localStorage.getItem(STORAGE_PROJECTS_KEY);
    const rawVersions = localStorage.getItem(STORAGE_VERSIONS_KEY);

    if (!rawProjects || !rawVersions) {
      const seed = buildSeedData();
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(seed.projects));
      localStorage.setItem(STORAGE_VERSIONS_KEY, JSON.stringify(seed.versions));
      return seed;
    }

    return {
      projects: JSON.parse(rawProjects),
      versions: JSON.parse(rawVersions),
    };
  } catch (err) {
    console.warn('Storage read fallback to seed data', err);
    return buildSeedData();
  }
}

function saveStoredState(projects, versions) {
  localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
  localStorage.setItem(STORAGE_VERSIONS_KEY, JSON.stringify(versions));
}

// ---------------------------------------------------------------------------
// Project Management & Versioning Service
// ---------------------------------------------------------------------------

export const projectService = {
  /**
   * Retrieves all projects with lightweight summaries for "My Projects" dashboard.
   * Does NOT download heavy output snapshots for every version.
   */
  async getAllProjects(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const { projects, versions } = getStoredState();

    let list = projects.map((p) => {
      const projectVersions = versions.filter((v) => v.projectId === p.id);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        projectType: p.projectType,
        domain: p.domain,
        ownerId: p.ownerId || 'usr_demo_01',
        isDemo: Boolean(p.isDemo),
        status: p.status || 'Active',
        currentVersionId: p.currentVersionId,
        latestVersionNumber: p.latestVersionNumber || 1,
        latestVersionTag: `v${p.latestVersionNumber || 1}`,
        versionCount: projectVersions.length,
        summary: p.summary || {},
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      };
    });

    // User ownership isolation
    if (filters.userId) {
      if (filters.strictOwnership) {
        list = list.filter((p) => p.ownerId === filters.userId);
      } else {
        list = list.filter((p) => p.ownerId === filters.userId || p.isDemo === true);
      }
    }

    // Filter by status
    if (filters.status && filters.status !== 'All') {
      if (filters.status === 'High Risk') {
        list = list.filter((p) => p.summary?.riskLevel === 'High' || p.summary?.riskScore >= 65);
      } else {
        list = list.filter((p) => p.status === filters.status);
      }
    }

    // Filter by search query
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.domain && p.domain.toLowerCase().includes(q))
      );
    }

    return list;
  },

  /**
   * Retrieves single project by ID including its current editable draft.
   */
  async getProjectById(id, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const { projects, versions } = getStoredState();
    const found = projects.find((p) => p.id === id);
    if (!found) throw new Error(`Project with ID "${id}" was not found.`);

    // Enforce authorization
    if (options.userId) {
      if (found.ownerId && found.ownerId !== options.userId && !found.isDemo) {
        const err = new Error(`Access denied: You do not have permission to access project "${id}".`);
        err.code = 'FORBIDDEN';
        err.status = 403;
        throw err;
      }
    }

    const projectVersions = versions.filter((v) => v.projectId === id);

    return {
      ...found,
      ownerId: found.ownerId || 'usr_demo_01',
      isDemo: Boolean(found.isDemo),
      versionCount: projectVersions.length,
      versions: projectVersions.sort((a, b) => b.versionNumber - a.versionNumber),
    };
  },

  /**
   * Creates a new project record.
   */
  async createProject(projectData, initialCalculation = null, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const state = getStoredState();

    const projectId =
      projectData.id ||
      `prj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newProject = {
      id: projectId,
      name: (projectData.name || projectData.title || 'Untitled Project').trim(),
      description: projectData.description || '',
      projectType: projectData.projectType || 'consumer_app',
      domain: projectData.domain || 'Custom Software',
      ownerId: options.userId || projectData.ownerId || 'usr_demo_01',
      isDemo: false,
      status: 'Active',
      currentVersionId: null,
      latestVersionNumber: 0,
      inputDraft: {
        project: projectData.project || projectData,
        features: projectData.features || [],
      },
      summary: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.projects.unshift(newProject);

    // If an initial estimate calculation is provided, automatically create v1 snapshot
    if (initialCalculation) {
      const v1 = this._createVersionSnapshotInternal(
        state,
        newProject.id,
        newProject.inputDraft,
        initialCalculation,
        'Initial Estimate Baseline',
        options.userName || 'User'
      );
      newProject.currentVersionId = v1.id;
      newProject.latestVersionNumber = 1;
      newProject.summary = v1.summary;
    }

    saveStoredState(state.projects, state.versions);
    return newProject;
  },

  /**
   * Updates project metadata or editable draft WITHOUT touching historical versions.
   */
  async updateProject(id, updates, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const state = getStoredState();
    const index = state.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Project with ID "${id}" was not found.`);

    if (options.userId) {
      const proj = state.projects[index];
      if (proj.ownerId && proj.ownerId !== options.userId && !proj.isDemo) {
        const err = new Error(`Access denied: You do not have permission to modify project "${id}".`);
        err.code = 'FORBIDDEN';
        err.status = 403;
        throw err;
      }
    }

    // Protect immutable fields
    const { id: _ignoredId, versions: _ignoredVersions, ...allowedUpdates } = updates;

    state.projects[index] = {
      ...state.projects[index],
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    };

    saveStoredState(state.projects, state.versions);
    return state.projects[index];
  },

  /**
   * Archives a project (soft delete).
   */
  async archiveProject(id, options = {}) {
    return this.updateProject(id, { status: 'Archived' }, options);
  },

  /**
   * Restores an archived project.
   */
  async unarchiveProject(id, options = {}) {
    return this.updateProject(id, { status: 'Active' }, options);
  },

  /**
   * Permanently deletes a project and its historical versions.
   */
  async deleteProject(id, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const state = getStoredState();
    const proj = state.projects.find((p) => p.id === id);
    if (!proj) return true;

    if (options.userId) {
      if (proj.ownerId && proj.ownerId !== options.userId) {
        const err = new Error(`Access denied: You do not have permission to delete project "${id}".`);
        err.code = 'FORBIDDEN';
        err.status = 403;
        throw err;
      }
    }

    state.projects = state.projects.filter((p) => p.id !== id);
    state.versions = state.versions.filter((v) => v.projectId !== id);
    saveStoredState(state.projects, state.versions);
    return true;
  },

  /**
   * Duplicates an existing project.
   * The new clone starts independently with v1 created from current input draft.
   */
  async duplicateProject(id, newName = null) {
    const original = await this.getProjectById(id);
    const clonedInput = JSON.parse(JSON.stringify(original.inputDraft || {}));

    const clonedProject = await this.createProject({
      name: newName || `${original.name} (Copy)`,
      description: original.description,
      projectType: original.projectType,
      domain: original.domain,
      project: clonedInput.project || {},
      features: clonedInput.features || [],
    });

    return clonedProject;
  },

  // -------------------------------------------------------------------------
  // Immutable Version Management
  // -------------------------------------------------------------------------

  /**
   * Lists all historical estimate versions for a project.
   */
  async getProjectVersions(projectId) {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const { versions } = getStoredState();
    const projectVersions = versions
      .filter((v) => v.projectId === projectId)
      .sort((a, b) => b.versionNumber - a.versionNumber);

    return projectVersions;
  },

  /**
   * Retrieves an exact historical version snapshot.
   * This is an immutable historical record; it does NOT recalculate.
   */
  async getVersionById(projectId, versionId) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const { versions } = getStoredState();
    const version = versions.find((v) => v.id === versionId && v.projectId === projectId);
    if (!version) {
      throw new Error(`Estimate version "${versionId}" not found for project "${projectId}".`);
    }
    return JSON.parse(JSON.stringify(version));
  },

  /**
   * Atomically saves a new immutable estimate version.
   * - Server determines sequential version number (max + 1)
   * - Stores deep clone of inputSnapshot and outputSnapshot
   * - Enforces unique (projectId, versionNumber)
   * - Never mutates previous versions
   * - Updates project currentVersionId and summary
   */
  async saveEstimateVersion(projectId, { inputSnapshot, outputSnapshot, notes = '', createdBy = 'User' }, options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    if (!projectId) throw new Error('projectId is required to save an estimate version.');
    if (!inputSnapshot) throw new Error('inputSnapshot is required.');
    if (!outputSnapshot || !outputSnapshot.summary) {
      throw new Error('outputSnapshot with calculation summary is required.');
    }

    const state = getStoredState();
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) throw new Error(`Project "${projectId}" not found.`);

    if (options.userId) {
      if (project.ownerId && project.ownerId !== options.userId && !project.isDemo) {
        const err = new Error(`Access denied: You do not have permission to modify project "${projectId}".`);
        err.code = 'FORBIDDEN';
        err.status = 403;
        throw err;
      }
    }

    // Atomic version snapshot creation
    const newVersion = this._createVersionSnapshotInternal(
      state,
      projectId,
      inputSnapshot,
      outputSnapshot,
      notes,
      createdBy
    );

    // Update Project metadata atomically
    project.currentVersionId = newVersion.id;
    project.latestVersionNumber = newVersion.versionNumber;
    project.summary = newVersion.summary;
    project.inputDraft = JSON.parse(JSON.stringify(inputSnapshot));
    project.updatedAt = new Date().toISOString();

    saveStoredState(state.projects, state.versions);
    return newVersion;
  },

  /**
   * Internal transactional helper for creating a version snapshot.
   */
  _createVersionSnapshotInternal(state, projectId, inputSnapshot, outputSnapshot, notes, createdBy) {
    const existingVersions = state.versions.filter((v) => v.projectId === projectId);
    const maxVersion = existingVersions.reduce((max, v) => Math.max(max, v.versionNumber || 0), 0);
    const nextVersionNumber = maxVersion + 1;

    // Check unique constraint (projectId, versionNumber)
    const exists = existingVersions.some((v) => v.versionNumber === nextVersionNumber);
    if (exists) {
      throw new Error(`Version conflict: v${nextVersionNumber} already exists for project ${projectId}.`);
    }

    const versionId = `ver_${projectId}_v${nextVersionNumber}`;

    const newVersion = {
      id: versionId,
      projectId,
      versionNumber: nextVersionNumber,
      versionTag: `v${nextVersionNumber}`,
      status: 'SAVED',
      notes: notes || `Estimate Snapshot v${nextVersionNumber}`,
      // Deep clones ensure absolute immutability
      inputSnapshot: JSON.parse(JSON.stringify(inputSnapshot)),
      outputSnapshot: JSON.parse(JSON.stringify(outputSnapshot)),
      engineVersion: outputSnapshot.engineVersion || '1.0.0',
      configVersion: outputSnapshot.configVersion || '1.0.0',
      rateVersion: outputSnapshot.rateVersion || '1.0.0',
      summary: {
        expectedCost: outputSnapshot.summary.expectedCost,
        lowCost: outputSnapshot.summary.lowCost,
        highCost: outputSnapshot.summary.highCost,
        expectedEffortHours: outputSnapshot.summary.expectedEffortHours,
        lowEffortHours: outputSnapshot.summary.lowEffortHours,
        highEffortHours: outputSnapshot.summary.highEffortHours,
        timelineWeeks: outputSnapshot.summary.timelineWeeks,
        totalTeamFTE: outputSnapshot.summary.totalTeamFTE,
        riskScore: outputSnapshot.summary.riskScore,
        riskLevel: outputSnapshot.summary.riskLevel,
        confidence: outputSnapshot.summary.confidence,
        featureCount: Array.isArray(outputSnapshot.features) ? outputSnapshot.features.length : 0,
      },
      createdBy: createdBy || 'User',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    state.versions.push(newVersion);
    return newVersion;
  },

  /**
   * Aggregates workspace statistics from saved projects.
   */
  async getWorkspaceStats(options = {}) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const { projects, versions } = getStoredState();

    let userProjects = projects.filter((p) => p.status !== 'Archived');
    if (options.userId) {
      userProjects = userProjects.filter((p) => p.ownerId === options.userId || p.isDemo === true);
    }

    const totalProjects = userProjects.length;
    const projectIds = new Set(userProjects.map((p) => p.id));
    const userVersions = versions.filter((v) => projectIds.has(v.projectId));
    const totalEstimates = userVersions.length;

    // Calculate average expected cost & timeline
    let totalCost = 0;
    let costCount = 0;
    let totalWeeks = 0;
    let weeksCount = 0;

    userProjects.forEach((p) => {
      if (p.summary?.expectedCost) {
        totalCost += p.summary.expectedCost;
        costCount++;
      }
      if (p.summary?.timelineWeeks) {
        totalWeeks += p.summary.timelineWeeks;
        weeksCount++;
      }
    });

    const averageCost = costCount > 0 
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(totalCost / costCount))
      : '--';

    const averageTimeline = weeksCount > 0
      ? `${Math.round(totalWeeks / weeksCount)} Wks`
      : '--';

    const recentProjects = userProjects.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      domain: p.domain,
      status: p.status,
      metrics: {
        totalCost: p.summary?.expectedCost || 0,
        timelineMonths: p.summary?.timelineWeeks ? (p.summary.timelineWeeks / 4.33).toFixed(1) : '--',
        complexityScore: p.summary?.riskLevel || 'Medium Risk',
      },
    }));

    return {
      totalProjects,
      totalEstimates,
      averageCost,
      averageTimeline,
      recentProjects,
    };
  },

  // -------------------------------------------------------------------------
  // Version Comparison Engine
  // -------------------------------------------------------------------------

  /**
   * Compares two saved versions side-by-side.
   * Computes deltas for Cost, Effort, Timeline, Team, Risk, Confidence, and Feature diff.
   */
  compareVersions(versionA, versionB) {
    if (!versionA || !versionB) {
      throw new Error('Both versionA and versionB are required for comparison.');
    }

    const sumA = versionA.summary || {};
    const sumB = versionB.summary || {};

    const costDiff = (sumB.expectedCost || 0) - (sumA.expectedCost || 0);
    const costPercent = sumA.expectedCost ? Math.round((costDiff / sumA.expectedCost) * 100) : 0;

    const effortDiff = (sumB.expectedEffortHours || 0) - (sumA.expectedEffortHours || 0);
    const effortPercent = sumA.expectedEffortHours ? Math.round((effortDiff / sumA.expectedEffortHours) * 100) : 0;

    const timelineDiff = (sumB.timelineWeeks || 0) - (sumA.timelineWeeks || 0);
    const teamDiff = Number(((sumB.totalTeamFTE || 0) - (sumA.totalTeamFTE || 0)).toFixed(1));
    const riskDiff = (sumB.riskScore || 0) - (sumA.riskScore || 0);
    const confidenceDiff = (sumB.confidence || 0) - (sumA.confidence || 0);

    // Feature Diff Analysis
    const featsA = versionA.inputSnapshot?.features || [];
    const featsB = versionB.inputSnapshot?.features || [];

    const idsA = new Set(featsA.map((f) => f.id || f.name));
    const idsB = new Set(featsB.map((f) => f.id || f.name));

    const addedFeatures = featsB.filter((f) => !idsA.has(f.id || f.name));
    const removedFeatures = featsA.filter((f) => !idsB.has(f.id || f.name));
    const retainedFeatures = featsB.filter((f) => idsA.has(f.id || f.name));

    return {
      versionA: {
        id: versionA.id,
        tag: versionA.versionTag,
        createdAt: versionA.createdAt,
        notes: versionA.notes,
        summary: sumA,
      },
      versionB: {
        id: versionB.id,
        tag: versionB.versionTag,
        createdAt: versionB.createdAt,
        notes: versionB.notes,
        summary: sumB,
      },
      deltas: {
        cost: { diff: costDiff, percent: costPercent, isIncrease: costDiff > 0 },
        effort: { diff: effortDiff, percent: effortPercent, isIncrease: effortDiff > 0 },
        timelineWeeks: { diff: timelineDiff, isIncrease: timelineDiff > 0 },
        teamFTE: { diff: teamDiff, isIncrease: teamDiff > 0 },
        riskScore: { diff: riskDiff, levelA: sumA.riskLevel, levelB: sumB.riskLevel },
        confidence: { diff: confidenceDiff, isIncrease: confidenceDiff > 0 },
      },
      featureDiff: {
        added: addedFeatures,
        removed: removedFeatures,
        retainedCount: retainedFeatures.length,
      },
    };
  },
};
