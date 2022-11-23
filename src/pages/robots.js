import React from "react";
//import { Link } from "gatsby";
import { useStore } from "../components/Store/Store.jsx";
//import Layout from "../layouts/layout1.js";

import CardLineChart from "../components/Cards/Charts/CardLineChart.js";
import CardRadarChart from "../components/Cards/Charts/CardRadarChart"
import RobotConnectionAlert from "../components/Alerts/RobotConnectionAlert"
//import DeviceTable from "../components/Cards/DeviceTable";
//import CardBarChart from "../components/Cards/Charts/CardBarChart.js";
//import CardPageVisits from "../components/Cards/CardPageVisits.js";
//import CardSocialTraffic from "../components/Cards/CardSocialTraffic.js";
//import CardScatterChart from "../components/Cards/Charts/CardScatterChart.js";
//import GlobalCommands from "../components/Input/GlobalCommands";
//import CartesianForm from "../components/Input/CartesianForm.js";

//import { useStore } from "../components/Store/Store.jsx";
import FormSelector from "../components/Input/FormSelector.js";

const Robots = () => {
    //const {rxData} = useStore();
    const { selectedDevice } = useStore();
    //console.log("ROBOTS STORE: ", selectedDevice);
  return (
    //<Layout>
    <>
        <div className="relative z-20 px-4">
            <RobotConnectionAlert 
                deviceId={selectedDevice}
            />
        </div>
        
        <div className="flex flex-wrap items-center">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                {/* <CardLineChart title="Velocity Data" subTitle="3D Components" deviceId={selectedDevice}/> */}
                <CardRadarChart deviceID={selectedDevice} />
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <FormSelector deviceId={selectedDevice} />
            </div>
        </div>
        {/* <div className="flex flex-row flex-wrap mt-4 ">
            <div className="w-full xl:w-6/12 px-4 ">
                <CardLineChart title="Velocity Data" subTitle="3D Components" initialDisplayData={{xVel: [], yVel: [], zVel: []}} />
            </div>
            <div className="w-full xl:w-6/12 px-4 ">
                <FormSelector />
            </div>
        </div> */}
    </>
    //</Layout>
  );
}

export default Robots;
