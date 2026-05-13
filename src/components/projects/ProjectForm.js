'use client'

import { useState } from "react"

function ProjectForm({ project={}, onSubmit, loading = false }) {
    const STATUS_OPTIONS = [
        'open',
        'in_progress',
        'completed',
        'cancelled'
    ]
    
    const [formData, setFormData] = useState({
        title: project.title || '',
        description: project.description || '',
        techStack: project.tech_stack || '',
        rolesNeeded: project.roles_needed || '',
        status: project.status ?? 'open',
        isOpen: project.is_open || true,
        errors: {}
    })

    function validate() {
        const newErrors = {}
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        if (!formData.status) {
            newErrors.status = 'Status is required'
        }
        if(!formData.rolesNeeded) {
            newErrors.rolesNeeded = 'Roles needed is required'
        }
        setFormData({...formData, errors: newErrors})
        return Object.keys(newErrors).length === 0
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!validate()) {
            return
        }
        onSubmit(formData)
    }
    
    return (
        <form onSubmit={handleSubmit}>

            <h2>Project Title</h2>
            <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Project Title"
                error={formData.errors.title}
                required
            />

            <h2>Project Description</h2>
            <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Project Description"
                error={formData.errors.description}
                required
            />

            <h2>Tech Stack</h2>
            <input
                type="text"
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                placeholder="Comma separated e.g. Python, Django, React"
                error={formData.errors.techStack}
                required
            />

            <h2>Roles Needed</h2>
            <input
                type="text"
                value={formData.rolesNeeded}
                onChange={(e) => setFormData({...formData, rolesNeeded: e.target.value})}
                placeholder="Comma separated e.g. Frontend Developer, Backend Developer"
                error={formData.errors.rolesNeeded}
                required
            />

            <h2>Status</h2>
            <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
                {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>

            <h2>Open?</h2>
            <label>Accepting Collaboration Requests</label>
            <input
                id="is-open"
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({...formData, isOpen: e.target.checked})}
            />

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Project'}
            </button>
        </form>
    )
}

export default ProjectForm