import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DonationRequests = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: requests = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["public-pending-requests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/donation-requests", {
                params: { status: "pending" },
            });
            return res.data;
        },
    });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Blood Donation Requests
            </h1>
            <p className="text-center text-gray-500 mb-6">
                Showing all <span className="font-semibold">pending</span> donation
                requests.
            </p>

            {isLoading && (
                <p className="text-center text-gray-500">Loading requests...</p>
            )}

            {isError && (
                <p className="text-center text-error">
                    Failed to load requests: {error.message}
                </p>
            )}

            {!isLoading && !isError && requests.length === 0 && (
                <p className="text-center text-gray-500">
                    No pending donation requests found.
                </p>
            )}

            {!isLoading && !isError && requests.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="card bg-base-100 shadow-sm border h-full flex flex-col"
                        >
                            <div className="card-body flex-1">
                                <h3 className="card-title text-lg mb-1">
                                    {req.recipientName || "Recipient"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {req.recipientDistrict}, {req.recipientUpazila}
                                </p>

                                <p>
                                    <span className="font-semibold">Blood Group:</span>{" "}
                                    {req.bloodGroup}
                                </p>
                                <p>
                                    <span className="font-semibold">Date:</span>{" "}
                                    {req.donationDate}
                                </p>
                                <p>
                                    <span className="font-semibold">Time:</span>{" "}
                                    {req.donationTime}
                                </p>
                            </div>
                            <div className="card-actions justify-end p-4 pt-0">
                                <Link
                                    to={`/donation-requests/${req._id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonationRequests;