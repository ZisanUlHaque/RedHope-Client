import React from "react";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";
import DonorDashboardHome from "./DonorDashboardHome";
import AdminDashboardHome from "./AdminDashboardHome";
import VolunteerDashboardHome from "./VolunteerDashboardHome";

const DashboardHome = () => {
    const { loading } = useAuth();
    const { role, roleLoading } = useRole();

    if (loading || roleLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    if (role === "admin") return <AdminDashboardHome />;
    if (role === "volunteer") return <VolunteerDashboardHome />;

    return <DonorDashboardHome />;
};

export default DashboardHome;