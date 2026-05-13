"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getPublicProfile } from "@/services/users";
import ProjectCard from "@/components/projects/ProjectCard";
import useAuth from "@/hooks/useAuth";

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
    return <div>Loading...</div>;
  }

  if (error === "not_found") {
    return (
      <div>
        User not found
        <Link href="/projects">Browse Projects</Link>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <h1>{profile.username}</h1>
        {profile.profile.location && <p>{profile.profile.location}</p>}
        {profile.profile.bio && <p>{profile.profile.bio}</p>}

        {isOwnProfile && <Link href="/profile/edit">Edit Profile</Link>}

        {/* Links section rows */}
        {profile.profile.github_url && (
          <p>Github icon {profile.profile.github_url}</p>
        )}
        {profile.profile.linkedin_url && (
          <p>LinkedIn icon {profile.profile.linkedin_url}</p>
        )}
        {profile.profile.website_url && (
          <p>Website Link {profile.profile.website_url}</p>
        )}

        {/* Skills section */}
        {profile.profile.skills && (
          <div>
            <h2>Skills</h2>
            <ul>
              {profile.profile.skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Projects section */}
        {profile.projects && (
          <div>
            <h2>{profile.username}&apos;s Projects</h2>
            {profile.projects.length === 0 ? (
              <p>No projects found</p>
            ) : (
              profile.projects
                .filter((project) => project.status === "active")
                .map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PublicProfilePage;