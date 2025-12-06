import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg from "../../assets/banner.jpg";
import { Link } from "react-router";

const Banner = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-5 py-10 px-4 md:px-8">
      {/* LEFT */}
      <div className="space-y-5 text-center md:text-left max-w-xl">
        <h1 className="text-4xl md:text-6xl font-semibold">
          Donate <span className="text-primary">Blood</span>, Keep the World
          Beating
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-5">
          <Link to='register'>
            {" "}
            <button className="btn btn-primary text-black rounded-2xl px-6">
              Join as a donor
            </button>
          </Link>

          <Link to="search">
            <button className="btn rounded-2xl px-6">Search Donors</button>
          </Link>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={bannerImg}
          className="w-full max-w-md md:max-w-full rounded-xl object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
