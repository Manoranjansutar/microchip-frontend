import React from "react";

const Footer = () => {
  return (
    <div className="flex items-center justify-center md:gap-[150px] bg-black md:px-20 md:py-20 text-white flex-col md:flex-row flex-wrap gap-4 align-baseline px-4 py-6 ">
      <h1 className="text-4xl ">ZOMATO</h1>
      <div className="flex flex-col">
        <h1 className="text-2xl">Company</h1>
        <p className="text-gray-400">About</p>
        <p className="text-gray-400">Careers</p>
        <p className="text-gray-400">Blog</p>
        <p className="text-gray-400">Team</p>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl">Contact Us</h1>
        <p className="text-gray-400">Help & Support</p>
        <p className="text-gray-400">Partner with us</p>
        <p className="text-gray-400">Ride with us</p>
        <p className="text-gray-400">Sitemap</p>
      </div>
      <div className="flex flex-col">
        <h1 className="text-2xl">Legal</h1>
        <p className="text-gray-400">Terms & Conditions</p>
        <p className="text-gray-400">Refund & Cancellation</p>
        <p className="text-gray-400">Privacy Policy</p>
        <p className="text-gray-400">Sitemap</p>
      </div>
    </div>
  );
};

export default Footer;
