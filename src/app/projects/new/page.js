'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import ProjectForm from "@/components/projects/ProjectForm"
import { createProject } from "@/services/projects"
import useToast from '@/hooks/useToast'
import parseApiError from '@/utils/parseApiError'

function NewProjectPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()
    const { showToast } = useToast()

    async function handleSubmit(formData) {
        setLoading(true)
        setError(null)

        try {
            const backendData = {
                title: formData.title,
                description: formData.description,
                tech_stack: formData.techStack,
                roles_needed: formData.rolesNeeded,
                status: formData.status === 'open' || formData.status === 'in_progress' ? 'active' : formData.status === 'cancelled' ? 'on_hold' : formData.status,
                is_open: formData.isOpen
            }
            // const newProject = await createProject(backendData)
            // router.push(`/projects/${newProject.id}`)
            // router.push(`/projects/${newProject.project_id}`)
            // const newProject = await createProject(backendData)
            // console.log('Backend response:', newProject)
            // router.push(`/projects/${newProject.project_id}`)
            // console.log('Sending to backend:', backendData)
            // const newProject = await createProject(backendData)
            // console.log('Backend response:', newProject)
            // const projectId = newProject.project_id || newProject.id || newProject.project_id
            // console.log('Extracted Project ID:', projectId)
            // router.push(`/projects/${projectId}`)
            const newProject = await createProject(backendData)
            router.push(`/projects/${newProject.project_id}`)
        } catch (err) {
            showToast(parseApiError(err), 'error')
        }
        setLoading(false)
    }

    return (
        <ProtectedRoute>
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        Post a New Project
                    </h1>
                    <p className="text-gray-600">
                        Share what you&apos;re building and find collaborators
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <ProjectForm
                        onSubmit={handleSubmit}
                        loading={loading}
                    />
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default NewProjectPage;