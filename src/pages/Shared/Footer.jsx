import React from "react";
import Logo from "../../Components/logo";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

          <aside className="text-center md:text-left space-y-4">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>

            <h2 className="text-xl font-bold text-red-700">  Blood Donation </h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Connecting donors and saving lives. Your blood donation can give
              someone a second chance at life.
            </p>

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Blood Donation. All rights reserved.
            </p>
          </aside>

          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-red-700 cursor-pointer">Find a Donor</li>
              <li className="hover:text-red-700 cursor-pointer">Become a Donor</li>
              <li className="hover:text-red-700 cursor-pointer">Emergency Request</li>
              <li className="hover:text-red-700 cursor-pointer">Contact Us</li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex justify-center md:justify-end gap-5 text-2xl text-gray-600">

              <a href="#" aria-label="X" className="hover:text-black transition">
                <FaXTwitter />
              </a>

              <a href="#" aria-label="YouTube" className="hover:text-red-600 transition">
                <FaYoutube />
              </a>

              <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition">
                <FaInstagram />
              </a>

              <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition">
                <FaFacebookF />
              </a>

            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;