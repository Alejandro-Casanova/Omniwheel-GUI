import React from "react";
import DeviceTable from "../components/Cards/DeviceTable";
import CardScatterChart from "../components/Cards/Charts/CardScatterChart.js";
import GlobalCommands from "../components/Input/GlobalCommands";

const Dashboard = () => {
  return (
    <>
        <div className="flex flex-wrap items-center">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardScatterChart title="Robot Positions" subTitle="Room Top View" />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <div className="relative flex flex-col flex-nowrap">
                    <div className="w-full flex-auto">
                        <DeviceTable color="dark" />
                    </div>
                    <div className="w-full flex-auto shadow-lg">
                        <GlobalCommands />
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default Dashboard;
