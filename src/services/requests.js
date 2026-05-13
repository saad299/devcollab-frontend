import api from './api'


export async function sendRequest(projectId, message) {
    response = await api.post(`/projects/${projectId}/requests/`, { message })
    return response.data
}


export async function getProjectRequests(projectId) {
    response = await api.get(`/projects/${projectId}/requests/`)
    return response.data
}


export async function updateRequestStatus(projectId, requestId, newStatus) {
    response = await api.patch(`/projects/${projectId}/requests/${requestId}/`, { status: newStatus })
    return response.data
}

export async function getMyRequests() {
    response = await api.get(`/requests/mine/`)
    return response.data
}