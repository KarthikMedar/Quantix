/**
 * Core Configuration & Mathematical Constants for EstimateAI Engine
 */

export const ESTIMATION_CONFIG = {
  // Versioning Metadata
  version: {
    engineVersion: '1.0.0',
    configVersion: '1.0.0',
    rateVersion: '1.0.0',
    rateTableName: 'India / Mid-Level IT Standards',
  },

  // Complexity Score Thresholds
  complexityThresholds: {
    low: { min: 0, max: 8, label: 'LOW', color: 'emerald' },
    medium: { min: 9, max: 16, label: 'MEDIUM', color: 'amber' },
    high: { min: 17, max: 25, label: 'HIGH', color: 'purple' },
    veryHigh: { min: 26, max: 45, label: 'VERY HIGH', color: 'rose' },
  },

  // Maximum possible score for 9 factors (each 0 to 5)
  maxFeatureScore: 45,

  // Working Hours & Schedule Standards
  workingHours: {
    hoursPerDay: 8, // Working day duration
    productiveHoursPerDay: 6, // Productive capacity (distinguished from team efficiency)
    daysPerWeek: 5,
    hoursPerWeek: 40,
    teamEfficiencyFactor: 0.75, // 75% parallel team efficiency
    productiveDevHoursPerMonth: 120, // 160 hrs gross × 0.75
  },

  // Effort Multipliers for Project Scope
  multipliers: {
    platformWeights: {
      single: 1.0,
      two: 1.25,
      threeOrMore: 1.5,
      crossPlatform: 1.2,
    },
    userScaleAdders: {
      small: 1.0,     // < 1,000
      medium: 1.15,   // 1,000 - 10,000
      large: 1.3,     // 10,000 - 100,000
      enterprise: 1.5,// 100,000+
    },
    securityMultipliers: {
      basic: 1.0,
      advanced: 1.2,
      financial: 1.4,
    },
    contingencyBufferPercentage: 0.10, // 10% risk contingency reserve
    correlationWideningFactor: 1.10, // 1.10 correlation factor for project-level PERT variance
    largeFeatureThresholdHours: 250, // Features > 250h trigger advisory split warning
    pmOverheadPercentage: 0.08, // 8% Project Management allocation
  },

  // Standard Software Delivery Phases
  phases: [
    {
      id: 'req_analysis',
      name: 'Requirement Analysis & Specs',
      order: 1,
      effortShare: 0.07,
      dependencies: [],
      roles: ['Business Analyst', 'Project Manager'],
      description: 'System boundary scoping, domain modeling, and technical acceptance specifications.',
    },
    {
      id: 'ui_ux_design',
      name: 'UI/UX Design & Prototyping',
      order: 2,
      effortShare: 0.13,
      dependencies: ['req_analysis'],
      roles: ['UI/UX Designer'],
      description: 'Wireframes, responsive layouts, component libraries, and interactive design prototypes.',
    },
    {
      id: 'db_architecture',
      name: 'Database & Schema Architecture',
      order: 3,
      effortShare: 0.08,
      dependencies: ['req_analysis'],
      roles: ['Backend Developer', 'Database Engineer'],
      description: 'Entity-relationship diagrams, migrations, indexing, and data access layer setup.',
    },
    {
      id: 'backend_dev',
      name: 'Backend Core & Business Logic',
      order: 4,
      effortShare: 0.28,
      dependencies: ['db_architecture'],
      roles: ['Backend Developer'],
      description: 'REST/GraphQL APIs, microservices, authentication logic, background workers, and validation rules.',
    },
    {
      id: 'frontend_dev',
      name: 'Frontend & Client App Engineering',
      order: 5,
      effortShare: 0.26,
      dependencies: ['ui_ux_design', 'backend_dev'],
      roles: ['Frontend Developer'],
      description: 'UI components, responsive pages, state management, API consumption, and caching.',
    },
    {
      id: 'integrations',
      name: 'Third-Party & API Integrations',
      order: 6,
      effortShare: 0.09,
      dependencies: ['backend_dev'],
      roles: ['Backend Developer', 'DevOps Engineer'],
      description: 'Webhooks, payment gateways, transactional email/SMS, external microservices, and OAuth.',
    },
    {
      id: 'qa_testing',
      name: 'QA Testing & Verification',
      order: 7,
      effortShare: 0.15,
      dependencies: ['frontend_dev', 'integrations'],
      roles: ['QA Engineer'],
      description: 'Unit testing, automated regression testing, end-to-end user journeys, and security scans.',
    },
    {
      id: 'devops_deployment',
      name: 'DevOps, CI/CD & Cloud Deployment',
      order: 8,
      effortShare: 0.06,
      dependencies: ['qa_testing'],
      roles: ['DevOps Engineer', 'Cloud Engineer'],
      description: 'Infrastructure-as-code, production container setup, SSL certs, logging, and monitoring.',
    },
    {
      id: 'buffer_stabilization',
      name: 'Release Buffer & Stabilization',
      order: 9,
      effortShare: 0.08,
      dependencies: ['devops_deployment'],
      roles: ['Project Manager', 'QA Engineer', 'Full Stack Developer'],
      description: 'UAT review, edge-case hardening, bug fixes, and post-launch smoke testing.',
    },
  ],
};
