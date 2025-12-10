import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";



const DonorDashboardHome = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: requests = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myRecentRequests", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/donation-requests?email=${user.email}`
      );
      return res.data;
    },
  });

  const recentRequests = useMemo(() => {
    if (!requests.length) return [];
    const sorted = [...requests].sort((a, b) => {
      const aDate = new Date(
        a.createdAt || `${a.donationDate} ${a.donationTime || "00:00"}`
      );
      const bDate = new Date(
        b.createdAt || `${b.donationDate} ${b.donationTime || "00:00"}`
      );
      return bDate - aDate;
    });
    return sorted.slice(0, 3);
  }, [requests]);

  const renderStatusBadge = (status) => {
    let cls = "badge";
    if (status === "pending") cls += " badge-warning";
    else if (status === "inprogress") cls += " badge-info";
    else if (status === "done") cls += " badge-success";
    else if (status === "canceled") cls += " badge-error";
    return <span className={cls}>{status}</span>;
  };

  const updateStatus = async (request, newStatus) => {
    const result = await Swal.fire({
      title: `Mark as ${newStatus}?`,
      text: `This will change status from "${request.status}" to "${newStatus}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.patch(`/donation-requests/${request._id}`, {
        status: newStatus,
      });
      await refetch();
      Swal.fire({
        icon: "success",
        title: "Status updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "Could not update status. Please try again.",
      });
    }
  };

  const handleDelete = async (request) => {
    const result = await Swal.fire({
      title: "Delete this request?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosSecure.delete(`/donation-requests/${request._id}`);
      await refetch();
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: "Could not delete request. Please try again.",
      });
    }
  };

  return (
    <div>
      {/* Welcome */}
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Welcome, {user?.displayName || "Donor"}
      </h2>

      {isLoading && (
        <p className="mt-4">Loading your recent donation requests...</p>
      )}

      {/* Recent donation requests (max 3) */}
      {!isLoading && recentRequests.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-semibold">
              My Recent Donation Requests
            </h3>

            <button
              className="btn btn-sm btn-outline"
              onClick={() => navigate("/dashboard/my-donation-requests")}
            >
              View my all requests
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Donor Info</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request, index) => (
                  <tr key={request._id}>
                    <td>{index + 1}</td>
                    <td>{request.recipientName}</td>
                    <td>
                      {request.recipientDistrict}, {request.recipientUpazila}
                    </td>
                    <td>{request.donationDate}</td>
                    <td>{request.donationTime}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{renderStatusBadge(request.status)}</td>

                    {/* Donor info (only meaningful when inprogress) */}
                    <td>
                      {request.status === "inprogress" && request.donorName ? (
                        <div>
                          <div className="font-medium">{request.donorName}</div>
                          <div className="text-xs text-gray-500">
                            {request.donorEmail}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex flex-col gap-1">
                        {/* Done / Cancel buttons only while status === inprogress */}
                        {request.status === "inprogress" && (
                          <div className="flex gap-1">
                            <button
                              className="btn btn-xs btn-success"
                              onClick={() => updateStatus(request, "done")}
                            >
                              Done
                            </button>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() =>
                                updateStatus(request, "canceled")
                              }
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div className="flex gap-1 mt-1">
                          <button
                            className="btn btn-xs btn-info"
                            onClick={() =>
                              navigate(
                                `/dashboard/donation-requests/${request._id}`
                              )
                            }
                          >
                            View
                          </button>
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() =>
                              navigate(
                                `/dashboard/edit-donation-request/${request._id}`
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => handleDelete(request)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default DonorDashboardHome;