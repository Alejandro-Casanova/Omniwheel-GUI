import React from "react";
//import { Link } from "gatsby";

//import Layout from "../layouts/layout1.js";
import CardPageVisits from "../components/Cards/CardPageVisits"
import CardProfile from "../components/Cards/CardProfile"
import CardSettings from "../components/Cards/CardSettings"
import CardSocialTraffic from "../components/Cards/CardSocialTraffic"
import CardStats from "../components/Cards/CardStats"
import CardTable from "../components/Cards/CardTable"

import IndexDropdown from "../components/Dropdowns/IndexDropdown"
import NotificationDropdown from "../components/Dropdowns/NotificationDropdown"
import PagesDropdown from "../components/Dropdowns/PagesDropdown"
import TableDropdown from "../components/Dropdowns/TableDropdown"
import UserDropdown from "../components/Dropdowns/UserDropdown"



const Test = () => {
  return (
    <>
        <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardPageVisits />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardProfile />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardSettings />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardSocialTraffic />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardStats />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardTable color={"dark"}/>
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <IndexDropdown />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <NotificationDropdown />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <PagesDropdown />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <TableDropdown />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <UserDropdown />
            </div>
        </div>
    </>
  );
}

export default Test;