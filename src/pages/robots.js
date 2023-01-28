import React from "react";
import { useStore } from "../components/Store/Store.jsx";

//mport CardLineChart from "../components/Cards/Charts/CardLineChart.js";
import CardRadarChart from "../components/Cards/Charts/CardRadarChart"
import RobotConnectionAlert from "../components/Alerts/RobotConnectionAlert"
import FormSelector from "../components/Input/FormSelector.js";

const Robots = () => {
    const { selectedDevice } = useStore();
    //console.log("ROBOTS STORE: ", selectedDevice);
  return (
    <>
        <div className="relative z-20 px-4">
            <RobotConnectionAlert 
                deviceId={selectedDevice}
            />
        </div>
        
        <div className="flex flex-wrap items-center">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                {/* <CardLineChart title="Velocity Data" subTitle="3D Components" deviceId={selectedDevice}/> */}
                <CardRadarChart title="Radar Data" subTitle="LIDAR Chart" deviceId={selectedDevice} />
            </div>
            <div className="w-full xl:w-4/12 mb-12 xl:mb-0 px-4">
                <FormSelector deviceId={selectedDevice} />
            </div>
        </div>
    </>
  );
}

export default Robots;
