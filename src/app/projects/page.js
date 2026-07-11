"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProjects } from "@/services/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import EmptyState from "@/components/ui/EmptyState";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const search = searchParams.get("search") || "";
  const techStack = searchParams.get("tech_stack") || "";
  const role = searchParams.get("role") || "";

  let [searchInput, setSearchInput] = useState(search);
  let [techStackInput, setTechStackInput] = useState(techStack);
  let [roleInput, setRoleInput] = useState(role);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {};

        if (search) params.search = search;
        if (techStack) params.tech_stack = techStack;
        if (role) params.role = role;

        const data = await getProjects(params);
        setProjects(data);
      } catch (err) {
        showToast(parseApiError(err), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showToast, search, techStack, role]);

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchInput) {
      params.set("search", searchInput);
    }

    if (techStackInput) {
      params.set("tech_stack", techStackInput);
    }

    if (roleInput) {
      params.set("role", roleInput);
    }

    const queryString = params.toString();

    router.push(queryString ? `/projects?${queryString}` : "/projects");
  };

  const handleClearFilters = () => {
    router.push("/projects");

    setSearchInput("");
    setTechStackInput("");
    setRoleInput("");
  };

  const hasActiveFilters = search || techStack || role;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Discover Projects and find collaborators
      </h1>

      <form
        onSubmit={handleSearch}
        className="bg-white border border-gray-200 rounded-xl p-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 ml-5">
          {/* Search */}
          <input
            type="text"
            placeholder="Search projects....."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          />

          {/* Tech Stack */}
          <input
            type="text"
            placeholder="Tech stack (React, Django...)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          />

          {/* Role */}
          <input
            type="text"
            placeholder="Role (Frontend, Backend...)"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium whitespace-nowrap"
            >
              Search
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>

          <button
            onClick={() => router.refresh()}
            className="bg-[#378ADD] text-white px-6 py-2 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        // Empty State
        <EmptyState
          title="No projects found"
          description={
            hasActiveFilters
              ? "Try different search terms or clear your filters"
              : "No projects have been posted yet. Be the first!"
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : "Post a Project"}
          actionHref={hasActiveFilters ? "/projects" : "/projects/new"}
        />
      ) : (
        <>
          {/* Results Count */}
          <p className="text-gray-500 text-sm mb-6">
            {projects.length} project{projects.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;
