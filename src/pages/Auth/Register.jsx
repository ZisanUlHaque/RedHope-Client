import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useLoaderData } from "react-router";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "./SocailLogin";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { districts, upazilas } = useLoaderData();
  const [filteredUpazila, setFilteredUpazila] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFilteredUpazila(
      upazilas.filter((u) => u.district_id == selectedDistrict)
    );
  };

  const handleRegistration = (data) => {
    const profileImg = data.photo[0];
    registerUser(data.email, data.password)
      .then(() => {
        const formData = new FormData();
        formData.append("image", profileImg);

        const image_API_URL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_image_host_key
        }`;
        axios.post(image_API_URL, formData).then((res) => {
          const userProfile = {
            displayName: data.name,
            photoURL: res.data.data.url,
          };
          updateUserProfile(userProfile)
            .then(() => navigate(location.state || "/"))
            .catch((err) => console.log(err));
        });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-md shadow-2xl p-6">
      <h3 className="text-3xl font-semibold text-center">Welcome to RedHope</h3>
      <p className="text-center text-gray-500 mb-4">Please Register</p>

      <form className="space-y-4" onSubmit={handleSubmit(handleRegistration)}>
        {/* Name */}
        <div className="flex flex-col">
          <label className="label font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: true })}
            className="input input-bordered w-full rounded-lg"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">Name is required.</p>
          )}
        </div>

        {/* Photo */}
        <div className="flex flex-col">
          <label className="label font-medium">Photo</label>
          <input
            type="file"
            {...register("photo", { required: true })}
            className="file-input file-input-bordered w-full rounded-lg"
          />
          {errors.photo && (
            <p className="text-red-500 text-sm mt-1">Photo is required.</p>
          )}
        </div>

        {/* District */}
        <div className="flex flex-col">
          <label className="label font-medium">District</label>
          <select
            className="select select-bordered w-full rounded-lg"
            {...register("district", { required: true })}
            onChange={handleDistrictChange}
          >
            <option value="">Select District</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">District is required.</p>
          )}
        </div>

        {/* Upazila */}
        <div className="flex flex-col">
          <label className="label font-medium">Upazila</label>
          <select
            className="select select-bordered w-full rounded-lg"
            {...register("upazila", { required: true })}
            disabled={filteredUpazila.length === 0}
          >
            <option value="">Select Upazila</option>
            {filteredUpazila.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.upazila && (
            <p className="text-red-500 text-sm mt-1">Upazila is required.</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="label font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full rounded-lg"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email is required.</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col relative w-full max-w-sm">
          <label className="label font-medium text-sm">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: true,
              minLength: 6,
              pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
            })}
            className="input input-bordered w-[calc(100%-2rem)] rounded-md h-9 pr-8 text-sm"
            placeholder="Password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-xs mt-1">Password is required.</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-xs mt-1">
              Password must be at least 6 characters.
            </p>
          )}
          {errors.password?.type === "pattern" && (
            <p className="text-red-500 text-xs mt-1">
              Password must include uppercase, lowercase, number & special char.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col relative w-full max-w-sm">
          <label className="label font-medium text-sm">Confirm Password</label>
          <input
            type={showConfirmPass ? "text" : "password"}
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="input input-bordered w-[calc(100%-2rem)] rounded-md h-9 pr-8 text-sm"
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 text-sm"
          >
            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.confirmPassword?.type === "required" && (
            <p className="text-red-500 text-xs mt-1">
              Confirm Password is required.
            </p>
          )}
          {errors.confirmPassword?.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button className="btn btn-neutral w-full mt-4 rounded-lg">
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?
        <Link
          state={location.state}
          className="text-blue-400 underline ml-1"
          to="/login"
        >
          Login
        </Link>
      </p>

      <SocialLogin />
    </div>
  );
};

export default Register;
