import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import News from "./News";

const slides = [
  {
    id: 1,
    img: "https://i.ibb.co.com/jPm0sdHz/8983180pic2.jpg",
  },
  {
    id: 2,
    img: "https://i.ibb.co.com/ynf4M3WW/7148629.jpg",
  },
  {
    id: 3,
    img: "https://i.ibb.co.com/Jjpn7gXh/8114901picc.jpg",
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <div className="relative w-full bg-red-50 ">
      <News></News>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 px-4"
      >
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-red-500">
          Donate Blood, Save Lives
        </h1>
        <p className="mt-4 text-lg text-red-800 font-semibold">
          A single donation can make a world of difference ❤️
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="register">
            <button className="btn btn-primary text-black rounded-2xl px-6">
              Join as a Donor
            </button>
          </Link>

          <Link to="search">
            <button className="btn rounded-2xl px-6">
              Search Donors
            </button>
          </Link>
        </div>
      </motion.div>

      <div
        className="relative w-11/12 md:w-10/12 mx-auto overflow-hidden rounded-2xl shadow-2xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            <img
              src={slide.img}
              alt="Blood Donation Banner"
              className="w-full h-[450px] object-cover rounded-2xl"
            />
          </div>
        ))}

        <button
          onClick={() =>
            setCurrent((current - 1 + slides.length) % slides.length)
          }
          className="btn btn-circle absolute left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white"
        >
          ❮
        </button>

        <button
          onClick={() => setCurrent((current + 1) % slides.length)}
          className="btn btn-circle absolute right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full ${
                index === current ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;