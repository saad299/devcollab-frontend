"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProjectById, deleteProject } from "@/services/projects";
import useAuth from "@/hooks/useAuth";
import TechStackTag from "@/components/projects/TechStackTag";
import RoleTag from "@/components/projects/RoleTag";
import { SkeletonDetailPage } from "@/components/ui/SkeletonCard";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";

function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

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
        const errMessage = "Failed";
        setError(errMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteProject(id);
      router.push("/dashboard");
    } catch (err) {
      showToast(parseApiError(err), "error");
      setDeleting(false);
    } finally {
      setDeleting(false);
    }
  };

  const renderActionButton = () => {
    if (!isAuthenticated) {
      return (
        <Link
          href={`/login?next=/projects/${id}`}
          className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium inline-block"
        >
          Login to Apply
        </Link>
      );
    }

    if (isOwner) {
      return (
        <div className="flex gap-3">
          <Link
            href={`/projects/${id}/edit`}
            className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium inline-block"
          >
            Edit Project
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Project"}
          </button>
        </div>
      );
    }

    const pending = requestStatus === "pending";
    const approved = requestStatus === "approved";
    const rejected = requestStatus === "rejected";

    if (!requestStatus) {
      return (
        <>
          {pending && (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
            >
              Pending
            </button>
          )}
          {approved && (
            <button
              disabled
              className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed"
            >
              Approved
            </button>
          )}
          {rejected && (
            <button
              disabled
              className="bg-red-300 text-gray-600 px-6 py-2 rounded-lg font-medium cursor-not-allowed"
            >
              Rejected
            </button>
          )}
          {!pending && !approved && !rejected && (
            <Link
              href={`/projects/${id}/apply`}
              className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium inline-block"
            >
              Apply
            </Link>
          )}
        </>
      );
    }

    return (
      <Link
        href={`/projects/${id}/apply`}
        className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium inline-block"
      >
        Request to Collaborate
      </Link>
    );
  };
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <SkeletonDetailPage />
      </div>
    );
  }

  if (!loading && !project && error === "not_found") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Project not found
        </h2>
        <p className="text-gray-600 mb-6">
          This project may have been deleted or the URL is incorrect.
        </p>
        <Link
          href="/projects"
          className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium inline-block"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  if (error === "failed") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Failed to load project
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const isOwner =
    user && project && user.username === project.owner_data.username;
  const isAuthenticated = user !== null;
  const requestStatus = project?.request_status;

  // Transform tech_stack and roles_required from string to array if needed
  const techStackArray = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === "string"
      ? project.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];
  // const rolesArray = Array.isArray(project.roles_required)
  //   ? project.roles_required
  //   : typeof project.roles_required === 'string'
  //     ? project.roles_required.split(',').map(r => r.trim()).filter(r => r)
  //     : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">
            {project.title}
          </h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              project.is_open
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {project.is_open ? "Open" : "Closed"}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Status: {project.status}</span>
          <span>•</span>
          <span>
            Posted:{" "}
            {new Date(project.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          About this project
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
          {project.description}
        </p>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStackArray.length > 0 ? (
            techStackArray.map((tech) => (
              <div key={tech} className="inline-block">
                <TechStackTag tech={tech} />
              </div>
            ))
          ) : (
            <span className="text-gray-500">No tech stack specified</span>
          )}
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Roles Needed
        </h2>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(project.roles_list) ? (
            project.roles_list.map((role) => <RoleTag key={role} role={role} />)
          ) : (
            <span className="text-gray-500">
              {project.roles_list || "No roles specified"}
            </span>
          )}
        </div>
      </div>

      {/* Owner Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Owner Details
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-600">Owner:</span>
            <Link
              href={`/profile/${project.owner_data.username}`}
              className="text-[#378ADD] hover:underline font-medium"
            >
              {project.owner_data.username}
            </Link>
          </div>
          {project.owner_data.bio && (
            <div>
              <span className="text-gray-600">Bio:</span>
              <p className="text-gray-600 mt-1">{project.owner_data.bio}</p>
            </div>
          )}
          {project.owner_data.skills && (
            <div>
              <span className="text-gray-600">Skills:</span>
              <p className="text-gray-600 mt-1">{project.owner_data.skills}</p>
            </div>
          )}
          {project.owner_data.github_url && (
            <div>
              <span className="text-gray-600">GitHub:</span>
              <a
                href={project.owner_data.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#378ADD] hover:underline ml-2"
              >
                {project.owner_data.github_url}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">{renderActionButton()}</div>
    </div>
  );
}

export default ProjectDetailPage;
