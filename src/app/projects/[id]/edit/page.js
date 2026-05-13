'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import ProjectForm from "@/components/projects/ProjectForm"
import { getProjectById, updateProject } from "@/services/projects"
import useAuth from "@/hooks/useAuth"
import useToast from '@/hooks/useToast'
import parseApiError from '@/utils/parseApiError'

function EditProjectPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast()
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProject = async() => {
            try {
                const data = await getProjectById(id);
                if (user && data.owner_data.username !== user.username) {
                    router.push(`/projects/${id}`);
                    return;
                }
                setProject(data);
                setLoading(false);
                // setState({ ...state, project: data, loading: false });
            } catch (error) {
                console.error('Failed to fetch project:', error);
                setError('Failed to load project');
                setLoading(false);
            }
        }

        fetchProject()
    })

    const handleSubmit = async(formData) => {
        // setState(prev => ({ ...prev, loading: true }));
        // setState(prev => ({ ...prev, error: null }));
        const hasChanged = Object.keys(formData).some(
            (key) => formData[key] !== project[key]
        )
        if (!hasChanged) {
            showToast('No changes to save.', 'info')
            return
        }
        setSubmitting(true)
        
        try {
            await updateProject(id, formData);
            showToast('Project updated successfully.', 'success')
            router.push(`/projects/${id}`);
        } catch (error) {
            showToast(parseApiError(err), 'error')
            setSubmitting(false)
        }
    }

    if (loading) {
        return <div>Loading.....</div>
    }

    if (error && project === null) {
        return <ProtectedRoute error={error} />;
    }

    return (
        <ProtectedRoute>
            <div>
                <h1>Edit Project</h1>
                <p>{project?.title}</p>
            </div>

            <ProjectForm 
                project={project}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
            />
        </ProtectedRoute>
    )
}

export default EditProjectPage;