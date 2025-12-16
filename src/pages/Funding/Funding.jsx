import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Funding = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const [amount, setAmount] = useState("");
  const [creating, setCreating] = useState(false);

  const {
    data: fundings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["fundings"],
    queryFn: async () => {
      const res = await axiosSecure.get("/fundings");
      return res.data;
    },
  });

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) return;

    const confirmFunding = async () => {
      try {
        const res = await axiosSecure.get(
          `/funding-success?session_id=${sessionId}`
        );
        if (res.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Thank you for your support!",
            text: "Your funding has been recorded.",
            timer: 2000,
            showConfirmButton: false,
          });
          refetch();
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Failed to confirm payment",
        });
      } finally {
        setSearchParams({});
      }
    };

    confirmFunding();
  }, [searchParams, axiosSecure, refetch, setSearchParams]);

  const handleGiveFund = async (e) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);

    if (!numericAmount || numericAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Invalid amount",
        text: "Please enter a valid amount.",
      });
      return;
    }

    setCreating(true);
    try {
      const { data } = await axiosSecure.post("/funding-checkout-session", {
        amount: numericAmount,
        donorName: user.displayName || user.email,
        donorEmail: user.email,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout url received");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to start payment",
        text: "Please try again.",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Funding & Donations
      </h1>

      <div className="bg-base-100 shadow rounded-lg p-4 md:p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Give Fund</h2>
        <p className="text-sm text-gray-500 mb-4">
          Support the organization by donating a small amount. Payment is
          processed securely via Stripe.
        </p>

        <form
          onSubmit={handleGiveFund}
          className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
        >
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Amount (USD)</span>
            </label>
            <input
              type="number"
              min="1"
              className="input input-bordered w-40"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={creating}
          >
            {creating ? "Redirecting..." : "Give Fund"}
          </button>
        </form>
      </div>
      <div className="bg-base-100 shadow rounded-lg p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">All Funds</h2>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading fundings...</p>
        ) : fundings.length === 0 ? (
          <p className="text-center text-gray-500">
            No funding records found yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Donor</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {fundings.map((fund, idx) => (
                  <tr key={fund._id}>
                    <td>{idx + 1}</td>
                    <td>{fund.donorName || "Anonymous"}</td>
                    <td className="text-sm text-gray-500">
                      {fund.donorEmail || "N/A"}
                    </td>
                    <td>${fund.amount}</td>
                    <td>{fund.currency?.toUpperCase()}</td>
                    <td>
                      {fund.createdAt
                        ? new Date(fund.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Funding;