import React from "react";
import Logo from "../Components/logo";
import image from '../assets/image.png'
import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Logo></Logo>
      <div className="flex">
        <div className="flex-1">
          <Outlet></Outlet>
        </div>
        <div className="flex-1">
            <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
