import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const password = watch("password");

  const handleLogin = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: `Welcome back, ${result.user.email}`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(location?.state || "/dashboard");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Check your credentials and try again",
        });
      });
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl p-6">
      <h3 className="text-3xl text-center font-semibold">Welcome back</h3>
      <p className="text-center text-gray-500 mb-4">Please login</p>

      <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
        
        <div className="flex flex-col">
          <label className="label font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full rounded-lg"
            placeholder="Email"
          />
          {errors.email?.type === "required" && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="label font-medium">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: true, minLength: 6 })}
            className="input input-bordered w-full rounded-lg pr-10"
            placeholder="Password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-sm mt-1">Password is required</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-sm mt-1">
              Password must be 6 characters or longer
            </p>
          )}
        </div>

        <div className="flex flex-col relative">
          <label className="label font-medium">Confirm Password</label>
          <input
            type={showConfirm ? "text" : "password"}
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === password || "Passwords do not match",
            })}
            className="input input-bordered w-full rounded-lg pr-10"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-sm text-gray-400">Forgot password?</span>
        </div>

        <button className="btn btn-neutral w-full mt-4 rounded-lg">Login</button>
      </form>

      <p className="text-center text-sm mt-4">
        New to Blood Donation?
        <Link
          state={location.state}
          className="text-blue-400 underline ml-1"
          to="/register"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;