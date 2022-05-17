import React from "react";
//import { Link } from "gatsby";

//import Layout from "../layouts/layout1.js";

import CardLineChart from "../components/Cards/Charts/CardLineChart.js";
//import CardBarChart from "../components/Cards/Charts/CardBarChart.js";
import CardPageVisits from "../components/Cards/CardPageVisits.js";
import CardSocialTraffic from "../components/Cards/CardSocialTraffic.js";
import CardScatterChart from "../components/Cards/Charts/CardScatterChart.js";

import { useStore } from "../components/WebSocketStore/WebSocketStore.js";

const Dashboard = () => {
    const store = useStore();
  return (
    //<Layout>
    <>
        <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardLineChart title="Velocity Data" subTitle="3D Components" displayData={store.velData} />
            </div>
            <div className="w-full xl:w-6/12 px-4">
                <CardScatterChart title="Position Data" subTitle="2D Plane" displayData={{"Robot Position": store.posData}}/>
            </div>
        </div>
        <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                <CardPageVisits />
            </div>
            <div className="w-full xl:w-4/12 px-4">
                <CardSocialTraffic />
            </div>
        </div>
    </>
    //</Layout>
  );
}

export default Dashboard;
