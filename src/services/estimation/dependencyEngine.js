/**
 * Dependency & Critical Path Engine (Phase 4 Specification)
 * Deterministically analyzes feature dependency graphs:
 * 1. Cycle Detection (identifies circular dependencies)
 * 2. Critical Path Calculation (identifies the longest dependency chain by effort hours)
 * 3. Topological ordering and dependency levels
 *
 * NO RANDOM NUMBERS (Math.random) ARE USED.
 */

/**
 * Evaluates feature dependencies, circular dependencies, and the critical path.
 * @param {Array} features - Array of feature objects with id, name, dependencies, effortHours
 * @param {Number} effectiveTeamHoursPerWeek - Active team development capacity
 * @returns {Object} Structured dependency and critical path analysis
 */
export const analyzeDependenciesAndCriticalPath = (features = [], effectiveTeamHoursPerWeek = 120) => {
  if (!Array.isArray(features) || features.length === 0) {
    return {
      hasDependencies: false,
      hasCircularDependency: false,
      circularDependencyError: null,
      criticalPath: {
        features: [],
        totalHours: 0,
        totalWeeks: 0,
        chain: 'None',
        explanation: 'No dependencies defined; features can be executed independently.',
      },
      nodes: [],
      edges: [],
    };
  }

  // Create lookup maps by name and ID
  const featureByName = new Map();
  const featureById = new Map();
  const featureHours = new Map();

  features.forEach((f) => {
    const hours = f.estimatedEffortHours || f.threePoint?.expected || 40;
    featureByName.set(f.name.toLowerCase().trim(), f);
    featureById.set(f.id, f);
    featureHours.set(f.id, hours);
  });

  // Build Adjacency List: prerequisite -> dependent
  // feature.dependencies means "I depend on X", so edge goes from X to feature
  const adj = new Map(); // from -> [to]
  const inDegree = new Map();
  const allNodeIds = features.map((f) => f.id);

  allNodeIds.forEach((id) => {
    adj.set(id, []);
    inDegree.set(id, 0);
  });

  const edges = [];

  features.forEach((feat) => {
    const deps = feat.dependencies || [];
    deps.forEach((depNameOrId) => {
      // Find matching feature by name or ID
      const target =
        featureByName.get(depNameOrId.toLowerCase().trim()) ||
        featureById.get(depNameOrId);

      if (target && target.id !== feat.id) {
        adj.get(target.id).push(feat.id);
        inDegree.set(feat.id, (inDegree.get(feat.id) || 0) + 1);
        edges.push({
          from: target.id,
          fromName: target.name,
          to: feat.id,
          toName: feat.name,
        });
      }
    });
  });

  // 1. Cycle Detection (DFS with coloring: 0=unvisited, 1=visiting, 2=visited)
  const state = new Map(); // id -> 0 | 1 | 2
  allNodeIds.forEach((id) => state.set(id, 0));

  let hasCircularDependency = false;
  let cyclePath = [];

  const dfsCycle = (nodeId, currentPath) => {
    state.set(nodeId, 1);
    currentPath.push(nodeId);

    const neighbors = adj.get(nodeId) || [];
    for (const next of neighbors) {
      if (state.get(next) === 1) {
        // Cycle detected
        hasCircularDependency = true;
        const cycleStartIndex = currentPath.indexOf(next);
        cyclePath = [...currentPath.slice(cycleStartIndex), next].map(
          (id) => featureById.get(id)?.name || id
        );
        return true;
      }
      if (state.get(next) === 0) {
        if (dfsCycle(next, currentPath)) return true;
      }
    }

    state.set(nodeId, 2);
    currentPath.pop();
    return false;
  };

  for (const id of allNodeIds) {
    if (state.get(id) === 0) {
      if (dfsCycle(id, [])) break;
    }
  }

  if (hasCircularDependency) {
    return {
      hasDependencies: true,
      hasCircularDependency: true,
      circularDependencyError: `Circular dependency detected: ${cyclePath.join(' → ')}`,
      criticalPath: {
        features: [],
        totalHours: 0,
        totalWeeks: 0,
        chain: cyclePath.join(' → '),
        explanation: 'Calculation halted: circular dependency detected in the project requirements.',
      },
      nodes: features.map((f) => ({ id: f.id, name: f.name })),
      edges,
    };
  }

  // 2. Critical Path Calculation (Longest Path in DAG)
  // Find all paths from root nodes (inDegree === 0) to leaf nodes (outDegree === 0)
  const allPaths = [];

  const dfsPaths = (currId, currentPath, currentHours) => {
    const children = adj.get(currId) || [];
    if (children.length === 0) {
      allPaths.push({
        path: [...currentPath],
        hours: currentHours,
      });
      return;
    }

    children.forEach((childId) => {
      const childHours = featureHours.get(childId) || 0;
      dfsPaths(childId, [...currentPath, childId], currentHours + childHours);
    });
  };

  const rootNodes = allNodeIds.filter((id) => inDegree.get(id) === 0);

  rootNodes.forEach((rootId) => {
    const rootHours = featureHours.get(rootId) || 0;
    dfsPaths(rootId, [rootId], rootHours);
  });

  // Find path with maximum total hours
  let longestPath = { path: [], hours: 0 };
  allPaths.forEach((p) => {
    if (p.hours > longestPath.hours) {
      longestPath = p;
    }
  });

  // Fallback if no explicit dependency edges: critical path is the single heaviest feature
  if (longestPath.path.length === 0 && features.length > 0) {
    let heaviest = features[0];
    features.forEach((f) => {
      const h = featureHours.get(f.id) || 0;
      if (h > (featureHours.get(heaviest.id) || 0)) heaviest = f;
    });
    longestPath = {
      path: [heaviest.id],
      hours: featureHours.get(heaviest.id) || 40,
    };
  }

  const criticalFeatures = longestPath.path.map((id) => featureById.get(id)).filter(Boolean);
  const criticalPathChain = criticalFeatures.map((f) => f.name).join(' → ');
  const criticalWeeks = parseFloat((longestPath.hours / Math.max(30, effectiveTeamHoursPerWeek * 0.7)).toFixed(1));

  return {
    hasDependencies: edges.length > 0,
    hasCircularDependency: false,
    circularDependencyError: null,
    totalDependenciesCount: edges.length,
    criticalPath: {
      features: criticalFeatures.map((f) => ({
        id: f.id,
        name: f.name,
        hours: featureHours.get(f.id),
      })),
      featureCount: criticalFeatures.length,
      totalHours: longestPath.hours,
      totalWeeks: criticalWeeks,
      chain: criticalPathChain,
      explanation: 'The critical path represents the longest sequence of dependent features. Any delay in these items directly postpones the final project release.',
    },
    nodes: features.map((f) => ({
      id: f.id,
      name: f.name,
      hours: featureHours.get(f.id),
      isCritical: longestPath.path.includes(f.id),
    })),
    edges,
  };
};
