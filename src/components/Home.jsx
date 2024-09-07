import React from "react";
import biryani from "./../assets/37df381734b24f138af4a84fd7e4d4ec1716558578.webp";
import chicken from "./../assets/197987b7ebcd1ee08f8c25ea4e77e20f1634731334.webp";
import pizza from "./../assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.webp";
import burger from "./../assets/ccb7dc2ba2b054419f805da7f05704471634886169.webp";
import rolls from "./../assets/c2f22c42f7ba90d81440a88449f4e5891634806087.webp";
import dosa from "./../assets/8dc39742916ddc369ebeb91928391b931632716660.webp";
import item1 from "./../assets/1e4be0b5e0f970aef41328752d9c4bc1_o2_featured_v2.webp";
import item2 from "./../assets/5d9cee5aa51f0f9eb2da2521f6d01a99_o2_featured_v2.webp";
import item3 from "./../assets/bb11b8ea33874e7a100d07fe3a7a13a1_o2_featured_v2.webp";

const Home = () => {
  return (
    <div>
      <div className="flex justify-center items-center flex-col text-center mt-10 bg-[#F8F8F8] p-5">
        <h1 className="text-3xl md:text-4xl">Eat what makes you happy </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex flex-col items-center justify-center">
            <img
              src={biryani}
              alt=""
              className="md:w-40 hover:scale-105 w-28"
            />
            <p>Biryani</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={chicken}
              alt=""
              className="md:w-40 hover:scale-105 w-28"
            />
            <p>Chicken</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={pizza}
              alt=""
              className="rounded-full md:w-40 hover:scale-105 w-28"
            />
            <p>Pizza</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src={burger} alt="" className="md:w-40 hover:scale-105 w-28" />
            <p>Burger</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img src={rolls} alt="" className="md:w-40 hover:scale-105 w-28" />
            <p>Rolls</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <img
              src={dosa}
              alt=""
              className="rounded-full md:w-40 hover:scale-105 w-28"
            />
            <p>Dosa</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col text-center mt-10 bg-[#F8F8F8] p-5">
        <h1 className="text-3xl md:text-4xl">
          Order food from favourite restaurants near you.
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div>
            <img
              src={item1}
              alt=""
              className="rounded-lg w-96 hover:scale-105"
            />
            <p className="text-xl">Shahi Lucknow Hotel</p>
          </div>
          <div>
            <img
              src={item2}
              alt=""
              className="rounded-lg w-96 hover:scale-105"
            />
            <p className="text-xl">Golia Butter Chicken</p>
          </div>
          <div>
            <img
              src={item3}
              alt=""
              className="rounded-lg w-96 hover:scale-105"
            />
            <p className="text-xl">Sai Food Corner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
