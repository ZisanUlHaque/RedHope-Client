import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const ContactUs = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact form data:", data);

    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "Thank you for contacting us. We will get back to you soon.",
    });

    reset();
  };

  return (
    <section className="bg-red-50 pt-10 md:px-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-red-700">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <form
            className="flex-1 bg-white p-6 rounded-lg shadow-lg space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              <label className="font-medium mb-1">Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="input input-bordered w-full rounded-lg"
                placeholder="Your Name"
              />
              {errors.name && (
                <p className="text-red-700 text-sm mt-1">Name is required</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input input-bordered w-full rounded-lg"
                placeholder="Your Email"
              />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">Email is required</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium mb-1">Message</label>
              <textarea
                {...register("message", { required: true })}
                className="input input-bordered w-full rounded-lg h-32 p-2"
                placeholder="Your Message"
              />
              {errors.message && (
                <p className="text-red-700 text-sm mt-1">Message is required</p>
              )}
            </div>

            <button className="btn btn-primary w-full mt-2 rounded-lg">
              Send Message
            </button>
          </form>

          <div className="flex-1 bg-white p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold mb-3">Get in Touch</h3>
            <p className=" text-gray-600">
              <span className="text-black font-medium">Phone:</span> +880 1234 567 890
            </p>
            <p className=" text-gray-600">
              <span className="text-black font-medium">Email:</span> info@blooddonation.com
            </p>
            <p className="mt-4 text-gray-600">
              We are always ready to answer your queries and help you with blood
              donations. Fill out the form or call us directly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;