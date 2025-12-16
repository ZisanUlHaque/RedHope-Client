import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useLoaderData } from "react-router";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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

  const isPasswordValid = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasMinLength = password.length >= 6;
    const hasSymbol = /[^A-Za-z0-9]/.test(password); 

    return hasUppercase && hasLowercase && hasMinLength && hasSymbol;
  };


  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFilteredUpazila(
      upazilas.filter((u) => u.district_id == selectedDistrict)
    );
  };

  const handleRegistration = async (data) => {
    try {
      const profileImg = data.photo[0];
      await registerUser(data.email, data.password);
      let photoURL = "";
      if (profileImg) {
        const formData = new FormData();
        formData.append("image", profileImg);

        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key
          }`;

        const imgRes = await axios.post(image_API_URL, formData);
        photoURL = imgRes.data.data.url;
      }
      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });
      const selectedDistrict = districts.find(
        (d) => d.id == data.district
      );

      const newUser = {
        name: data.name,
        email: data.email,
        avatar: photoURL,
        bloodGroup: data.bloodGroup,
        district: selectedDistrict?.name || "",
        upazila: data.upazila,
      };

      const baseURL =
        import.meta.env.VITE_API_URL || "https://red-hope-server-alpha.vercel.app";

      await axios.post(`${baseURL}/users`, newUser);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Welcome to Blood Donation 🩸",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate(location.state || "/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-md shadow-2xl p-6">
      <h3 className="text-3xl font-semibold text-center">
        Welcome to Blood Donation
      </h3>
      <p className="text-center text-gray-500 mb-4">Please Register</p>

      <form className="space-y-4" onSubmit={handleSubmit(handleRegistration)}>
        
        <div>
          <input
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 5,
                message: "Name should be at least 5 characters",
              },
            })}
            className="input input-bordered w-full"
            placeholder="Your Name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            {...register("photo", { required: "Photo is required" })}
            className="file-input file-input-bordered w-full"
          />
          {errors.photo && (
            <p className="text-red-500 text-xs">{errors.photo.message}</p>
          )}
        </div>

        <select
          {...register("bloodGroup", { required: "Blood group is required" })}
          className="select select-bordered w-full"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>
        {errors.bloodGroup && (
          <p className="text-red-500 text-xs">
            {errors.bloodGroup.message}
          </p>
        )}

        <select
          {...register("district", { required: "District is required" })}
          onChange={handleDistrictChange}
          className="select select-bordered w-full"
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          {...register("upazila", { required: "Upazila is required" })}
          className="select select-bordered w-full"
          disabled={!filteredUpazila.length}
        >
          <option value="">Select Upazila</option>
          {filteredUpazila.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

       
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="input input-bordered w-full"
          placeholder="Email"
        />

        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", {
              required: "Password is required",
              validate: (value) =>
                isPasswordValid(value) ||
                "Password must be at least 6 characters and include uppercase, lowercase, and a special character.",
            })}

            className="input input-bordered w-full pr-10"
            placeholder="Password"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password.message}</p>
        )}
        <div className="relative">
          <input
            type={showConfirmPass ? "text" : "password"}
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            className="input input-bordered w-full pr-10"
            placeholder="Confirm Password"
          />
          <span
            onClick={() => setShowConfirmPass(!showConfirmPass)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs">
            {errors.confirmPassword.message}
          </p>
        )}

        <button className="btn btn-neutral w-full mt-4">
          Register
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        Already have an account?
        <Link to="/login" className="text-blue-400 underline ml-1">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;