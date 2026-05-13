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
        showToast(parseApiError(err), 'error')
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
    <div>
      <h1>Discover Projects and find collaborators</h1>

      <form onSubmit={handleSearch}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search projects....."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2"
        />

        {/* Tech Stack */}
        <input
          type="text"
          placeholder="Tech stack (React, Django...)"
          value={techStackInput}
          onChange={(e) => setTechStackInput(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2"
        />

        {/* Role */}
        <input
          type="text"
          value={roleInput}
          onChange={(e) => setRoleInput(e.target.value)}
          className="border rounded-lg px-4 py-2 outline-none focus:ring-2"
        />
        <button type="submit">Search</button>

        {hasActiveFilters && (
          <button type="button" onClick={handleClearFilters}>
            Clear
          </button>
        )}
      </form>

      {/* Results */}
      {loading ? (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16">
            <p className="text-red-500 mb-4">
              {error}
            </p>

            <button
              onClick={() => router.refresh()}
              className="bg-black text-white px-5 py-2 rounded-lg"
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
          <p className="text-gray-500 mb-6">
            {projects.length} project(s) found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
            />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectsPage;
