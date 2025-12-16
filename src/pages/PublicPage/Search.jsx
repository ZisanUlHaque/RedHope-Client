import React, { useMemo, useState } from "react";
import { useLoaderData } from "react-router";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Search = () => {
    const { districts, upazilas } = useLoaderData();

    const [form, setForm] = useState({
        bloodGroup: "",
        districtId: "",
        upazilaId: "",
    });

    const [donors, setDonors] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "districtId") {
            setForm((prev) => ({
                ...prev,
                districtId: value,
                upazilaId: "",
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const filteredUpazilas = useMemo(() => {
        if (!form.districtId) return [];
        return upazilas.filter((u) => u.district_id === form.districtId);
    }, [upazilas, form.districtId]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.bloodGroup || !form.districtId || !form.upazilaId) {
            setError("Please select blood group, district and upazila.");
            return;
        }

        setIsSearching(true);
        setHasSearched(true);

        const district = districts.find((d) => d.id === form.districtId);
        const upazila = filteredUpazilas.find((u) => u.id === form.upazilaId);

        try {
            const params = new URLSearchParams({
                role: "donor",
                status: "active",
                bloodGroup: form.bloodGroup,
                district: district?.name || "",
                upazila: upazila?.name || "",
            }).toString();

            const baseURL = import.meta.env.VITE_API_URL || "https://red-hope-server-alpha.vercel.app";
            const res = await fetch(`${baseURL}/users?${params}`);

            if (!res.ok) {
                throw new Error("Failed to fetch donors");
            }

            const data = await res.json();
            setDonors(data);
        } catch (err) {
            console.error(err);
            setError("Could not fetch data. Please try again.");
            setDonors([]);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Search Blood Donors
            </h1>

            <form
                onSubmit={handleSearch}
                className="bg-base-100 shadow rounded-lg p-4 md:p-6 space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-semibold">Blood Group</span>
                        </label>
                        <select
                            name="bloodGroup"
                            className="select select-bordered w-full"
                            value={form.bloodGroup}
                            onChange={handleChange}
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
                            name="districtId"
                            className="select select-bordered w-full"
                            value={form.districtId}
                            onChange={handleChange}
                        >
                            <option value="">Select district</option>
                            {districts.map((d) => (
                                <option key={d.id} value={d.id}>
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
                            name="upazilaId"
                            className="select select-bordered w-full"
                            value={form.upazilaId}
                            onChange={handleChange}
                            disabled={!form.districtId}
                        >
                            <option value="">
                                {form.districtId ? "Select upazila" : "Select district first"}
                            </option>
                            {filteredUpazilas.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {error && (
                    <p className="text-sm text-error mt-1">
                        {error}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSearching}
                    >
                        {isSearching ? "Searching..." : "Search"}
                    </button>
                </div>
            </form>

            {hasSearched && (
                <div className="mt-8">
                    {isSearching && (
                        <p className="text-center text-gray-500">Searching donors...</p>
                    )}

                    {!isSearching && donors.length === 0 && !error && (
                        <p className="text-center text-gray-500">
                            No donors found for this criteria.
                        </p>
                    )}

                    {!isSearching && donors.length > 0 && (
                        <>
                            <h2 className="text-xl font-semibold mb-4">
                                Found {donors.length} donor
                                {donors.length > 1 ? "s" : ""}
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {donors.map((donor) => (
                                    <div
                                        key={donor._id}
                                        className="card bg-base-100 shadow-sm border"
                                    >
                                        <div className="card-body">
                                            <div className="flex items-center gap-3 mb-2">
                                                {donor.avatar && (
                                                    <div className="avatar">
                                                        <div className="w-12 rounded-full">
                                                            <img src={donor.avatar} alt={donor.name} />
                                                        </div>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="card-title text-lg">
                                                        {donor.name || "Donor"}
                                                    </h3>
                                                    {donor.email && (
                                                        <p className="text-sm text-gray-500">
                                                            {donor.email}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <p>
                                                <span className="font-semibold">Blood Group:</span>{" "}
                                                {donor.bloodGroup || "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-semibold">Location:</span>{" "}
                                                {donor.district || "N/A"},{" "}
                                                {donor.upazila || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;