import api from './api'


export async function sendRequest(projectId, message) {
    const response = await api.post(`/projects/${projectId}/requests/`, { message })
    return response.data
}


export async function getProjectRequests(projectId) {
    const response = await api.get(`/projects/${projectId}/requests/`)
    return response.data
}


export async function updateRequestStatus(projectId, requestId, newStatus) {
    const response = await api.patch(`/projects/${projectId}/requests/${requestId}/`, { status: newStatus })
    return response.data
}

export async function getMyRequests() {
    const response = await api.get(`/requests/mine/`)
    return response.data
}