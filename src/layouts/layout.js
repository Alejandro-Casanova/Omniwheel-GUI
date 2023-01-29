////////////////////////////////////////////////////////////////////////////
// Layout component to wrap all pages, used in gatsby-browser.jsx //////////
////////////////////////////////////////////////////////////////////////////

import React from "react";
import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";

const Layout = ({children, location}) => {

  return (
    <div className="relative bg-myGray-1 min-h-screen h-full">
      
      <Sidebar currentPath={location.pathname} />
      <div className={"relative flex flex-col md:ml-20 min-h-screen h-full" +
                      //" bg-blueGray-100" 
                      " bg-myGray-1"
                      //" bg-white" 
                      }>
        <AdminNavbar />

        {/* Page Contents */}
        <div className="relative flex flex-col flex-1 justify-between px-4 md:px-10 w-full h-full
                        //-mt-36
                        //mt-0
                        pt-6 md:pt-24
                        ">
            <div className="flex-1">
              {children}
            </div>

            {/* Footer */}
            <div className="flex-none">
              <FooterAdmin />
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default Layout;
