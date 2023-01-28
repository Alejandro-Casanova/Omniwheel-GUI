
import React from "react";
import { Link } from "gatsby";
import NotificationDropdown from "../Dropdowns/NotificationDropdown.js";
import UserDropdown from "../Dropdowns/UserDropdown.js";

export default function Sidebar2({currentPath}) {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const [expandShow, setExpandShow] = React.useState("hidden");
  return (
    
    <nav className={"md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto" + 
                    " md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl" +
                    //" bg-white" +
                    " bg-myGray-3" +
                    " flex flex-wrap items-center justify-between relative z-40 py-4 px-5"}
          onMouseEnter={() => setExpandShow("")}
          onMouseLeave={() => setExpandShow("md:hidden")}>
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        
        {/* Toggler */}
        <button
          className="cursor-pointer text-blueGray-300 hover:text-blueGray-500 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
          type="button"
          onClick={() => setCollapseShow("bg-myGray-4 m-2 py-3 px-6")}
        >
          <i className="fas fa-bars"></i>
        </button>

        {/* Brand */}
        <Link
          className={
            //"md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0 " +
            "md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold py-4 pl-4 pr-3 " + 
            //(window.location.href.indexOf("/admin/tables") !== -1
            (currentPath === "/"
              ? "text-lightBlue-500 hover:text-lightBlue-600"
              : "text-blueGray-300 hover:text-blueGray-500")
          }
          to="/"
        >
          <i className="fas fa-house"></i>{" "}
          <p className={"inline pl-2 pr-12 " + expandShow}>
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
            shadow absolute -mx-2 p-2 top-0 left-0 right-0 z-50 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ` +
            collapseShow
          }
        >

          {/* Collapse header */}
          <div className={"md:min-w-full md:hidden block pb-0 mb-4" +
                          //" border-b" +
                          " border-solid border-blueGray-200"
                        }>
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Link
                  className={
                    "md:block text-left md:pb-2 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0 " +
                    //(window.location.href.indexOf("/admin/tables") !== -1
                    (currentPath === "/"
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-300 hover:text-blueGray-500")
                  }
                  to="/"
                >
                  Omniwheel GUI
                </Link>
              </div>
              <div className="w-6/12 flex justify-end">
                <button
                  type="button"
                  className="cursor-pointer text-blueGray-300 hover:text-blueGray-500 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  onClick={() => setCollapseShow("hidden")}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />
          {/* Heading */}

          {/* Navigation */}
          <ul className="md:flex-col md:min-w-full flex flex-col list-none pl-3">
            
            {/* Connect */}
            <li className="items-center" >
              <Link 
                className={
                  "text-xs uppercase py-3 font-bold block " +
                  (currentPath === "/connect"
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-300 hover:text-blueGray-500")
                }
                to="/connect"
                onMouseEnter={() => setExpandShow("")}
              >
                <i 
                  className={
                    "fas fa-link mr-2 text-sm "
                  }
                ></i>{" "}
                <p className={"inline " + expandShow}>
                  Connect
                </p>
              </Link>
            </li>
            
            {/* Dashboard */}
            <li className="items-center">
              <Link
                className={
                  "text-xs uppercase py-3 font-bold block " +
                  (currentPath === "/dashboard"
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-300 hover:text-blueGray-500")
                }
                to="/dashboard"
                onMouseEnter={() => setExpandShow("")}
              >
                <i
                  className={
                    "fas fa-tv mr-2 text-sm "
                  }
                ></i>{" "}
                <p className={"inline " + expandShow}>
                  Dashboard
                </p>
              </Link>
            </li>
            
            {/* Robot */}
            <li className="items-center">
              <Link
                className={
                  "text-xs uppercase py-3 font-bold block " +
                  (currentPath === "/robots"
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-300 hover:text-blueGray-500")
                }
                to="/robots"
                onMouseEnter={() => setExpandShow("")}
              >
                <i
                  className={
                    "fas fa-robot mr-2 text-sm "
                  }
                ></i>{" "}
                <p className={"inline " + expandShow}>
                  Robots
                </p>
              </Link>
            </li>
            
            {/* GPIO */}
            <li className="items-center">
              <Link
                className={
                  "text-xs uppercase py-3 font-bold block " +
                  (currentPath === "/gpio"
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-300 hover:text-blueGray-500")
                }
                to="/gpio"
                onMouseEnter={() => setExpandShow("")}
              >
                <i
                  className={
                    "fas fa-circle-nodes mr-2 text-sm "
                  }
                ></i>{" "}
                <p className={"inline " + expandShow}>
                  GPIO
                </p>
              </Link>
            </li>

            {/* Settings */}
            <li className="items-center">
              <Link
                className={
                  "text-xs uppercase py-3 font-bold block " +
                  (currentPath === "/settings"
                    ? "text-lightBlue-500 hover:text-lightBlue-600"
                    : "text-blueGray-300 hover:text-blueGray-500")
                }
                to="/settings"
                onMouseEnter={() => setExpandShow("")}
              >
                <i
                  className={
                    "fa fa-tools mr-2 text-sm " 
                  }
                ></i>{" "}
                <p className={"inline " + expandShow}>
                  Settings
                </p>
              </Link>
            </li>

          </ul> 

          {/* Divider */}
          <hr className="my-4 md:min-w-full" />

        </div>
      </div>
    </nav>
  );
}
