"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import ProjectForm from "@/components/projects/ProjectForm";
import { getProjectById, updateProject } from "@/services/projects";
import useAuth from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";

function EditProjectPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
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
        console.error("Failed to fetch project:", error);
        setError("Failed to load project");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user, router]);

  const handleSubmit = async (formData) => {
    // setState(prev => ({ ...prev, loading: true }));
    // setState(prev => ({ ...prev, error: null }));
    const hasChanged = Object.keys(formData).some(
      (key) => formData[key] !== project[key],
    );
    if (!hasChanged) {
      showToast("No changes to save.", "info");
      return;
    }
    setSubmitting(true);

    try {
      await updateProject(id, formData);
      showToast("Project updated successfully.", "success");
      router.push(`/projects/${id}`);
    } catch (error) {
      showToast(parseApiError(err), "error");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && project === null) {
    return <ProtectedRoute error={error} />;
  }

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Edit Project
          </h1>
          <p className="text-gray-600">Update your project details</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default EditProjectPage;
