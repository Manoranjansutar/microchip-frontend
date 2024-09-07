import React from 'react'
// import logo from '../assets/swiggy-1.svg'
import Location from './Location'
import logo from './../assets/zomato.webp';
import { FaCircleUser } from 'react-icons/fa6';
const Navbar = () => {
  return (
    <div className='md:px-[5vw] md:py-4 flex justify-between items-center w-full px-[2.5vw] py-2'>
      <div className='flex items-center gap-4'>
        <img src={logo} alt="" className='md:w-32 w-28' />
        <div>
         <Location/>
        </div>
      </div>
      <div className='flex items-center gap-4 text-black text-xl'>
      <FaCircleUser className="text-3xl text-[#EF4F5F]" />
     <span className='hidden md:block'> WelCome, Guest</span>
      </div>
     
    </div>
  )
}

export default Navbar
