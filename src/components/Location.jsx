import React, { useEffect, useRef, useState } from "react";
import { IoLocation } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MdOutlineMyLocation } from "react-icons/md";
import { FaHome, FaPlus, FaUserFriends } from "react-icons/fa";
import Modal from "./Modal";
import axios from "axios";
import { FaSuitcase } from "react-icons/fa6";

const Location = () => {
  const [open, setOpen] = useState(false); // opens navbar's location dropdown
  const [openModal, setOpenModal] = useState(false); //opens Location modal
  const [currentLocation, setCurrentLocation] = useState("Marathahalli"); // default location
  const [getAddress, setGetAddress] = useState([]); // stores all saved address

  //function to toggle navbar's location dropdown
  const handleClick = () => {
    setOpen(!open);
  };
  //function to open Location modal
  const handleModal = () => {
    setOpenModal(true);
    setOpen(false);
  };

  const modalRef = useRef(); //ref for dropdown close when clicked outside

  //function to close dropdown when clicked outside
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //function to get current location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAofrxaZbc3A2q7oKSXHoZzGPgoiU6XDV4`
          );

          if (response.data.results.length > 0) {
            const address = response.data.results[0].formatted_address;
            setCurrentLocation(address);
          } else {
            console.error("No address found for the given coordinates.");
          }
        },
        (error) => {
          console.error("Error detecting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  //function to fetch saved address
  useEffect(() => {
    const savedLocation = async () => {
      try {
        const response = await axios.get(
          "https://microchip-backend.onrender.com/api/microchip/getAddress"
        );
        console.log(response.data);
        setGetAddress(response.data);
        console.log("Address fetched:", getAddress);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    savedLocation();
  }, []);

  return (
    <div className="" ref={modalRef}>
      <div
        className="flex md:w-[240px] justify-between items-center md:px-4 md:py-4 relative w-[200px] px-3 py-3"
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <div className="flex gap-1 ">
          <IoLocation className="text-2xl text-[#EF4F5F]" />
          <p className="truncate md:w-[150px] w-[120px]">{currentLocation}</p>
        </div>
        <div onClick={handleClick}>
          {!open ? (
            <IoIosArrowDown className="text-xl pointer-events-auto" />
          ) : (
            <IoIosArrowUp className="text-xl pointer-events-auto" />
          )}
        </div>
      </div>
      <div
        className={`w-[300px] h-[400px] absolute top-[90px] bg-white text-[#EF4F5F] px-4 font-semibold ${
          open ? "block" : "hidden"
        }`}
        style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <h1
          className="flex items-center gap-2 p-3 text-lg text-center cursor-pointer hover:bg-gray-200"
          onClick={detectLocation}
        >
          <MdOutlineMyLocation />
          <span className="text-black"> Detect Current Location</span>
        </h1>
        <div onClick={handleModal} className="pointer-event">
          <h1 className="flex items-center gap-2 p-3 text-center hover:bg-gray-200">
            <FaPlus /> Add Address
          </h1>
        </div>
        <p className="p-3 text-gray-500">Saved Addresses</p>
        <div className="overflow-y-auto h-[200px] overflow-x-hidden">
          {getAddress.length > 0 ? (
            getAddress.map((address, index) => (
              <div key={index} className="flex gap-2 p-3 hover:bg-gray-200 ">
                <div className="md:w-[10%] ">
                  {address.addressType === "Home" ? (
                    <FaHome className="text-xl text-[#EF4F5F]" />
                  ) : address.addressType === "Work" ? (
                    <FaSuitcase className="text-xl text-[#EF4F5F]" />
                  ) : (
                    <FaUserFriends className="text-xl text-[#EF4F5F]" />
                  )}
                </div>
                <div className="md:w-[90%] w-[95%]">
                  <h1 className="text-sm text-black md:text-md">
                    {address.addressName || "No Address Name"}
                  </h1>
                  <p className="text-gray-400">
                    {address.placeAddress || "No Address Provided"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">No saved address</p>
          )}
        </div>
      </div>
      {openModal && <Modal openModal={openModal} setOpenModal={setOpenModal} />}
    </div>
  );
};

export default Location;
