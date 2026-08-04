import { getProjects } from '@/services/projects';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com';

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic project routes
  let projectRoutes = [];
  try {
    const projects = await getProjects();
    projectRoutes = projects.map((project) => ({
      url: `${BASE_URL}/projects/${project.project_id}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching projects for sitemap:', error);
    // Continue with static routes if dynamic fetch fails
  }

  return [...staticRoutes, ...projectRoutes];
}