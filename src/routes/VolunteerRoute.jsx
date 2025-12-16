import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import Forbidden from "../Components/Forbidden";


const VolunteerRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-infinity loading-xl" />
      </div>
    );
  }

  if (role !== "volunteer") {
    return <Forbidden />;
  }

  return children;
};

export default VolunteerRoute;