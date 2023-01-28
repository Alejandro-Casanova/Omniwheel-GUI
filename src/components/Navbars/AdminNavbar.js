import React from "react";
import {Link} from 'gatsby'
import UserDropdown from "../Dropdowns/UserDropdown.js";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-30 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-auto items-center flex sm:justify-end lg:justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          
          {/* Brand */}
          <Link
            className="text-white text-md uppercase font-semibold hidden lg:inline-block"
            to="/dashboard"
            //onClick={(e) => e.preventDefault()}
          >
            Dashboard
          </Link>
          
          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <UserDropdown />
          </ul>

        </div>
      </nav>
      
      {/* End Navbar */}
    </>
  );
}
