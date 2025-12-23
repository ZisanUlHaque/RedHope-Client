import React from 'react';
import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";

const TestimonialsSection = () => {
    const testimonials = [
        {
            name: "Rahim, Donor",
            quote:
                "Donating blood for the first time was so fulfilling! Knowing that I could save someone's life motivated me to donate regularly.",
        },
        {
            name: "Sohana, Recipient",
            quote:
                "Thanks to a generous donor, I received blood during an emergency. Their selfless act gave me a second chance at life.",
        },
        {
            name: "Karim, Volunteer",
            quote:
                "Being part of blood donation drives has been a rewarding experience. Helping connect donors and patients makes a real impact.",
        },
    ];

    return (
        <section className="overflow-hidden py-5 px-6 bg-red-50">

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(248,113,113,0.12),transparent_60%)]"></div>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-5xl font-bold text-center mb-14 text-red-700 tracking-tight"
            >
                Stories of Life-Saving Impact
            </motion.h2>

            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 15px 35px rgba(248,113,113,0.25)",
                        }}
                        className="relative bg-white/70 backdrop-blur-md border border-red-100 rounded-3xl shadow-sm p-8 text-center hover:bg-white/90 transition-all"
                    >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-100 p-3 rounded-full shadow-md">
                            <Heart className="w-6 h-6 text-red-600" />
                        </div>

                        <p className="italic text-gray-700 mt-6 mb-3 text-lg leading-relaxed">
                            “{t.quote}”
                        </p>
                        <p className="text-sm font-medium text-red-800">— {t.name}</p>
                    </motion.div>
                ))}
            </div>
            <div className="mt-20 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
        </section>
    );
};

export default TestimonialsSection;