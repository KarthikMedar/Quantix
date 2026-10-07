/**
 * EstimateAI — Project & Version API Client (Phase 6)
 *
 * Provides a clean Promise-based API for:
 * - Fetching projects list and summaries
 * - Managing immutable estimate versions (v1, v2, v3...)
 * - Saving estimate calculation snapshots
 * - Comparing historical versions side-by-side
 *
 * Communicates with backend endpoints (/api/projects) when available,
 * with seamless fallback to projectService.
 */

import { projectService } from './projectService.js';

export const projectApi = {
  /**
   * List all projects with optional search & status filter
   */
  async getAllProjects(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/projects${query ? `?${query}` : ''}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Backend not running on this route, fallback
    }
    return projectService.getAllProjects(filters);
  },

  /**
   * Get single project by ID with draft & version list
   */
  async getProjectById(id) {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.getProjectById(id);
  },

  /**
   * Create new project
   */
  async createProject(projectData, initialCalculation = null) {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectData, initialCalculation }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.createProject(projectData, initialCalculation);
  },

  /**
   * Update project draft/metadata
   */
  async updateProject(id, updates) {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.updateProject(id, updates);
  },

  /**
   * Archive project
   */
  async archiveProject(id) {
    return projectService.archiveProject(id);
  },

  /**
   * Unarchive project
   */
  async unarchiveProject(id) {
    return projectService.unarchiveProject(id);
  },

  /**
   * Delete project
   */
  async deleteProject(id) {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch (e) {
      // Fallback
    }
    return projectService.deleteProject(id);
  },

  /**
   * Duplicate project
   */
  async duplicateProject(id, newName = null) {
    return projectService.duplicateProject(id, newName);
  },

  /**
   * List all immutable versions for a project
   */
  async getProjectVersions(projectId) {
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.getProjectVersions(projectId);
  },

  /**
   * Retrieve single immutable version snapshot
   */
  async getVersionById(projectId, versionId) {
    try {
      const res = await fetch(`/api/projects/${projectId}/versions/${versionId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.getVersionById(projectId, versionId);
  },

  /**
   * Atomically save a new immutable estimate version
   */
  async saveEstimateVersion(projectId, { inputSnapshot, outputSnapshot, notes = '', createdBy = 'User' }) {
    try {
      const res = await fetch(`/api/projects/${projectId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputSnapshot, outputSnapshot, notes, createdBy }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback
    }
    return projectService.saveEstimateVersion(projectId, { inputSnapshot, outputSnapshot, notes, createdBy });
  },

  /**
   * Compare two saved versions
   */
  compareVersions(versionA, versionB) {
    return projectService.compareVersions(versionA, versionB);
  },

  /**
   * Workspace summary statistics
   */
  async getWorkspaceStats(options = {}) {
    return projectService.getWorkspaceStats(options);
  },
};
