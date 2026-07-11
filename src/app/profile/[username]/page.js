"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getPublicProfile } from "@/services/users";
import ProjectCard from "@/components/projects/ProjectCard";
import useAuth from "@/hooks/useAuth";

// GitHub Icon
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
  </svg>
);

// LinkedIn Icon
const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// Website Icon
const WebsiteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

// Location Icon
const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

function PublicProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [username]);

  const isOwnProfile = user?.username === username;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error === "User not found") {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 px-4">
        <div className="text-6xl mb-4">👤</div>
        <h2 className="text-2xl font-semibold mb-2">User not found</h2>
        <p className="text-gray-500 mb-6">The profile you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/projects"
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Browse Projects
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-semibold mb-2">Error</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // const hasProfileData = profile.profile;
  // const hasSocialLinks = profile.profile?.github_url || profile.profile?.linkedin_url || profile.profile?.website_url;
  const skillsList = profile.profile?.skills ? profile.profile.skills.split(',').map(s => s.trim()).filter(s => s) : [];
  const hasSkills = skillsList.length > 0;
  // const activeProjects = profile.projects?.filter((project) => project.status === "active") || [];
  const activeProjects = profile.projects?.filter((project) => 
  project.status === "active"
) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              {profile.profile?.avatar ? (
                <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                  <Image
                    src={profile.profile.avatar}
                    alt={`${profile.username}'s avatar`}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
                  {profile.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.username}</h1>
                {profile.email && (
                  <p className="text-gray-500 text-sm mb-1">{profile.email}</p>
                )}
                {profile.profile?.location && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <LocationIcon />
                    <span>{profile.profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.profile?.bio ? (
              <p className="text-gray-600 leading-relaxed mb-4">{profile.profile.bio}</p>
            ) : (
              <p className="text-gray-400 italic mb-4">No bio provided yet.</p>
            )}

            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {profile.profile.github_url ? (
                <a
                  href={profile.profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <GitHubIcon />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 px-3 py-2 rounded-lg border border-dashed border-gray-300">
                  <GitHubIcon />
                  <span className="text-sm font-medium">GitHub</span>
                </div>
              )}
              {profile.profile.linkedin_url ? (
                <a
                  href={profile.profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <LinkedInIcon />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 px-3 py-2 rounded-lg border border-dashed border-gray-300">
                  <LinkedInIcon />
                  <span className="text-sm font-medium">LinkedIn</span>
                </div>
              )}
              {profile.profile.website_url ? (
                <a
                  href={profile.profile.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  <WebsiteIcon />
                  <span className="text-sm font-medium">Website</span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-gray-400 px-3 py-2 rounded-lg border border-dashed border-gray-300">
                  <WebsiteIcon />
                  <span className="text-sm font-medium">Website</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <div className="shrink-0">
              <Link
                href="/profile/edit"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
        {hasSkills ? (
          <div className="flex flex-wrap gap-2">
            {skillsList.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic">No skills listed yet.</p>
        )}
      </div>

      {/* Projects Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {profile.username}&apos;s Projects
        </h2>
        {activeProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-gray-500 mb-2">No active projects found</p>
            {isOwnProfile && (
              <Link
                href="/projects/new"
                className="inline-block mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
              >
                Create your first project →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfilePage;