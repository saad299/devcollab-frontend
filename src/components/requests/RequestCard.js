'use client'

import { useState } from "react"
import Image from 'next/image'
import Link from "next/link"
import { updateRequestStatus } from "@/services/requests"

function RequestCard({ request, onStatusUpdate }) {
    const { id, message, status, created_at, requester_data, project_detail } = request;
    const [loading, setLoading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(status)

    const handleStatusUpdate = async(newStatus) => {
        setLoading(true)

        try {
            await updateRequestStatus(
                project_detail.id,
                id,
                newStatus
            )
            setCurrentStatus(newStatus)
            if (onStatusUpdate) {
                onStatusUpdate(id, newStatus)
            }
        } catch (error) {
            alert('Error updating request status: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        {requester_data.avatar ? (
                            <Image 
                                src={requester_data.avatar} 
                                alt={requester_data.name} 
                                width={40} 
                                height={40}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                    {requester_data.name?.charAt(0) || '?'}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <Link 
                                href={`/profile/${requester_data.username}`}
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                            >
                                {requester_data.name}
                            </Link>
                            <p className="text-sm text-gray-500">@{requester_data.username}</p>
                        </div>
                    </div>

                    {requester_data.skills && requester_data.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {requester_data.skills.slice(0, 4).map((skill, index) => (
                                <span 
                                    key={index}
                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {requester_data.skills.length > 4 && (
                                <span className="text-xs text-gray-400">
                                    +{requester_data.skills.length - 4} more
                                </span>
                            )}
                        </div>
                    )}

                    <div className="mb-3">
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                            {message.length > 200 ? message.slice(0, 200) + '...' : message}
                            {message.length > 200 && (
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-2">
                                    Read More
                                </button>
                            )}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Project: {project_detail.title}</span>
                        <span>·</span>
                        <span>{new Date(created_at).toLocaleDateString()}</span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    {currentStatus === 'pending' && (
                        <>
                            <button
                                className="bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
                                disabled={loading}
                                onClick={() => handleStatusUpdate('accepted')}>
                                {loading ? 'Updating...' : 'Accept'}
                            </button>
                            <button
                                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50"
                                disabled={loading}
                                onClick={() => handleStatusUpdate('rejected')}>
                                {loading ? 'Updating...' : 'Reject'}
                            </button>
                        </>
                    )}
                    {currentStatus === 'accepted' && (
                        <span className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium">
                            Accepted
                        </span>
                    )}
                    {currentStatus === 'rejected' && (
                        <span className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-medium">
                            Rejected
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RequestCard;