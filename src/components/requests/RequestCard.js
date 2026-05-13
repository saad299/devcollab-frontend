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
        <div>
            <div>
                <div>
                    <Link href={`/profile/${requester_data.username}`}>
                        {requester_data.name}
                        {requester_data.avatar &&
                        <Image src={requester_data.avatar} alt={requester_data.name} width={40} height={40} />}
                        {requester_data.skills && (
                            <div>
                                {requester_data.skills.map((skill, index) => (
                                    <span key={index}>{skill}</span>
                                ))}
                            </div>
                        )}
                    </Link>
                    {/* This needs to be checked again. I have doubt that this will work. Remove this comment if this is working correctly. */}
                    {message.slice(0, 200) && (
                    <>
                        <p>
                            {message + '...'}
                        </p>
                        {message.length > 200 && (
                            <button>Read More</button>
                        )}
                    </>
                    )}
                </div>
                
                <div>
                    {currentStatus === 'pending' && (
                        <>
                            <button
                            className="bg-green-500 text-white hover:bg-green-200"
                            disabled={loading}
                            onClick={() => handleStatusUpdate('accepted')}>
                                {loading ? 'Updating...' : 'Accept'}
                            </button>
                            <button
                            className="bg-red-400 text-white hover:bg-red-300"
                            disabled={loading}
                            onClick={() => handleStatusUpdate('rejected')}>
                                {loading ? 'Updating...' : 'Reject'}
                            </button>
                        </>
                    )}
                    {currentStatus === 'accepted' && (
                        <span className="text-green-500">Accepted</span>
                    )}
                    {currentStatus === 'rejected' && (
                        <span className="text-red-500">Rejected</span>
                    )}
                </div>

                <div>

                </div>
            </div>
        </div>
    )
}

export default RequestCard;