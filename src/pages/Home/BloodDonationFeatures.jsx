import React, { useState } from 'react';

const featuresData = [
  {
    question: "How does blood donation work?",
    answer:
      "Blood donation involves a simple process where a donor's blood is collected safely and stored for patients in need. The process is quick, and the entire experience is designed to be comfortable and safe for donors.",
  },
  {
    question: "Is it safe to donate blood?",
    answer:
      "Yes, donating blood is a safe procedure. All equipment is sterile and used once. Trained medical professionals ensure your safety throughout the process.",
  },
  {
    question: "Who can donate blood?",
    answer:
      "Generally, healthy adults aged 18-65 can donate blood. Donors must meet certain health criteria and weight requirements to ensure safety.",
  },
  {
    question: "How often can I donate blood?",
    answer:
      "Most donors can donate whole blood every 8 weeks. Plasma and platelet donations have different intervals. It’s important to follow guidelines for safe donation frequency.",
  },
  {
    question: "What are the benefits of donating blood?",
    answer:
      "Donating blood helps save lives, supports community health, and can provide health benefits for the donor, such as improved cardiovascular health.",
  },
];

const BloodDonationFeatures = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFeature = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section className="py-20 px-6 bg-red-50">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-red-700 mb-4">
          Blood Donation Features
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn more about the key aspects and benefits of blood donation.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {featuresData.map((feature, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md">
            <button
              onClick={() => toggleFeature(index)}
              className="w-full flex justify-between items-center p-4 border-b border-gray-200 focus:outline-none"
            >
              <span className="text-gray-800 font-medium">{feature.question}</span>
              <span>{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="p-4 text-gray-600">
                {feature.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="px-6 py-3 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition duration-300">
          See More Features
        </button>
      </div>
    </section>
  );
};

export default BloodDonationFeatures;