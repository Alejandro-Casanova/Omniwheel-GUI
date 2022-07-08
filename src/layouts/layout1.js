import React from "react";
//import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar2 from "../components/Sidebar/Sidebar2.js";
import HeaderStats from "../components/Headers/HeaderStats.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";

//import Footer from "../components/Footers/Footer.js";
//import FooterSmall from "../components/Footers/FooterSmall.js";

//import AuthNavbar from "../components/Navbars/AuthNavbar.js";
//import IndexNavbar from "../components/Navbars/IndexNavbar.js";

// views

//import Dashboard1 from "../views/charts.js";
//import Maps from "views/admin/Maps.js";
//import Settings from "views/admin/Settings.js";
//import Tables from "views/admin/Tables.js";

const Layout = ({children, location}) => {
  // React.useEffect(() => {
  //   console.log("Layout Rendered")
  //   return () => {
  //     console.log("Layout Cleanup")
  //   };
  // }, []);

  // React.useEffect(() => {
  //   console.log("Pathname: ")
  //   console.log(location.pathname)
    
  // }, [location.pathname]);

  return (
    <>
      <Sidebar2 currentPath={location.pathname} />
      <div className="relative md:ml-20 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full 
                        -mt-36
                        //mt-0
                        ">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

export default Layout;
