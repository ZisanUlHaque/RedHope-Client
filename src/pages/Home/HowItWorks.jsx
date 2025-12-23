import React from "react";
import { motion } from "framer-motion";
import { Users, Heart, ShieldCheck } from "lucide-react";

import step1 from "../../assets/Patient taking a medical examination illustrated _ Free Vector.jpg"; 
import step2 from "../../assets/Online-doctor-concept-ilustration _ Premium Vector.jpg";
import step3 from "../../assets/Nurse concept illustration _ Premium Vector.jpg";

const HowItWorks = () => {
  const steps = [
    {
      image: step1,
      icon: <Users className="w-10 h-10 text-red-700" />,
      title: "Register as a Donor",
      text: "Sign up quickly and create your donor profile with blood type and location to help those in need.",
    },
    {
      image: step2,
      icon: <Heart className="w-10 h-10 text-red-700" />,
      title: "Find or Request Blood",
      text: "Search for available donors nearby or submit a blood request during emergencies to save lives instantly.",
    },
    {
      image: step3,
      icon: <ShieldCheck className="w-10 h-10 text-red-700" />,
      title: "Donate & Save Lives",
      text: "Go to the nearest donation center, donate safely, and make a direct impact on patients who need blood.",
    },
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-red-50 to-white overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(248,113,113,0.25),transparent_50%)]"></div>

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-14 text-red-700 tracking-tight">
        How Blood Donation Works
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
        {steps.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.7, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 15px 35px rgba(248,113,113,0.25)",
            }}
            className="rounded-3xl overflow-hidden shadow-md bg-white border border-red-100 hover:border-red-200 transition-all duration-300 cursor-pointer backdrop-blur-sm"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-center justify-center">
                <div className="bg-white/90 p-3 rounded-full shadow-md">
                  {item.icon}
                </div>
              </div>
            </div>

            <div className="p-6 text-center">
              <h3 className="font-semibold text-lg text-red-700 mb-2">{item.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;