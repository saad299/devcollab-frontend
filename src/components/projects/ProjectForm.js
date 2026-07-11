"use client";

import { useState } from "react";

function ProjectForm({ project = {}, onSubmit, loading = false }) {
  const STATUS_OPTIONS = ["open", "in_progress", "completed", "cancelled"];

  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    techStack: project.tech_stack || "",
    rolesNeeded: project.roles_needed || "",
    status: project.status ?? "open",
    isOpen: project.is_open || true,
    errors: {},
  });

  function validate() {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    if (!formData.rolesNeeded) {
      newErrors.rolesNeeded = "Roles needed is required";
    }
    setFormData({ ...formData, errors: newErrors });
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Project Title"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          required
        />
        {formData.errors.title && (
          <p className="text-red-500 text-sm mt-1">{formData.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Project Description"
          rows={5}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all resize-none"
          required
        />
        {formData.errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {formData.errors.description}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tech Stack
        </label>
        <input
          type="text"
          value={formData.techStack}
          onChange={(e) =>
            setFormData({ ...formData, techStack: e.target.value })
          }
          placeholder="Comma separated e.g. Python, Django, React"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple technologies with commas
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roles Needed
        </label>
        <input
          type="text"
          value={formData.rolesNeeded}
          onChange={(e) =>
            setFormData({ ...formData, rolesNeeded: e.target.value })
          }
          placeholder="Comma separated e.g. Frontend Developer, Backend Developer"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all"
          required
        />
        {formData.errors.rolesNeeded && (
          <p className="text-red-500 text-sm mt-1">
            {formData.errors.rolesNeeded}
          </p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Separate multiple roles with commas
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-[#378ADD] focus:border-transparent transition-all bg-white"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>
        {formData.errors.status && (
          <p className="text-red-500 text-sm mt-1">{formData.errors.status}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          id="is-open"
          type="checkbox"
          checked={formData.isOpen}
          onChange={(e) =>
            setFormData({ ...formData, isOpen: e.target.checked })
          }
          className="w-4 h-4 text-[#378ADD] border-gray-300 rounded focus:ring-[#378ADD]"
        />
        <label htmlFor="is-open" className="text-sm text-gray-700">
          Accepting Collaboration Requests
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#378ADD] text-white px-6 py-3 rounded-lg hover:bg-[#2a6bc4] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Save Project"}
      </button>
    </form>
  );
}

export default ProjectForm;
