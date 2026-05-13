import api from './api'

export async function getMyProfile() {
    const response = await api.get('/auth/users/me')
    return response.data
}

export async function updateMyProfile(profileData) {
    const response = await api.patch('/auth/users/me', profileData)
    return response.data
}

export async function uploadAvatar(file) {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/auth/users/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

export async function getPublicProfile(username) {
    const response = await api.get(`/auth/users/${username}`)
    return response.data
}