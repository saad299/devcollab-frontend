import api from './api'

export async function getProjects(params={}) {
    const paramsQuery = {
        search: 'django',
        tech_stack: 'react',
        role: 'designer'
    }
    const response = await api.get('/projects', { params: paramsQuery });
    return response.data;
    // } catch (error) {
    //     console.error('Error fetching projects:', error);
    //     throw error;
}

export async function getProjectById(id) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
}

export async function getMyProjects() {
    const response = await api.get('/projects/mine');
    return response.data;
}

export async function createProject(projectData) {
    const post = await api.post('/projects/', projectData);
    return post.data;
}

export async function updateProject(id, projectData) {
    const update = await api.patch(`/projects/${id}`, projectData);
    return update.data;
}

export async function deleteProject(id) {
    const del = await api.delete(`/projects/${id}`);
    return del.data;
}