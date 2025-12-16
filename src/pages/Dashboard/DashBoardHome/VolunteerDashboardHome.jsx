import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const VolunteerDashboardHome = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading } = useQuery({
        queryKey: ["dashboard-stats-volunteer"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard-stats");
            return res.data;
        },
    });

    return (
        <div className="space-y-6">
            <div className="bg-base-100 shadow rounded-lg p-4 md:p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome, {user?.displayName || "Volunteer"}
                </h1>
                <p className="text-sm text-gray-500">
                    Help manage and coordinate all blood donation requests.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Total Donors</div>
                        <div className="stat-value text-primary">
                            {stats?.totalDonors ?? 0}
                        </div>
                        <div className="stat-desc">Registered donors</div>
                    </div>

                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Total Funding</div>
                        <div className="stat-value text-secondary">
                            ${stats?.totalFunding ?? 0}
                        </div>
                        <div className="stat-desc">All funds collected</div>
                    </div>

                    <div className="stat bg-base-100 shadow rounded-lg">
                        <div className="stat-title">Total Requests</div>
                        <div className="stat-value text-accent">
                            {stats?.totalDonationRequests ?? 0}
                        </div>
                        <div className="stat-desc">Blood donation requests</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VolunteerDashboardHome;