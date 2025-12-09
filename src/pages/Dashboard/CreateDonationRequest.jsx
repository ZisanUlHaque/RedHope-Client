import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';



import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CreateDonationRequest = () => {
    const {
        register,
        handleSubmit,
        control,
        reset
        // formState: { errors }
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // from router loader
    const { districts, upazilas } = useLoaderData();

    // watch selected district to filter upazilas
    const recipientDistrict = useWatch({ control, name: 'recipientDistrict' });

    const upazilasByDistrict = (districtName) => {
        if (!districtName) return [];

        // find selected district object
        const selectedDistrict = districts.find(
            (d) => d.name === districtName || d.district === districtName
        );
        if (!selectedDistrict) return [];

        // filter upazilas by district id (adjust keys if your json is different)
        return upazilas.filter(
            (u) =>
                u.district_id === selectedDistrict.id ||
                u.districtId === selectedDistrict.id
        );
    };

    const handleCreateRequest = (data) => {
        // force requester info from logged in user
        const donationRequest = {
            ...data,
            requesterName: user?.displayName,
            requesterEmail: user?.email,
            status: 'pending', // default status
            createdAt: new Date().toISOString()
        };

        Swal.fire({
            title: 'Create this request?',
            text: 'You are about to create a blood donation request.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.post('/donation-requests', donationRequest)
                    .then(res => {
                        // adjust according to your backend response
                        if (res.data.insertedId || res.data._id) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Request created',
                                text: 'Your blood donation request has been created successfully.'
                            });
                            // keep requester fields, clear rest
                            reset({
                                requesterName: user?.displayName || '',
                                requesterEmail: user?.email || ''
                            });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Failed',
                            text: 'Could not create donation request. Please try again.'
                        });
                    });
            }
        });
    };

    return (
        <div>
            <h2 className="text-5xl font-bold">Create Donation Request</h2>

            <form onSubmit={handleSubmit(handleCreateRequest)} className="mt-12 p-4 text-black">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left column: requester + recipient basic info */}
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold">Requester & Recipient</h4>

                        {/* requester name (read only) */}
                        <label className="label">Requester Name</label>
                        <input
                            type="text"
                            {...register('requesterName')}
                            defaultValue={user?.displayName || ''}
                            readOnly
                            className="input w-full"
                            placeholder="Requester Name"
                        />

                        {/* requester email (read only) */}
                        <label className="label mt-4">Requester Email</label>
                        <input
                            type="email"
                            {...register('requesterEmail')}
                            defaultValue={user?.email || ''}
                            readOnly
                            className="input w-full"
                            placeholder="Requester Email"
                        />

                        {/* recipient name */}
                        <label className="label mt-4">Recipient Name</label>
                        <input
                            type="text"
                            {...register('recipientName')}
                            className="input w-full"
                            placeholder="Recipient Name"
                        />

                        {/* recipient district */}
                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Recipient District</legend>
                            <select
                                {...register('recipientDistrict')}
                                defaultValue=""
                                className="select w-full"
                            >
                                <option value="" disabled>
                                    Pick a district
                                </option>
                                {
                                    districts?.map((d) => (
                                        <option key={d.id} value={d.name}>
                                            {d.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </fieldset>

                        {/* recipient upazila */}
                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Recipient Upazila</legend>
                            <select
                                {...register('recipientUpazila')}
                                defaultValue=""
                                className="select w-full"
                                disabled={!recipientDistrict}
                            >
                                <option value="" disabled>
                                    Pick an upazila
                                </option>
                                {
                                    upazilasByDistrict(recipientDistrict).map((u) => (
                                        <option key={u.id} value={u.name}>
                                            {u.name}
                                        </option>
                                    ))
                                }
                            </select>
                        </fieldset>
                    </fieldset>

                    {/* Right column: hospital + donation details */}
                    <fieldset className="fieldset">
                        <h4 className="text-2xl font-semibold">Donation Details</h4>

                        {/* hospital name */}
                        <label className="label">Hospital Name</label>
                        <input
                            type="text"
                            {...register('hospitalName')}
                            className="input w-full"
                            placeholder="e.g. Dhaka Medical College Hospital"
                        />

                        {/* full address line */}
                        <label className="label mt-4">Full Address Line</label>
                        <input
                            type="text"
                            {...register('fullAddress')}
                            className="input w-full"
                            placeholder="e.g. Zahir Raihan Rd, Dhaka"
                        />

                        {/* blood group */}
                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Blood Group</legend>
                            <select
                                {...register('bloodGroup')}
                                defaultValue=""
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

                        {/* date & time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <fieldset className="fieldset">
                                <label className="label">Donation Date</label>
                                <input
                                    type="date"
                                    {...register('donationDate')}
                                    className="input w-full"
                                />
                            </fieldset>

                            <fieldset className="fieldset">
                                <label className="label">Donation Time</label>
                                <input
                                    type="time"
                                    {...register('donationTime')}
                                    className="input w-full"
                                />
                            </fieldset>
                        </div>

                        {/* request message */}
                        <label className="label mt-4">Request Message</label>
                        <textarea
                            {...register('requestMessage')}
                            className="textarea textarea-bordered w-full"
                            rows={5}
                            placeholder="Explain in detail why you need blood"
                        />
                    </fieldset>
                </div>

                <input
                    type="submit"
                    className="btn btn-primary mt-8 text-black"
                    value="Request"
                />
            </form>
        </div>
    );
};

export default CreateDonationRequest;