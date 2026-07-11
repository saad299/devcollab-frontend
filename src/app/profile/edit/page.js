"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getMyProfile, updateMyProfile, uploadAvatar } from "@/services/users";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";
import useAuth from "@/hooks/useAuth";

// GitHub Icon
const GitHubIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      clipRule="evenodd"
    />
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg
    className="w-5 h-5"
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Website Icon
const WebsiteIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
    />
  </svg>
);

// Location Icon
const LocationIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [state, setState] = useState({
    bio: "",
    skills: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    avatarFile: null,
    avatarPreview: null,
    loading: true,
    submitting: false,
    error: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        const profile = data.profile;
        setState((prev) => ({
          ...prev,
          bio: profile.bio || "",
          skills: Array.isArray(profile.skills)
            ? profile.skills.join(", ")
            : profile.skills || "",
          location: profile.location || "",
          githubUrl: profile.github_url || "",
          linkedinUrl: profile.linkedin_url || "",
          websiteUrl: profile.website_url || "",
          ...(profile.avatar && {
            avatarPreview: profile.avatar,
          }),
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, ...parseApiError(error) }));
      } finally {
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    fetchProfile();
  }, []);

  function handleAvatarChange(e) {
    const file = e.target.files[0];

    if (file) {
      setState((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setState((prev) => ({
      ...prev,
      submitting: true,
      // error: null,
    }));

    try {
      // Upload avatar if there is one
      if (state.avatarFile) {
        await uploadAvatar(state.avatarFile);
      }

      // Update profile
      await updateMyProfile({
        bio: state.bio,
        skills: state.skills,
        location: state.location,
        github_url: state.githubUrl,
        linkedin_url: state.linkedinUrl,
        website_url: state.websiteUrl,
      });
      showToast("Profile updated successfully", "success");
      router.push(`/profile/${user.username}`);
    } catch (error) {
      showToast(parseApiError(error), "error");
      setState((prev) => ({
        ...prev,
        // error: errMessage,
        submitting: false,
      }));
    }
  }

  if (state.loading)
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Profile
          </h1>
          <p className="text-gray-500">Update your profile information</p>
          {state.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {state.error}
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            {/* Avatar Section */}
            <div className="flex items-center gap-4 mb-8">
              {state.avatarPreview ? (
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={state.avatarPreview}
                    alt="Avatar Preview"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500 mb-2">Profile picture</p>
                <p className="text-xs text-gray-400">
                  Avatar upload coming soon
                </p>
              </div>
            </div>

            {/* Bio field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={state.bio}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, bio: e.target.value }))
                }
                placeholder="Tell others about yourself"
                rows={4}
              />
            </div>

            {/* Skills field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <input
                type="text"
                value={state.skills}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                onChange={(e) =>
                  setState((prev) => ({ ...prev, skills: e.target.value }))
                }
                placeholder="Comma separated e.g. Python, React, Django"
              />
            </div>

            {/* Location field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LocationIcon />
                </div>
                <input
                  type="text"
                  value={state.location}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* GitHub URL field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <GitHubIcon />
                </div>
                <input
                  type="url"
                  value={state.githubUrl}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, githubUrl: e.target.value }))
                  }
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            {/* LinkedIn URL field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <LinkedInIcon />
                </div>
                <input
                  type="url"
                  value={state.linkedinUrl}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>

            {/* Website URL field */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <WebsiteIcon />
                </div>
                <input
                  type="url"
                  value={state.websiteUrl}
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      websiteUrl: e.target.value,
                    }))
                  }
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={state.submitting}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.submitting ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={`/profile/${user?.username}`}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
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

export default EditProfilePage;
