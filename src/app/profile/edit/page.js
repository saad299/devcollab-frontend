"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getMyProfile, updateMyProfile, uploadAvatar } from "@/services/users";
import useToast from '@/hooks/useToast'
import parseApiError from '@/utils/parseApiError'
import useAuth from "@/hooks/useAuth";

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
          skills: profile.skills?.join(", ") || "",
          location: profile.location || "",
          githubUrl: profile.githubUrl || "",
          linkedinUrl: profile.linkedinUrl || "",
          websiteUrl: profile.websiteUrl || "",

          ...(profile.avatar && {
            avatarPreview: profile.avatar,
          }),
        }));
      } catch (error) {
        setError(parseApiError(error));
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
      if (state.avatarFile) {
        // Upload avatar first
        await uploadAvatar(state.avatarFile);

        // Update profile with avatar URL
        await updateMyProfile({
          ...state,
          bio,
          skills,
          location,
          github_url: githubUrl,
          linkedin_url: linkedinUrl,
          website_url: websiteUrl,
        });
        showToast('Profile updated successfully', 'success');
        router.push(`/profile${user.username}`);
      }
    } catch (error) {
      showToast(parseApiError(error), 'error');
      setState((prev) => ({
        ...prev,
        // error: errMessage,
        submitting: false,
      }));
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div>
        <h1>Edit Profile</h1>

        {error && <div>{error}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <p>Avatar Placeholder</p>

        {avatarPreview && (
          <Image
            src={avatarPreview}
            alt="Avatar Preview"
            width={100}
            height={100}
          />
        )}
        {/* Use this pattern to show an avatar for now */}
        {profile?.avatar ? (
          <Image
            src={profile.avatar}
            alt={username}
            className="w-14 h-14 rounded-full object-cover"
            width={56}
            height={56}
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex          items-center justify-center text-xl font-semibold">
            {username?.[0]?.toUpperCase()}
          </div>
        )}

        {/* This will be uncommented once file upload with Cloudinary is configured */}
        {/* Upload avatar image */}
        {/* <label className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Choose Avatar
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </label> */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-semibold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <p className="text-sm text-gray-500">Avatar upload coming soon</p>
        </div>

        {/* Bio field */}
        <div>
          <label>Bio</label>
          <textarea
            value={bio}
            className="w-full rounded border px-3 py-2"
            onChange={(e) =>
              setState((prev) => ({ ...prev, bio: e.target.value }))
            }
            placeholder="Tell others about yourself"
            rows={4}
          />
        </div>

        {/* skills field */}
        <label>Skills</label>
        <input
          type="text"
          value={skills}
          className="w-full rounded border px-3 py-2"
          onChange={(e) =>
            setState((prev) => ({ ...prev, skills: e.target.value }))
          }
          placeholder="Comma separated e.g. Python, React, Django"
        />

        {/* location feild */}
        <div>
          <label>Location</label>
          <input
            type="text"
            value={location}
            className="w-full rounded border px-3 py-2"
            onChange={(e) =>
              setState((prev) => ({ ...prev, location: e.target.value }))
            }
            placeholder="City, Country"
          />
        </div>

        {/* Github Url field */}
        <div>
          <label>GitHub URL</label>
          <input
            type="url"
            value={githubUrl}
            className="w-full rounded border px-3 py-2"
            onChange={(e) =>
              setState((prev) => ({ ...prev, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/username"
          />
        </div>

        {/* LinkedIn URL field */}
        <div>
          <label>LinkedIn URL</label>
          <input
            type="url"
            value={linkedinUrl}
            className="w-full rounded border px-3 py-2"
            onChange={(e) =>
              setState((prev) => ({ ...prev, linkedinUrl: e.target.value }))
            }
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        {/* Website URL field */}
        <div>
          <label>Website URL</label>
          <input
            type="url"
            value={websiteUrl}
            className="w-full rounded border px-3 py-2"
            onChange={(e) =>
              setState((prev) => ({ ...prev, websiteUrl: e.target.value }))
            }
            placeholder="https://yourwebsite.com"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>

        <Link
          href={`/profile/${user?.username}`}
          className="text-blue-600 hover:underline"
        >
          Cancel
        </Link>
      </form>
    </ProtectedRoute>
  );
}

export default EditProfilePage;
