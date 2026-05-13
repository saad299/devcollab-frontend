"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById, deleteProject } from "@/services/projects";
import useAuth from "@/hooks/useAuth";
import TechStackTag from "@/components/projects/TechStackTag";
import RoleTag from "@/components/projects/RoleTag";
import { SkeletonDetailPage } from '@/components/ui/SkeletonCard'
import useToast from '@/hooks/useToast'
import parseApiError from '@/utils/parseApiError'

function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast()

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
    setLoading(true);

    try {
        const data = await getProjectById(id);
        setProject(data);
    } catch (err) {
        const errMessage = "Failed"
        setError(errMessage)
    } finally {
      setLoading(false);
    }
  };
  
  fetchProject();
},[id]);

const handleDelete = async () => {
    if (!window.confirm('Are you sure?')) {
        return
    }
    
    setDeleting(true)
    try {
        await deleteProject(id)
        router.push('/dashboard')
    } catch (err) {
        showToast(parseApiError(err), 'error')
        setDeleting(false)
    } finally {
        setDeleting(false)
    }
}

const isOwner = user && user.username === project.owner_data.username
const isAuthenticated = user !== null
const requestStatus = project.request_status

const renderActionButton = () => {
    if (!isAuthenticated) {
        return <Link href={`/login?next=/projects/${id}`}>Login to Apply</Link>
    }

    if (isOwner) {
        return (
            <div>
                <Link href={`/projects/${id}/edit`}>Edit Project</Link>
                <button onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Project'}
                </button>
            </div>
        )
    }

    if (!requestStatus) {
        return (
            <>
                {pending && <button disabled>Pending</button>}
                {approved && <button disabled>Approved</button>}
                {rejected && <button disabled>Rejected</button>}
                {!pending && !approved && !rejected && <button>Apply</button>}
            </>
        )
    }

    return (
        <Link href={`/projects/${id}/apply`} className="text-blue-800">Request to Collaborate</Link>
    )

}
if (loading) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <SkeletonDetailPage />
    </div>
  )
}

// if (error === 'not_found') {
//     return (
//         <div>
//             Project not found
//             <Link href="/projects">Back to Browse</Link>
//         </div>
//     )
// }
if (!loading && !project && error === 'not_found') {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Project not found
      </h2>
      <p className="text-gray-500 mb-6">
        This project may have been deleted or the URL is incorrect.
      </p>
      <Link
        href="/projects"
        className="text-blue-500 hover:underline text-sm"
      >
        Back to Browse
      </Link>
    </div>
  )
}

if (error === 'failed') {
    return (
        <div>
            Failed to load project
            <button onClick={() => window.location.reload()}>Retry</button>
        </div>
    )
}

return (
    <div>
        <h1>{project.title}</h1>
        <p>{project.status}</p>
        <p>{project.is_open ? 'Open' : 'Closed'}</p>
        <p>{new Date(project.created_at).toLocaleDateString()}</p>

        <div>
            <h2>About this project</h2>
            <p>{project.description}</p>
        </div>

        <div>
            <h2>Tech Stack</h2>
            <p>{project.tech_stack.map((tech) => <TechStackTag key={tech} tech={tech} />)}</p>
        </div>

        <div>
            <h2>Roles Needed</h2>
            <p>{project.roles_required.map((role) => <RoleTag key={role} role={role} />)}</p>
        </div>
        
        <div>
            <h2>Owner Details</h2>
            <p>Owner: {project.owner_data.username}</p>
            <Link href={`/profile/${project.owner_data.username}`}>View Profile</Link>
            {project.owner_data.bio && <p>{project.owner_data.bio}</p>}
            {project.owner_data.skills && <p>{project.owner_data.skills}</p>}
            {project.owner_data.github_url && <p>{project.owner_data.github_url}</p>}
        </div>

        {renderActionButton()}
    </div>
)
}

export default ProjectDetailPage;
