"use client";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "@/public/logo.png";
import { AiOutlineClose } from "react-icons/ai";
import { HiMenuAlt4 } from "react-icons/hi";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <nav className=" w-full flex md:justify-center justify-between items-center p-4">
      <div className=" md:flex flex-initial justify-center items-center">
        <Image src={Logo} alt="logo" className="w-32 cursor-pointer" />
      </div>
      <ul className=" text-white md:flex hidden list-none justify-between items-center flex-initial">
        {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
          <li key={index} className={` mx-4 cursor-pointer`}>
            {item}
          </li>
        ))}
        <li className=" bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
          Login
        </li>
      </ul>
      <div className=" flex relative">
        {toggleMenu ? (
          <AiOutlineClose
            fontSize={28}
            className=" text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        ) : (
          <HiMenuAlt4
            fontSize={28}
            className=" text-white md:hidden cursor-pointer"
            onClick={() => setToggleMenu(!toggleMenu)}
          />
        )}
        {toggleMenu && (
          <ul className=" z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in">
            <li className=" text-xl w-full my-2">
              <AiOutlineClose onClick={() => setToggleMenu(false)} />
            </li>
            {["Market", "Exchange", "Tutorials", "Wallets"].map(
              (item, index) => (
                <li key={index} className={` mx-4 cursor-pointer my-2 text-lg`}>
                  {item}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
