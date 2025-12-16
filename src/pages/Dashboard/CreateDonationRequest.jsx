import React, { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreateDonationRequest = () => {
    const {
        register,
        handleSubmit,
        control,
        reset,
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { districts, upazilas } = useLoaderData();

    const recipientDistrict = useWatch({ control, name: "recipientDistrict" });

    const upazilasByDistrict = (districtName) => {
        if (!districtName) return [];

        const selectedDistrict = districts.find(
            (d) => d.name === districtName || d.district === districtName
        );
        if (!selectedDistrict) return [];

        return upazilas.filter(
            (u) =>
                u.district_id === selectedDistrict.id ||
                u.districtId === selectedDistrict.id
        );
    };

    const { data: profile, isLoading: profileLoading } = useQuery({
        queryKey: ["user-profile", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/profile/${user.email}`);
            return res.data;
        },
    });

    const isBlocked = profile?.status === "blocked";

    const handleCreateRequest = (data) => {
        if (isBlocked) {
            Swal.fire({
                icon: "error",
                title: "You are blocked",
                text: "Blocked users cannot create donation requests.",
            });
            return;
        }

        const donationRequest = {
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        Swal.fire({
            title: "Create this request?",
            text: "You are about to create a blood donation request.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, create",
        }).then((result) => {
            if (!result.isConfirmed) return;

            axiosSecure
                .post("/donation-requests", donationRequest)
                .then((res) => {
                    if (res.data.insertedId || res.data._id) {
                        Swal.fire({
                            icon: "success",
                            title: "Request created",
                            text: "Your blood donation request has been created successfully.",
                        });
                        reset({
                            requesterName: user?.displayName || "",
                            requesterEmail: user?.email || "",
                            recipientName: "",
                            recipientDistrict: "",
                            recipientUpazila: "",
                            hospitalName: "",
                            fullAddress: "",
                            bloodGroup: "",
                            donationDate: "",
                            donationTime: "",
                            requestMessage: "",
                        });
                    }
                })
                .catch((err) => {
                    console.error(err);
                    if (err.response?.status === 403) {
                        Swal.fire({
                            icon: "error",
                            title: "You are blocked",
                            text: err.response.data?.message ||
                                "Blocked users cannot create donation requests.",
                        });
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Failed",
                            text: "Could not create donation request. Please try again.",
                        });
                    }
                });
        });
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center py-10">
                <span className="loading loading-spinner loading-lg" />
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-5xl font-bold">Create Donation Request</h2>

            {isBlocked && (
                <div className="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm max-w-3xl">
                    Your account is currently <span className="font-semibold">blocked</span>.
                    You are not allowed to create any donation request. Please contact the
                    administrator.
                </div>
            )}

            <form
                onSubmit={handleSubmit(handleCreateRequest)}
                className="mt-12 p-4 text-black"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold">Requester & Recipient</h4>

                        <label className="label">Requester Name</label>
                        <input
                            type="text"
                            {...register("requesterName")}
                            defaultValue={user?.displayName || ""}
                            readOnly
                            className="input w-full"
                            placeholder="Requester Name"
                        />
                        <label className="label mt-4">Requester Email</label>
                        <input
                            type="email"
                            {...register("requesterEmail")}
                            defaultValue={user?.email || ""}
                            readOnly
                            className="input w-full"
                            placeholder="Requester Email"
                        />

                        <label className="label mt-4">Recipient Name</label>
                        <input
                            type="text"
                            {...register("recipientName")}
                            className="input w-full"
                            placeholder="Recipient Name"
                            disabled={isBlocked}
                        />

                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Recipient District</legend>
                            <select
                                {...register("recipientDistrict")}
                                defaultValue=""
                                className="select w-full"
                                disabled={isBlocked}
                            >
                                <option value="" disabled>
                                    Pick a district
                                </option>
                                {districts?.map((d) => (
                                    <option key={d.id} value={d.name}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>

                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Recipient Upazila</legend>
                            <select
                                {...register("recipientUpazila")}
                                defaultValue=""
                                className="select w-full"
                                disabled={!recipientDistrict || isBlocked}
                            >
                                <option value="" disabled>
                                    Pick an upazila
                                </option>
                                {upazilasByDistrict(recipientDistrict).map((u) => (
                                    <option key={u.id} value={u.name}>
                                        {u.name}
                                    </option>
                                ))}
                            </select>
                        </fieldset>
                    </fieldset>

                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold">Donation Details</h4>

                        <label className="label">Hospital Name</label>
                        <input
                            type="text"
                            {...register("hospitalName")}
                            className="input w-full"
                            placeholder="e.g. Dhaka Medical College Hospital"
                            disabled={isBlocked}
                        />

                        <label className="label mt-4">Full Address Line</label>
                        <input
                            type="text"
                            {...register("fullAddress")}
                            className="input w-full"
                            placeholder="e.g. Zahir Raihan Rd, Dhaka"
                            disabled={isBlocked}
                        />

                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Blood Group</legend>
                            <select
                                {...register("bloodGroup")}
                                defaultValue=""
                                className="select w-full"
                                disabled={isBlocked}
                            >
                                <option value="" disabled>
                                    Select blood group
                                </option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </fieldset>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <fieldset className="fieldset">
                                <label className="label">Donation Date</label>
                                <input
                                    type="date"
                                    {...register("donationDate")}
                                    className="input w-full"
                                    disabled={isBlocked}
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Donation Time</label>
                                <input
                                    type="time"
                                    {...register("donationTime")}
                                    className="input w-full"
                                    disabled={isBlocked}
                                />
                            </fieldset>
                        </div>

                        <label className="label mt-4">Request Message</label>
                        <textarea
                            {...register("requestMessage")}
                            className="textarea textarea-bordered w-full"
                            rows={5}
                            placeholder="Explain in detail why you need blood"
                            disabled={isBlocked}
                        />
                    </fieldset>
                </div>

                <input
                    type="submit"
                    className="btn btn-primary mt-8 text-black"
                    value="Request"
                    disabled={isBlocked}
                />
            </form>
        </div>
    );
};

export default CreateDonationRequest;