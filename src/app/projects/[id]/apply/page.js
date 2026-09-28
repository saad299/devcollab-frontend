"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getProjectById } from "@/services/projects";
import { sendRequest } from "@/services/requests";
import useAuth from "@/hooks/useAuth";
// import TechStackTag from "@/components/projects/TechStackTag"
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";

function ApplyPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
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
        const msg = parseApiError(error);
        if (msg.includes("already sent")) {
          showToast("You have already applied to this project.", "info");
          router.push(`/projects/${id}`);
        } else {
          showToast(msg, "error");
          setSubmitting(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user, router, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim().length < 20) {
      setError("Message must be at least 20 characters long");
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

      if (errorData?.error.includes("already sent")) {
        router.push(`/projects/${id}`);
        return;
      } else {
        setError(errorData?.message || "Failed to send request");
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error && project === null) {
    return <ProtectedRoute error={error} />;
  }

  // Transform tech_stack from string to array if needed
  const techStackArray = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === "string"
      ? project.tech_stack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [];

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 mb-2">
            Apply to Project
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
            Send a collaboration request to the project owner
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Project Details
          </h2>
          <p className="text-gray-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg">
            {project.title}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
            By {project.owner?.username}
          </p>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base md:text-base">
            {project.description?.trim().substring(0, 150)}...
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
            {techStackArray.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-xs sm:text-xs md:text-sm bg-blue-50 text-blue-700 px-1.5 sm:px-2 md:px-3 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Your Message
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
            Tell the owner why you want to collaborate and what you bring to the
            project
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 sm:mb-4 md:mb-5">
              <textarea
                value={message}
                placeholder="I'm interested in this project because..."
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all resize-none text-sm sm:text-base md:text-base lg:text-base"
                required
              />
              {error && (
                <p className="text-red-500 text-xs sm:text-xs md:text-sm mt-1">
                  {error}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#378ADD] hover:bg-[#2a6bc4] text-white px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base md:text-base w-full sm:w-auto"
              >
                {submitting ? "Sending..." : "Send Request"}
              </button>
              <Link
                href={`/projects/${id}`}
                className="text-gray-600 hover:text-gray-900 text-sm sm:text-base font-medium px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-gray-100 transition-colors text-center sm:text-left"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ApplyPage;
