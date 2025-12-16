import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";



const EditDonationRequest = () => {
    const { donation, districts, upazilas } = useLoaderData();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        control,
    } = useForm({
        defaultValues: {
            requesterName: donation.requesterName || user?.displayName || "",
            requesterEmail: donation.requesterEmail || user?.email || "",
            recipientName: donation.recipientName || "",
            recipientDistrict: donation.recipientDistrict || "",
            recipientUpazila: donation.recipientUpazila || "",
            hospitalName: donation.hospitalName || "",
            fullAddress: donation.fullAddress || "",
            bloodGroup: donation.bloodGroup || "",
            donationDate: donation.donationDate || "",
            donationTime: donation.donationTime || "",
            requestMessage: donation.requestMessage || "",
        },
    });

    const recipientDistrict = useWatch({
        control,
        name: "recipientDistrict",
    });

    const upazilasByDistrict = (districtName) => {
        if (!districtName) return [];
        const selectedDistrict =
            districts.find((d) => d.name === districtName) ||
            districts.find((d) => d.district === districtName);
        if (!selectedDistrict) return [];
        return upazilas.filter(
            (u) =>
                u.district_id === selectedDistrict.id ||
                u.districtId === selectedDistrict.id
        );
    };

    const onSubmit = async (data) => {
        data.requesterName = user?.displayName || donation.requesterName;
        data.requesterEmail = user?.email || donation.requesterEmail;
        try {
            const result = await Swal.fire({
                title: "Update this request?",
                text: "Your donation request information will be updated.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, update",
            });

            if (!result.isConfirmed) return;

            await axiosSecure.patch(`/donation-requests/${donation._id}`, data);

            Swal.fire({
                icon: "success",
                title: "Updated!",
                text: "Donation request has been updated successfully.",
            });

            navigate("/dashboard/my-donation-requests");
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Update failed",
                text: "Could not update donation request. Please try again.",
            });
        }
    };

    return (
        <div>
            <h2 className="text-3xl md:text-4xl font-bold">Edit Donation Request</h2>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 p-4 text-black"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold">
                            Requester & Recipient
                        </h4>

                        <label className="label">Requester Name</label>
                        <input
                            type="text"
                            {...register("requesterName")}
                            readOnly
                            className="input w-full"
                        />

                        <label className="label mt-4">Requester Email</label>
                        <input
                            type="email"
                            {...register("requesterEmail")}
                            readOnly
                            className="input w-full"
                        />

                        <label className="label mt-4">Recipient Name</label>
                        <input
                            type="text"
                            {...register("recipientName")}
                            className="input w-full"
                            placeholder="Recipient Name"
                        />

                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">
                                Recipient District
                            </legend>
                            <select
                                {...register("recipientDistrict")}
                                className="select w-full"
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
                            <legend className="fieldset-legend">
                                Recipient Upazila
                            </legend>
                            <select
                                {...register("recipientUpazila")}
                                className="select w-full"
                                disabled={!recipientDistrict}
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
                            placeholder="Hospital name"
                        />

                        <label className="label mt-4">Full Address Line</label>
                        <input
                            type="text"
                            {...register("fullAddress")}
                            className="input w-full"
                            placeholder="Full address"
                        />

                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Blood Group</legend>
                            <select
                                {...register("bloodGroup")}
                                className="select w-full"
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
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Donation Time</label>
                                <input
                                    type="time"
                                    {...register("donationTime")}
                                    className="input w-full"
                                />
                            </fieldset>
                        </div>

                        <label className="label mt-4">Request Message</label>
                        <textarea
                            {...register("requestMessage")}
                            className="textarea textarea-bordered w-full"
                            rows={5}
                            placeholder="Explain in detail why you need blood"
                        />
                    </fieldset>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary mt-8 text-black"
                >
                    Update Donation Request
                </button>
            </form>
        </div>
    );
};

export default EditDonationRequest;