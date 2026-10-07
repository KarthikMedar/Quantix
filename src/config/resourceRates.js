/**
 * Centralized Resource Rates Configuration (in INR)
 * Used across the EstimateAI Core Software Estimation Engine
 */

export const RESOURCE_RATES = {
  frontendDeveloper: {
    id: 'frontend_dev',
    title: 'Frontend Developer',
    hourlyRate: 700,
    category: 'Development',
    description: 'UI engineering, state management, client performance, responsive web & app views.',
  },
  backendDeveloper: {
    id: 'backend_dev',
    title: 'Backend Developer',
    hourlyRate: 800,
    category: 'Development',
    description: 'API development, business logic, microservices, auth flows, database schema design.',
  },
  fullStackDeveloper: {
    id: 'fullstack_dev',
    title: 'Full Stack Developer',
    hourlyRate: 850,
    category: 'Development',
    description: 'End-to-end feature delivery, integration glue, and cross-tier optimizations.',
  },
  uiUxDesigner: {
    id: 'ui_ux_designer',
    title: 'UI/UX Designer',
    hourlyRate: 600,
    category: 'Design',
    description: 'Wireframing, user journey maps, design systems, interactive Figma prototypes.',
  },
  qaEngineer: {
    id: 'qa_engineer',
    title: 'QA Engineer',
    hourlyRate: 500,
    category: 'Quality Assurance',
    description: 'Manual exploratory testing, automated integration tests, API verification, regression cycles.',
  },
  projectManager: {
    id: 'project_manager',
    title: 'Project Manager',
    hourlyRate: 900,
    category: 'Management',
    description: 'Sprint planning, backlog grooming, milestone tracking, stakeholder communications.',
  },
  devopsEngineer: {
    id: 'devops_engineer',
    title: 'DevOps Engineer',
    hourlyRate: 900,
    category: 'Infrastructure',
    description: 'CI/CD pipelines, container orchestration, IaC, cloud deployment automation.',
  },
  aiMlEngineer: {
    id: 'ai_ml_engineer',
    title: 'AI/ML Engineer',
    hourlyRate: 1000,
    category: 'Specialized',
    description: 'Prompt engineering, RAG pipelines, vector embedding indexing, model fine-tuning.',
  },
  databaseEngineer: {
    id: 'database_engineer',
    title: 'Database Engineer',
    hourlyRate: 850,
    category: 'Specialized',
    description: 'Query optimization, indexing strategies, data migrations, replication topologies.',
  },
  securityEngineer: {
    id: 'security_engineer',
    title: 'Security Engineer',
    hourlyRate: 1000,
    category: 'Specialized',
    description: 'Penetration testing, encryption at rest/in transit, compliance audits, threat modeling.',
  },
  cloudEngineer: {
    id: 'cloud_engineer',
    title: 'Cloud Engineer',
    hourlyRate: 950,
    category: 'Infrastructure',
    description: 'Cloud cost optimization, serverless topology, auto-scaling clusters, CDN configuration.',
  },
  businessAnalyst: {
    id: 'business_analyst',
    title: 'Business Analyst',
    hourlyRate: 700,
    category: 'Management',
    description: 'Requirement elicitation, user story acceptance criteria, process diagramming.',
  },
};

export const getRateByRoleId = (roleId) => {
  const match = Object.values(RESOURCE_RATES).find((r) => r.id === roleId);
  return match ? match.hourlyRate : 750;
};
