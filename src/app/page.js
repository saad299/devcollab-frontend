'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth'
import { getProjects } from '@/services/projects'
import ProjectCard from '@/components/projects/ProjectCard'
import SkeletonCard from '@/components/ui/SkeletonCard'

export default function LandingPage() {
  const { user } = useAuth()
  const [recentProjects, setRecentProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentProjects() {
      try {
        const data = await getProjects()
        // show only first 3 projects on landing page
        setRecentProjects(data.slice(0, 3))
      } catch {
        // silently fail — landing page works without projects
      } finally {
        setLoading(false)
      }
    }
    fetchRecentProjects()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">

          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            Open for collaboration requests
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-5 leading-tight">
            Find developers to build<br className="hidden md:block" /> with you
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            DevCollab connects developers who have project ideas with developers
            who want to contribute. Post your project, find collaborators, and
            build something together.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <>
                <Link
                  href="/projects/new"
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 py-3 rounded-xl transition-colors text-sm"
                >
                  Post a Project
                </Link>
                <Link
                  href="/projects"
                  className="w-full sm:w-auto border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-7 py-3 rounded-xl transition-colors text-sm"
                >
                  Browse Projects
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-7 py-3 rounded-xl transition-colors text-sm"
                >
                  Get Started. It&apos;s Free
                </Link>
                <Link
                  href="/projects"
                  className="w-full sm:w-auto border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-7 py-3 rounded-xl transition-colors text-sm"
                >
                  Browse Projects
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">
          How it works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Post your project',
              description:
                'Share what you are building. Describe the project, list the tech stack, and specify the roles you need.',
            },
            {
              step: '02',
              title: 'Receive requests',
              description:
                'Developers who are interested send collaboration requests with a message explaining what they bring to the project.',
            },
            {
              step: '03',
              title: 'Build together',
              description:
                'Review requests, accept the right collaborators, and start building. Track everything from your dashboard.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-sm font-semibold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 'Free', label: 'Always free to use' },
              { value: 'Open', label: 'Open source friendly' },
              { value: 'Fast', label: 'Post in minutes' },
              { value: 'Real', label: 'Real developers only' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-semibold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Projects
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Projects looking for collaborators right now
            </p>
          </div>
          <Link
            href="/projects"
            className="text-sm text-blue-500 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl px-6 py-14 text-center">
            <p className="text-gray-500 text-sm">
              No projects yet.{' '}
              <Link href="/register" className="text-blue-500 hover:underline">
                Be the first to post one.
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to find your next collaborator?
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Join DevCollab, post your project, and connect with developers who
            want to build with you.
          </p>
          {user ? (
            <Link
              href="/dashboard"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-xl transition-colors text-sm"
              >
                Create an Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-xl transition-colors text-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}