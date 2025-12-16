import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const DonationRequestDetails = () => {
    const { donation } = useLoaderData();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [current, setCurrent] = useState(donation);
    const [donateModalOpen, setDonateModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    if (!current) {
        return (
            <div className="py-10 text-center">
                <p className="text-gray-500">Donation request not found.</p>
            </div>
        );
    }

    const isOwner = current.requesterEmail === user?.email;
    const canDonate =
        !isOwner && current.status === "pending" && !!user?.email;

    const renderStatusBadge = (status) => {
        let cls = "badge";
        if (status === "pending") cls += " badge-warning";
        else if (status === "inprogress") cls += " badge-info";
        else if (status === "done") cls += " badge-success";
        else if (status === "canceled") cls += " badge-error";
        return <span className={cls}>{status}</span>;
    };

    const handleConfirmDonate = async () => {
        setUpdating(true);
        try {
            await axiosSecure.patch(`/donation-requests/${current._id}`, {
                status: "inprogress",
                donorName: user.displayName || user.email,
                donorEmail: user.email,
            });

            setCurrent((prev) => ({
                ...prev,
                status: "inprogress",
                donorName: user.displayName || user.email,
                donorEmail: user.email,
            }));

            setDonateModalOpen(false);

            Swal.fire({
                icon: "success",
                title: "Thank you for volunteering!",
                text: "The request status is now inprogress.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Failed to confirm donation",
                text: "Please try again.",
            });
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <button className="btn btn-sm btn-outline mb-4" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1 className="text-2xl md:text-3xl font-bold mb-4">
                Donation Request Details
            </h1>

            <div className="bg-base-100 shadow rounded-lg p-4 md:p-6 space-y-3 text-sm md:text-base">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p>
                            <span className="font-semibold">Recipient Name:</span>{" "}
                            {current.recipientName}
                        </p>
                        <p>
                            <span className="font-semibold">Location:</span>{" "}
                            {current.recipientDistrict}, {current.recipientUpazila}
                        </p>
                        <p>
                            <span className="font-semibold">Hospital:</span>{" "}
                            {current.hospital || "N/A"}
                        </p>
                        <p>
                            <span className="font-semibold">Full Address:</span>{" "}
                            {current.fullAddress || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p>
                            <span className="font-semibold">Blood Group:</span>{" "}
                            {current.bloodGroup}
                        </p>
                        <p>
                            <span className="font-semibold">Date:</span>{" "}
                            {current.donationDate}
                        </p>
                        <p>
                            <span className="font-semibold">Time:</span>{" "}
                            {current.donationTime}
                        </p>
                        <p className="flex items-center gap-2">
                            <span className="font-semibold">Status:</span>
                            {renderStatusBadge(current.status)}
                        </p>
                    </div>
                </div>

                <hr className="my-3" />

                <p>
                    <span className="font-semibold">Requester Name:</span>{" "}
                    {current.requesterName}
                </p>
                <p>
                    <span className="font-semibold">Requester Email:</span>{" "}
                    {current.requesterEmail}
                </p>

                {current.requestMessage && (
                    <p className="mt-2">
                        <span className="font-semibold">Request Message:</span>{" "}
                        {current.requestMessage}
                    </p>
                )}

                {current.donorName && (
                    <p className="mt-2">
                        <span className="font-semibold">Current Donor:</span>{" "}
                        {current.donorName} ({current.donorEmail})
                    </p>
                )}
            </div>

            {canDonate && (
                <div className="mt-6">
                    <button
                        className="btn btn-primary"
                        onClick={() => setDonateModalOpen(true)}
                    >
                        Donate
                    </button>
                </div>
            )}

            {!canDonate && (
                <p className="mt-4 text-sm text-gray-400">
                    {isOwner
                        ? "You created this request."
                        : current.status !== "pending"
                            ? "This request is not pending anymore."
                            : ""}
                </p>
            )}

            {donateModalOpen && (
                <dialog
                    className="modal modal-open"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setDonateModalOpen(false);
                    }}
                >
                    <div className="modal-box max-w-md">
                        <h3 className="font-bold text-lg mb-3">
                            Confirm Your Donation
                        </h3>

                        <p className="text-sm text-gray-500 mb-3">
                            Please confirm your details. Your name and email will be shared
                            with the requester.
                        </p>

                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-semibold">Donor Name:</span>{" "}
                                {user?.displayName || "N/A"}
                            </div>
                            <div>
                                <span className="font-semibold">Donor Email:</span>{" "}
                                {user?.email}
                            </div>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setDonateModalOpen(false)}
                                disabled={updating}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirmDonate}
                                disabled={updating}
                            >
                                {updating ? "Confirming..." : "Confirm Donation"}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default DonationRequestDetails;