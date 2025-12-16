import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ["all-users", statusFilter],
        queryFn: async () => {
            const params = {};
            if (statusFilter !== "all") params.status = statusFilter;
            const res = await axiosSecure.get("/users", { params });
            return res.data;
        },
    });

    const handleStatusChange = async (user, newStatus) => {
        const result = await Swal.fire({
            title: `Change status to ${newStatus}?`,
            icon: "question",
            showCancelButton: true,
        });
        if (!result.isConfirmed) return;

        await axiosSecure.patch(`/users/${user._id}/status`, { status: newStatus });
        refetch();
    };

    const handleRoleChange = async (user, newRole) => {
        const result = await Swal.fire({
            title: `Make ${newRole}?`,
            text: `${user.email} will become ${newRole}.`,
            icon: "question",
            showCancelButton: true,
        });
        if (!result.isConfirmed) return;

        await axiosSecure.patch(`/users/${user._id}/role`, { role: newRole });
        refetch();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">All Users</h1>

                <div className="flex gap-2">
                    {["all", "active", "blocked"].map((s) => (
                        <button
                            key={s}
                            className={`btn btn-sm ${statusFilter === s ? "btn-primary" : "btn-outline"
                                }`}
                            onClick={() => setStatusFilter(s)}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Avatar</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan="7" className="text-center py-6">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!isLoading && users.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6">
                                    No users found.
                                </td>
                            </tr>
                        )}

                        {!isLoading &&
                            users.map((user, idx) => (
                                <tr key={user._id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-10 rounded-full">
                                                {user.avatar && (
                                                    <img src={user.avatar} alt={user.name} />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>{user.name}</td>
                                    <td className="capitalize">{user.role}</td>
                                    <td className="capitalize">{user.status}</td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {user.status === "active" ? (
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => handleStatusChange(user, "blocked")}
                                                >
                                                    Block
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-xs btn-success"
                                                    onClick={() => handleStatusChange(user, "active")}
                                                >
                                                    Unblock
                                                </button>
                                            )}

                                            {user.role !== "volunteer" && (
                                                <button
                                                    className="btn btn-xs btn-info"
                                                    onClick={() => handleRoleChange(user, "volunteer")}
                                                >
                                                    Make Volunteer
                                                </button>
                                            )}

                                            {user.role !== "admin" && (
                                                <button
                                                    className="btn btn-xs btn-warning"
                                                    onClick={() => handleRoleChange(user, "admin")}
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;