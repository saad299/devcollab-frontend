"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/layout/ProtectedRoute";
import useAuth from "@/hooks/useAuth";
import RequestCard from "@/components/requests/RequestCard";
// import ProjectCard from "@/components/projects/ProjectCard";
import { getMyProjects, deleteProject } from "@/services/projects";
import { getProjectRequests } from "@/services/requests";
import {
  SkeletonRequestCard,
  SkeletonRow,
  SkeletonProfile,
} from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";
import { useRouter } from "next/navigation";

function DashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    setError(null);
    try {
      const myProjects = await getMyProjects();
      setProjects(myProjects);

      const requestPromises = myProjects.map((project) =>
        getProjectRequests(project.project_id)
          .then((requests) =>
            requests.map((request) => ({
              ...request,
              projectId: project.project_id,
              projectTitle: project.title,
            })),
          )
          .catch(() => []),
      );

      const allProjectRequests = await Promise.all(requestPromises);
      setRequests(allProjectRequests.flat());
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }

  //   Delete the project
  async function handleDeleteProject(projectId, projectTitle) {
    if (
      !window.confirm(
        `Are you sure you want to delete "${projectTitle}"? This will also delete all collaboration requests for this project.`,
      )
    ) {
      return;
    }
    setDeletingId(projectId);
    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.project_id !== projectId));
      setRequests((prev) => prev.filter((r) => r.projectId !== projectId));
      showToast("Project deleted successfully.", "success");
    } catch (err) {
      showToast(parseApiError(err), "error");
    } finally {
      setDeletingId(null);
    }
  }

  //   Update the request status
  const handleRequetUpdateStatus = (requestId, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r)),
    );
  };

  //   Get the total projects, requests, pending requests, and accepted requests
  const totalProjects = projects.length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "pending").length;
  const acceptedRequests = requests.filter(
    (r) => r.status === "accepted",
  ).length;

  // split requests by status
  const pendingReqs = requests.filter((r) => r.status === "pending");
  const reviewedReqs = requests.filter((r) => r.status !== "pending");

  const statusBadge = (status) => {
    const map = {
      active: "bg-blue-50 text-blue-700",
      completed: "bg-green-50 text-green-700",
      on_hold: "bg-yellow-50 text-yellow-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  //   Show loading skeleton
  if (loading) {
    return (
      // <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <SkeletonProfile />
        {/* skeleton stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-4 animate-pulse"
            >
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-7 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        {/* skeleton projects */}
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        {[...Array(2)].map((_, i) => (
          <SkeletonRow key={i} />
        ))}
        {/* skeleton requests */}
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 mt-8 animate-pulse"></div>
        {[...Array(2)].map((_, i) => (
          <SkeletonRequestCard key={i} />
        ))}
      </div>
      // </ProtectedRoute>
    );
  }

  return (
    // <ProtectedRoute>
    //   <div>
    //     <h1>Dashboard</h1>
    //     <p>Welcome, {user?.username}</p>
    //   </div>
    // </ProtectedRoute>

    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back,{" "}
              <span className="font-medium text-gray-700">
                {user?.username}
              </span>
            </p>
          </div>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
          >
            <span>+</span> Post New Project
          </Link>
        </div>

        {/* error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span className="text-sm">{error}</span>
            <button
              onClick={fetchDashboardData}
              className="text-sm font-medium underline ml-4 hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Projects Posted", value: totalProjects },
            { label: "Total Requests", value: totalRequests },
            { label: "Pending", value: pendingRequests },
            { label: "Accepted", value: acceptedRequests },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* my projects section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
            <span className="text-sm text-gray-500">
              {totalProjects} project{totalProjects !== 1 ? "s" : ""}
            </span>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Post your first project to start finding collaborators"
              actionLabel="Post Your First Project"
              actionHref="/projects/new"
            />
          ) : (
            <div className="space-y-3">
              {projects.map((project) => {
                const projectRequests = requests.filter(
                  (r) => r.projectId === project.project_id,
                );
                const pendingCount = projectRequests.filter(
                  (r) => r.status === "pending",
                ).length;

                return (
                  <div
                    key={project.project_id}
                    className="bg-white border border-gray-200 rounded-xl px-5 py-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {project.title}
                          </h3>
                          <span
                            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${statusBadge(project.status)}`}
                          >
                            {project.status?.replace("_", " ")}
                          </span>
                          {!project.is_open && (
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                              Closed
                            </span>
                          )}
                          {pendingCount > 0 && (
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700">
                              {pendingCount} pending
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech_stack_list?.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack_list?.length > 4 && (
                            <span className="text-xs text-gray-400">
                              +{project.tech_stack_list.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/projects/${project.project_id}`}
                          className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          href={`/projects/${project.project_id}/edit`}
                          className="text-sm border border-gray-200 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteProject(
                              project.project_id,
                              project.title,
                            )
                          }
                          disabled={deletingId === project.project_id}
                          className="text-sm border border-red-200 hover:bg-red-50 text-red-500 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === project.project_id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* incoming requests section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Incoming Requests
            </h2>
            <span className="text-sm text-gray-500">
              {totalRequests} total · {pendingRequests} pending
            </span>
          </div>

          {requests.length === 0 ? (
            <EmptyState
              title="No collaboration requests yet"
              description="Requests will appear here when developers apply to your projects"
            />
          ) : (
            <div className="space-y-4">
              {/* pending requests first */}
              {pendingReqs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3">
                    Pending · {pendingReqs.length}
                  </p>
                  <div className="space-y-3">
                    {pendingReqs.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onStatusUpdate={handleRequetUpdateStatus}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* reviewed requests */}
              {reviewedReqs.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-3 mt-6">
                    Reviewed · {reviewedReqs.length}
                  </p>
                  <div className="space-y-3">
                    {reviewedReqs.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onStatusUpdate={handleRequetUpdateStatus}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardPage;
