import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { useQuery } from "@tanstack/react-query";

import userimg from "../../assets/user.png";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { districts, upazilas } = useLoaderData();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        avatar: "",
        bloodGroup: "",
        district: "",
        upazila: "",
    });

    const {
        data: profile,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["user-profile", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/profile/${user.email}`);
            return res.data;
        },
    });

    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name || "",
                email: profile.email || "",
                avatar: profile.avatar || "",
                bloodGroup: profile.bloodGroup || "",
                district: profile.district || "",
                upazila: profile.upazila || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "district") {
            setForm((prev) => ({
                ...prev,
                district: value,
                upazila: "",
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const selectedDistrict = useMemo(
        () => districts.find((d) => d.name === form.district),
        [districts, form.district]
    );

    const filteredUpazilas = useMemo(() => {
        if (!selectedDistrict) return [];
        return upazilas.filter((u) => u.district_id === selectedDistrict.id);
    }, [upazilas, selectedDistrict]);

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: form.name,
                bloodGroup: form.bloodGroup,
                district: form.district,
                upazila: form.upazila,
            };

            await axiosSecure.patch(`/users/profile/${user.email}`, payload);
            await refetch();
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile");
        }
    };

    if (isLoading || !profile) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>

                {!isEditing ? (
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            form="profile-form"
                            type="submit"
                            className="btn btn-sm btn-primary"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => {
                                setForm({
                                    name: profile.name || "",
                                    email: profile.email || "",
                                    avatar: profile.avatar || "",
                                    bloodGroup: profile.bloodGroup || "",
                                    district: profile.district || "",
                                    upazila: profile.upazila || "",
                                });
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-base-100 shadow rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="avatar">
                        <div className="w-20 rounded-full">
                            <img src={form.avatar || user?.photoURL || userimg} alt="Avatar" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">
                            {form.name || profile.name || "User"}
                        </h2>
                        <p className="text-sm text-gray-500">{form.email}</p>
                    </div>
                </div>

                <form
                    id="profile-form"
                    onSubmit={handleSave}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Name</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={form.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="input input-bordered w-full"
                            value={form.email}
                            disabled
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Blood Group</span>
                        </label>
                        <select
                            name="bloodGroup"
                            className="select select-bordered w-full"
                            value={form.bloodGroup}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select blood group</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg} value={bg}>
                                    {bg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">District</span>
                        </label>
                        <select
                            name="district"
                            className="select select-bordered w-full"
                            value={form.district}
                            onChange={handleChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.name}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Upazila</span>
                        </label>
                        <select
                            name="upazila"
                            className="select select-bordered w-full"
                            value={form.upazila}
                            onChange={handleChange}
                            disabled={!isEditing || !form.district}
                        >
                            <option value="">
                                {form.district ? "Select upazila" : "Select district first"}
                            </option>
                            {filteredUpazilas.map((u) => (
                                <option key={u.id} value={u.name}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;