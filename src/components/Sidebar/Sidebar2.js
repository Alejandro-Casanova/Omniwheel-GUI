/*eslint-disable*/
import React from "react";
import { Link } from "gatsby";

import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import UserDropdown from "../Dropdowns/UserDropdown.js";

//const isBrowser = typeof window !== "undefined"

export default function Sidebar2({currentPath}) {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [expandShow, setExpandShow] = React.useState("hidden");
  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto 
                      md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex 
                      flex-wrap items-center justify-between relative z-30 py-4 px-4"
            onMouseEnter={() => setExpandShow("")}
            onMouseLeave={() => setExpandShow("md:hidden")}>
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold py-4 pl-4 pr-3 "
            to="/"
          >
            <i className="fas fa-house"></i>{" "}
            <p className={"inline pl-2 pr-12 " + expandShow}>
            {/* {expandShow === "hidden" ? "" : "Omniwheel GUI"} */}
            Omniwheel GUI
            </p>
          </Link>
          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>
          {/* Collapse */}
          <div
            className={
              `md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none 
              shadow absolute -mx-2 p-2 top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ` +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-0 mb-4 
                            //border-b 
                            border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    Omniwheel GUI
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            {/* <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 px-3 py-2 h-12 border border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form> */}

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            {/* <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Admin Control
            </h6> */}
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none pl-3">
              
            <li className="items-center" >
                <Link 
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    //(window.location.href.indexOf("/connect") !== -1
                    (currentPath === "/connect"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/connect"
                  onMouseEnter={() => setExpandShow("")}
                  // onMouseLeave={() => setExpandShow("hidden")}
                >
                  <i 
                    className={
                      "fas fa-link mr-2 text-sm " +
                      //(window.location.href.indexOf("/connect") !== -1
                      (currentPath === "/connect"
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  <p className={"inline " + expandShow}>
                    {/* {expandShow === "hidden" ? "" : "Connect"} */}
                    Connect
                  </p>
                  {/* Connect */}
                </Link>
              </li>
              
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    //(window.location.href.indexOf("/dashboard") !== -1
                    (currentPath === "/dashboard"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/dashboard"
                  onMouseEnter={() => setExpandShow("")}
                  // onMouseLeave={() => setExpandShow("hidden")}
                >
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      //(window.location.href.indexOf("/dashboard") !== -1
                      (currentPath === "/dashboard"
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  <p className={"inline " + expandShow}>
                  {/* {expandShow === "hidden" ? "" : "Dashboard"} */}
                  Dashboard
                  </p>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    //(window.location.href.indexOf("/dashboard") !== -1
                    (currentPath === "/robots"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/robots"
                  onMouseEnter={() => setExpandShow("")}
                  // onMouseLeave={() => setExpandShow("hidden")}
                >
                  <i
                    className={
                      "fas fa-robot mr-2 text-sm " +
                      //(window.location.href.indexOf("/dashboard") !== -1
                      (currentPath === "/robots"
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  <p className={"inline " + expandShow}>
                  {/* {expandShow === "hidden" ? "" : "Dashboard"} */}
                  Robots
                  </p>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    //(window.location.href.indexOf("/settings") !== -1
                    (currentPath === "/settings"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/settings"
                  onMouseEnter={() => setExpandShow("")}
                  // onMouseLeave={() => setExpandShow("hidden")}
                >
                  <i
                    className={
                      "fa fa-tools mr-2 text-sm " +
                      //(window.location.href.indexOf("/settings") !== -1
                      (currentPath === "/settings"
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  <p className={"inline " + expandShow}>
                  {/* {expandShow === "hidden" ? "" : "Settings"} */}
                  Settings
                  </p>
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    //(window.location.href.indexOf("/admin/tables") !== -1
                    (currentPath === "/test"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/test"
                  onMouseEnter={() => setExpandShow("")}
                  // onMouseLeave={() => setExpandShow("hidden")}
                >
                  <i
                    className={
                      "fas fa-table mr-2 text-sm " +
                      (currentPath === "/test"
                      //(window.location.href.indexOf("/admin/tables") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  <p className={"inline " + expandShow}>
                  {/* {expandShow === "hidden" ? "" : "Test"} */}
                  Test
                  </p>
                </Link>
              </li>

              {/*
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (window.location.href.indexOf("/admin/maps") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/maps"
                >
                  <i
                    className={
                      "fas fa-map-marked mr-2 text-sm " +
                      (window.location.href.indexOf("/admin/maps") !== -1
                        ? "opacity-75"
                        : "text-blueGray-300")
                    }
                  ></i>{" "}
                  Maps
                </Link>
              </li>*/}
            </ul> 

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            {/* <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Auth Layout Pages
            </h6> */}
            {/* Navigation */}

            {/* <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/auth/login"
                >
                  <i className="fas fa-fingerprint text-blueGray-400 mr-2 text-sm"></i>{" "}
                  Login
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className="text-blueGray-700 hover:text-blueGray-500 text-xs uppercase py-3 font-bold block"
                  to="/auth/register"
                >
                  <i className="fas fa-clipboard-list text-blueGray-300 mr-2 text-sm"></i>{" "}
                  Register
                </Link>
              </li>
            </ul> */}

          </div>
        </div>
      </nav>
    </>
  );
}
