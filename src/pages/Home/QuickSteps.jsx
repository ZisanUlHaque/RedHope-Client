import React from "react";
import { UserPlus, MapPin, Heart } from "lucide-react";

const steps = [
  {
    title: "Register Online",
    description:
      "Sign up on our platform and create your donor profile to get started.",
    icon: <UserPlus className="w-12 h-12 text-red-600" />,
  },
  {
    title: "Visit a Blood Donation Center",
    description:
      "Find the nearest blood donation center and schedule your visit easily.",
    icon: <MapPin className="w-12 h-12 text-red-600" />,
    
  },
  {
    title: "Save Lives",
    description:
      "Donate blood and make a difference. Every drop counts to save lives.",
    icon: <Heart className="w-12 h-12 text-red-600" />,
    
  },
];

const QuickSteps = () => {
  return (
    <section className="pt-15 pb-5 px-6 bg-red-50">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">
          Quick Steps to Donate Blood
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Donating blood is easy. Follow these simple steps and become a hero today!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-8 shadow-md flex flex-col items-center text-center hover:shadow-xl transition-shadow"
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold text-red-700 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 text-sm">{step.description}</p>
            <div className="mt-4 flex justify-center items-center text-red-600 font-bold text-2xl">
              Step {index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default QuickSteps;