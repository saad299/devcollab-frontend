'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedRoute from "@/components/layout/ProtectedRoute"
import { getProjectById } from "@/services/projects"
import { sendRequest } from "@/services/requests"
import useAuth from "@/hooks/useAuth"
// import TechStackTag from "@/components/projects/TechStackTag"
import useToast from '@/hooks/useToast'
import parseApiError from '@/utils/parseApiError'

function ApplyPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast()

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProject = async() => {
            try {
                const data = await getProjectById(id);

                if (!data.is_open) {
                    router.push(`/projects/${id}`);
                    return;
                }

                if (data.request_status !== null) {
                    router.push(`/projects/${id}`);
                    return;
                }
                setProject(data);
                setLoading(false);
            } catch (error) {
                const msg = parseApiError(err)
                if (msg.includes('already sent')) {
                  showToast('You have already applied to this project.', 'info')
                  router.push(`/projects/${id}`)
                } else {
                  showToast(msg, 'error')
                  setSubmitting(false)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProject();
    })

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if (message.trim().length < 20) {
            setError('Message must be at least 20 characters long');
            return;
        }
        setSubmitting(true);
        setError(null);
        
        try {
            await sendRequest(id, message.trim());
            router.push(`/projects/${id}`);
        } catch (error) {
            const errorData = error.response?.data;
            // console.error('Failed to send request:', error);

            if (errorData?.error.includes('already sent')) {
                router.push(`/projects/${id}`);
                return;
            }
            else {
                setState(prev => ({ ...prev, error: errorData?.message || 'Failed to send request' }));
            }
            setState(prev => ({ ...prev, submitting: false }));
        }
    }

    if (error && project === null) {
        return <ProtectedRoute error={error} />;
    }

    return (
        <ProtectedRoute>
            <div>
                <h1>You &apos;re apply to:</h1>
                <p>{project.title}</p>
                <p>{project.owner?.username}</p>
                <p>{project.description.trim().substring(0, 150)}...</p>
                <p>{project.tech_stack?.join(', ')}</p>
                <p>{project.roles_needed?.join(', ')}</p>
            </div>

            <div>
                <h1>Your Message</h1>
                <p>Tell the owner why you want to collaborate and what you bring to the project</p>

                <form onSubmit={handleSubmit}>
                    <textarea 
                        value={message}
                        placeholder="I&apos;m interested in this project because..."
                        onChange={(e) => setState(prev => ({ ...prev, message: e.target.value }))}
                        rows={6}
                        minLength={20}
                        cols={50}
                        onError={error}
                        required
                    />
                    <button type="submit" disabled={submitting}>
                        {submitting ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
                <Link href={`/projects/${id}`}>Cancel</Link>
            </div>
        </ProtectedRoute>
    );
}

export default ApplyPage;