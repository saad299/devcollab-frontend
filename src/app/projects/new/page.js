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
            const newProject = await createProject(formData)
            router.push(`/projects/${newProject.id}`)
        } catch (err) {
            // if (err.response?.data) {
            //     setError(err.response.data.message)
            // } else {
            //     setError(err.message)
            // }
            showToast(parseApiError(err), 'error')
            setDeleting(false)
        }
        setLoading(false)
    }

    return (
        <ProtectedRoute>

            <div>
                <h1>Post a New Project</h1>
                <p>Share what you&apos;re building and find collaborators</p>

                {error && <p className="text-red-500">{error}</p>}
            </div>

            <ProjectForm
                onSubmit={handleSubmit}
                loading={loading}
                // error={error}
            />
        </ProtectedRoute>
    )
}

export default NewProjectPage;