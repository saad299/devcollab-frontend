"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getMyRequests } from "@/services/requests";
import EmptyState from "@/components/ui/EmptyState";
import useToast from "@/hooks/useToast";
import parseApiError from "@/utils/parseApiError";

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMyRequests();
        setRequests(data);
      } catch (err) {
        showToast(parseApiError(err), 'error')
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [ showToast ]);

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case "pending":
        return (
          <span className={`${base} bg-gray-100 text-gray-700`}>Pending</span>
        );
      case "accepted":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className={`${base} bg-red-100 text-red-700`}>
            Not Selected
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-500`}>{status}</span>
        );
    }
  };

  // if (loading) {
  //   return (
  //     <ProtectedRoute>
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  //       </div>
  //     </ProtectedRoute>
  //   );
  // }
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3.5 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                <div className="h-5 bg-gray-200 rounded-full w-20"></div>
              </div>
              <div className="h-3.5 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1>My Requests</h1>
        <p className="text-sm text-gray-500 mt-1">
          {requests.length} request(s) sent
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div>
        {requests.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <EmptyState
              title="You haven&apos;t sent any collaboration requests yet."
              description="Browse projects and send your first collaboration request"
              actionLabel="Browse Projects"
              actionHref="/projects"
            />
            {/* <p className="text-gray-500 mb-4">
              You haven&apos;t sent any collaboration requests yet.
            </p> */}
            <Link
              href="/projects"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Project",
                    "Owner",
                    "Tech Stack",
                    "Date Sent",
                    "Message",
                    "Status",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Project Title */}
                    <td className="px-4 py-3 font-medium text-blue-600 hover:underline whitespace-nowrap">
                      <Link href={`/projects/${request.project_detail.id}`}>
                        {request.project_detail.title}
                      </Link>
                    </td>

                    {/* Owner */}
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      <Link
                        href={`/profile/${request.project_detail.owner_username}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {request.project_detail.owner_username}
                      </Link>
                    </td>

                    {/* Tech Stack */}
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {request.project_detail.tech_stack_list
                          .slice(0, 3)
                          .map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                      </div>
                    </td>

                    {/* Date Sent */}
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(request.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>

                    {/* Message Preview */}
                    <td className="px-4 py-3 text-gray-500 max-w-xs">
                      <span className="line-clamp-1">
                        {request.message.length > 80
                          ? `${request.message.slice(0, 80)}...`
                          : request.message}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default MyRequestsPage;
