import React from "react";
import findDonorImg from "../../assets/Doctor Taking Care of Patient.jpg"; 
import emergencyImg from "../../assets/download (7).jpg";
import supportImg from "../../assets/download (6).jpg";

const serviceData = [
  {
    title: "Find a Donor",
    desc: "Quickly search for available blood donors in your area. Connect with them safely and save lives.",
    img: findDonorImg,
  },
  {
    title: "Emergency Blood Requests",
    desc: "In critical situations, submit emergency blood requests to get immediate help from verified donors.",
    img: emergencyImg,
  },
  {
    title: "24/7 Support",
    desc: "Our support team is available around the clock to guide you through the donation process or urgent requests.",
    img: supportImg,
  },
];

const Divider = () => {
  return (
    <div className="w-full bg-[#fff5f5] py-12">
      <div className="m-5 hidden md:block">
        <div className="border-t-2 border-dotted border-red-300 mb-6"></div>
      </div>
      <h1 className="text-5xl font-bold text-red-700 text-center m-8 pb-4">Our Blood Donating Way</h1>

      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {serviceData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center bg-white rounded-2xl p-6 shadow-sm gap-6"
          >
            <div className="w-full md:w-1/3 flex justify-center">
              <img src={item.img} alt={item.title} className="w-38 md:w-46" />
            </div>

            <div className="hidden md:flex h-full justify-center">
              <div className="border-l-2 border-dotted border-red-300 h-32"></div>
            </div>

            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-semibold text-red-600">{item.title}</h2>
              <p className="text-gray-700 mt-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="m-5 hidden md:block">
        <div className="border-t-2 border-dotted border-red-300 mb-6"></div>
      </div>
    </div>
  );
};

export default Divider;