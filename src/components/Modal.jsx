import React, { useEffect, useState } from "react";
import { FaLocationPinLock } from "react-icons/fa6";
import { ImCross } from "react-icons/im";
import { IoMdSearch } from "react-icons/io";
import { FaHome, FaSearchLocation } from "react-icons/fa";
import { FaSuitcase } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";

const Modal = ({ openModal, setOpenModal }) => {
  
  const [secondModal, setSecondModal] = useState(false);//opens 2nd modal
  const [thirdModal, setThirdModal] = useState(false); //opens 3rd modal
  const [fourthModal, setFourthModal] = useState(false);//opens 4th modal
  const [fifthModal, setFifthModal] = useState(false);//opens 5th modal
  const [sixthModal, setSixthModal] = useState(false);//opens 6th modal
  const [inputValue, setInputValue] = useState("");//input value for manually search location
  const [suggestions, setSuggestions] = useState([]);//suggestions for manually search
  const inputRef = useRef(null);//ref for manually search
  const [confirmBtn, setConfirmBtn] = useState(false);//confirm button for manually search
  const GOOGLE_API_KEY = "AIzaSyAofrxaZbc3A2q7oKSXHoZzGPgoiU6XDV4";//google api key
  const autocompleteRef = useRef(null);//ref for autocomplete manually search
  const [selectedPlace, setSelectedPlace] = useState(null);//saves input value for manually search
  const [placeDetails, setPlaceDetails] = useState({ title: "", address: "" });//gives details of selected place
  const [getAddress, setGetAddress] = useState([]);//stores all saved address
  const [currentLocation, setCurrentLocation] = useState("Marathahalli");//default location
  const [mapZoom, setMapZoom] = useState(10);//zoom level of map
  const [formData, setFormData] = useState({  //form data for user location details
    houseNo: "",
    apartment: "",
    addressName: placeDetails.title,
    addressType: "",
    placeAddress: placeDetails.address || "",
    placeTitle: placeDetails.title || "",
  });
  const [savedAddress, setSavedAddress] = useState([]); //stores all saved address
  const [searchQuery, setSearchQuery] = useState("");//search query for saved location search

  //====1st Modal=====  

   //function to get current location
   const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current Location:", latitude, longitude);

          // Use Google Maps Geocoding API to get the address
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

   //function to open 2nd modal
   const handleClick = () => {
    setSecondModal(true);
  };
  

  //====2nd Modal=====
  
 //loads google map script
  const loadScript = (url) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  };

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`
    );
  }, []);
  
  //function to handle input change for manually search location
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


    //function to close 2nd modal
    const handleSecondModal = () => {
      setSecondModal(false);
    };
 
 //function to search manually search location and autocomplete search
  useEffect(() => {
    if (
      secondModal &&
      window.google &&
      window.google.maps &&
      inputRef.current
    ) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current
      );

      autocompleteRef.current.setComponentRestrictions({
        country: ["in"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          setInputValue(place.formatted_address);
          setSuggestions([]);
          setConfirmBtn(true);
        } else {
          setInputValue("");
          setSuggestions([]);
          setConfirmBtn(false);
        }
      });
    }
  }, [window.google, secondModal]);
 
  //function to select location from suggested locations list
  const handleSelect = (suggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);
    setConfirmBtn(true);
  };


  //====3rd Modal=====
  
 //Google map component
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 12.9716, // Example latitude
    lng: 77.5946, // Example longitude
  };

  const [mapCenter, setMapCenter] = useState(center);

  //function to open 3rd modal and select location from google map
  const handleConfirm = () => {
    setThirdModal(true);
    setSecondModal(false);
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const newPlace = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setSelectedPlace(newPlace);
      setMapCenter(newPlace);
      setMapZoom(20); // Adjust the zoom level as needed

      const title = place.name || "Selected Place";
      const address = place.formatted_address || "Address not available";
      setPlaceDetails({ title, address });
    }
  };
 
  //function to change address
  const handleChangeAddress = () => {
    setSecondModal(true);
    setThirdModal(false);
    setInputValue("");
    setSuggestions([]);
    setConfirmBtn(false);
  };
 
  //function to open 4th modal
  const handleContinue = () => {
    setFourthModal(true);
  };

  //====4th Modal=====
 
  //function to save address to formdata
  const handleIconClick = (type) => {
    setFormData((prevData) => ({
      ...prevData,
      addressName: placeDetails.title,
      addressType: type,
      placeAddress: placeDetails.address || "",
      placeTitle: placeDetails.title || "",
    }));
  };
 
  //funstion to save address in mongodb database
  const handleFormSubmit = async (e) => {
    console.log("formData:", formData);
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://microchip-backend.onrender.com/api/microchip/createAddress",
        formData
      );
      console.log("Address saved:", response.data);
      setFifthModal(true);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };
 
  //function to get all address saved in mongodb database
  const handleYourLocation = async () => {
    setSixthModal(true);

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
  
  //====6th Modal=====

  // Function for search query and saved address
  const fetchSavedAddress = () => {
    const endpoint = searchQuery
      ? `https://microchip-backend.onrender.com/api/microchip/search?q=${encodeURIComponent(
          searchQuery
        )}`
      : "https://microchip-backend.onrender.com/api/microchip/getAddress";

    axios
      .get(endpoint)
      .then((res) => {
        setSavedAddress(res.data);
        console.log("saved address:", savedAddress);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSavedAddress();
  }, [searchQuery]);

  // function to search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // function to search
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchSavedAddress();
  };

   //function to close all modals
   const handleselectLocation = () => {
    setSixthModal(false);
    setFifthModal(false);
    setFourthModal(false);
    setThirdModal(false);
    setSecondModal(false);
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[450px] md:h-[400px] z-50  text-[#EF4F5F] px-4 font-semibold overflow-x-hidden overflow-y-auto inset-0 bg-white outline-none focus:outline-none flex-col justify-center items-center rounded-lg top-3/4 left-1/2 w-[410px] h-[450px]">
        <FaLocationPinLock className="text-6xl" />
        <ImCross
          className="absolute text-xl text-black top-4 right-3"
          onClick={() => setOpenModal(false)}
        />
        <h1 className="mt-3 text-2xl text-black">Location permission is off</h1>
        <p className="mt-2 text-gray-400 text-md">
          we need your permission to access your location to find nearest store
          and give seamless delivery
        </p>
        <button
          className="bg-[#EF4F5F] text-white px-4 py-2 w-full rounded-lg mt-6"
          onClick={detectLocation}
        >
          Enable Location
        </button>
        <p className="mt-2 text-center text-gray-500 text-md">{currentLocation}</p>
        <button
          className="w-full px-4 py-2 mt-6 text-black border border-black rounded-lg"
          onClick={handleClick}
        >
          Search your location manually
        </button>
      </div>
      {secondModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[550px] md:h-[700px] z-50  text-black px-4 font-semibold overflow-x-hidden overflow-y-auto inset-0 bg-white outline-none focus:outline-none  rounded-lg top-3/4 left-1/2 w-[410px] h-[400px]">
            <div className="flex items-center justify-between w-full ">
              <h1 className="p-3 text-2xl text-center text-black border-black">
                Search Location
              </h1>
              <ImCross className="text-xl" onClick={handleSecondModal} />
            </div>
            <div className="flex items-center justify-start w-full gap-3 p-3 border border-gray-300 ">
              <IoMdSearch className="text-2xl text-black " />
              <input
                className="w-full rounded-lg outline-none "
                type="text"
                placeholder="Enter your location"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {suggestions.length > 0 && (
                <div className="absolute w-[500px] h-[250px] mt-[200px]  overflow-y-scroll">
                  <ul className="bg-white border border-gray-300 rounded-md shadow-lg ">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleSelect(suggestion)}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {confirmBtn && (
              <button
                className="bg-[#EF4F5F] text-white px-4 py-2 w-full rounded-lg mt-6 "
                onClick={handleConfirm}
              >
                Confirm
              </button>
            )}
          </div>
        </div>
      )}
      {thirdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[550px] md:h-[700px] z-50  text-black px-4 font-semibold overflow-x-hidden overflow-y-auto inset-0 bg-white outline-none focus:outline-none  rounded-lg top-3/4 left-1/2 w-[410px] h-[1000px]">
            <ImCross
              className="absolute z-50 text-xl text-black top-4 right-3"
              onClick={() => setThirdModal(false)}
            />
            <h1>Your Location</h1>

            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
            >
              {selectedPlace && <Marker position={selectedPlace} />}
            </GoogleMap>
            <h1 className="p-3">Set Your Delivery Location</h1>
            <div className="">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 ju">
                  <FaLocationPinLock className="text-4xl text-[#EF4F5F]" />
                  <h1 className="text-2xl">{placeDetails.title}</h1>
                </div>
                <button
                  className="bg-[#EF4F5F] text-white px-4 py-2  rounded-lg "
                  onClick={handleChangeAddress}
                >
                  Change
                </button>
              </div>
              <p className="mt-2 text-gray-500">{placeDetails.address}</p>

              <button
                className="bg-[#EF4F5F] text-white px-4 py-2 w-full rounded-lg mt-6"
                onClick={handleContinue}
              >
                Confirm and Continue
              </button>
            </div>
          </div>
        </div>
      )}
      {fourthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[550px] md:h-[700px] z-50  text-black px-4 font-semibold overflow-x-hidden overflow-y-auto inset-0 bg-white outline-none focus:outline-none  rounded-lg top-3/4 left-1/2 w-[410px] h-[1000px]">
            <ImCross
              className="absolute text-xl text-black top-4 right-3"
              onClick={() => setFourthModal(false)}
            />
            <form onSubmit={handleFormSubmit}>
              <div className="flex items-center gap-3 mt-6">
                <FaLocationPinLock className="md:text-4xl text-[#EF4F5F] text-3xl" />
                <h1 className="text-2xl">{placeDetails.title}</h1>
              </div>
              <p className="mt-2 text-gray-500">{placeDetails.address}</p>

              <h2 className="mt-6 text-xl text-gray-500 md:text-2xl">
                HOUSE / FLAT / BLOCK NO
              </h2>
              <input
                type="text"
                name="houseNo"
                value={formData.houseFlatBlock}
                onChange={handleInputChange}
                placeholder="Enter house/flat/block no details"
                className="w-full mt-4 border-b border-black outline-none"
              />

              <h2 className="mt-6 text-xl text-gray-500 md:text-2xl">
                APARTMENT / ROAD / AREA
              </h2>
              <input
                type="text"
                name="apartment"
                value={formData.apartmentRoadArea}
                onChange={handleInputChange}
                placeholder="Enter apartment/road/area details"
                className="w-full mt-4 border-b border-black outline-none"
              />

              <h2 className="mt-10 text-xl text-gray-500 md:text-2xl">
                SAVE AS
              </h2>
              <div
                className="flex items-center gap-5 mt-6 text-3xl"
                style={{ cursor: "pointer" }}
              >
                <FaHome onClick={() => handleIconClick("Home")} />
                <FaSuitcase onClick={() => handleIconClick("Work")} />
                <FaUserFriends
                  className="text-4xl"
                  onClick={() => handleIconClick("Friends & Family")}
                />
              </div>

              <input
                type="text"
                name="addressName"
                value={formData.addressType}
                onChange={handleInputChange}
                placeholder="Enter address name"
                className="w-full mt-4 border-b border-black outline-none"
              />

              <button
                type="submit"
                className="bg-[#EF4F5F] text-white px-4 py-2 w-full rounded-lg mt-6"
              >
                Confirm and Continue
              </button>
            </form>
          </div>
        </div>
      )}
      {fifthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[550px] md:h-[700px] z-50  text-black px-4 font-semibold overflow-x-hidden overflow-y-auto inset-0 bg-white outline-none focus:outline-none  rounded-lg top-3/4 left-1/2 w-[410px] h-[1000px]">
            <ImCross
              className="absolute text-xl text-black top-4 right-3"
              onClick={() => setFifthModal(false)}
            />
            <div className="flex flex-col items-center justify-center mt-8">
              <FaLocationPinLock className="text-7xl " />
              <h1 className="mt-3 text-2xl text-black">
                Location permission is off
              </h1>
            </div>
            <p className="mt-2 text-gray-400 text-md">
              we need your permission to access your location to find nearest
              store and give seamless delivery
            </p>
            <button className="bg-[#EF4F5F] text-white px-4 py-2 w-full rounded-lg mt-6">
              Enable Location
            </button>
            <div className="gap-4 p-3 mt-10">
              <div className="flex items-center justify-center gap-4">
                {formData.addressType === "Home" ? (
                  <FaHome className="text-5xl text-[#EF4F5F]" />
                ) : formData.addressType === "Work" ? (
                  <FaSuitcase className="text-5xl text-[#EF4F5F]" />
                ) : (
                  <FaUserFriends className="text-5xl text-[#EF4F5F]" />
                )}

                <h1 className="text-2xl text-black">{formData.addressName}</h1>
              </div>
              <p className="mt-4 text-center text-gray-400 md:px-12">
                {formData.placeAddress}
              </p>
            </div>
            <button
              className="flex justify-center w-full gap-2 px-4 py-3 mt-6 border border-black rounded-lg text-[#EF4F5F] md:text-2xl text-xl"
              onClick={handleYourLocation}
            >
              <FaSearchLocation className="text-md text-[#EF4F5F] mt-1" />
              Search your Location
            </button>
          </div>
        </div>
      )}
      {sixthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="transform -translate-x-1/2 -translate-y-1/2 absolute md:top-1/2 md:left-1/2 md:w-[550px] md:h-[700px] z-50  text-black px-4 font-semibold overflow-x-hidden  inset-0 bg-white outline-none focus:outline-none  rounded-lg top-3/4 left-1/2 w-[410px] h-[1000px] overflow-y-hidden">
            <ImCross
              className="absolute text-xl text-black top-4 right-3"
              onClick={() => setSixthModal(false)}
            />
            <div className="flex flex-col items-center justify-center mt-8">
              <h1 className="bg-[#ef4f5f] text-white p-3 w-full text-2xl">
                Your Location
              </h1>
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="Search your area/apartment/flat"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="p-3 mt-4 border border-gray-400 rounded-md w-[450px]"
                />
              </form>
              <div className="overflow-y-auto h-[600px]">
                <h1 className="p-6 m-3 text-2xl text-black">Saved Location</h1>
                <div>
                  {savedAddress.length > 0 ? (
                    savedAddress.map((address, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-3 hover:bg-gray-200"
                        onClick={handleselectLocation}
                      >
                        <div className="md:w-[10%] ">
                          {address.addressType === "Home" ? (
                            <FaHome className="text-5xl text-[#EF4F5F]" />
                          ) : address.addressType === "Work" ? (
                            <FaSuitcase className="text-5xl text-[#EF4F5F]" />
                          ) : (
                            <FaUserFriends className="text-5xl text-[#EF4F5F]" />
                          )}
                        </div>
                        <div className="md:w-[90%] w-[95%]">
                          <h1 className="text-lg text-black md:text-2xl">
                            {address.addressName || "No Address Name"}
                          </h1>
                          <p className="text-gray-400">
                            {address.placeAddress || "No Address Provided"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No saved address</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
