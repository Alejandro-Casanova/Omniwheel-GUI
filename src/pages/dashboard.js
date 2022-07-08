import React from "react";
//import { Link } from "gatsby";

//import Layout from "../layouts/layout1.js";

//import CardLineChart from "../components/Cards/Charts/CardLineChart.js";
import CardTable from "../components/Cards/CardTable.js";
//import CardBarChart from "../components/Cards/Charts/CardBarChart.js";
//import CardPageVisits from "../components/Cards/CardPageVisits.js";
//import CardSocialTraffic from "../components/Cards/CardSocialTraffic.js";
import CardScatterChart from "../components/Cards/Charts/CardScatterChart.js";
import GlobalCommands from "../components/Input/GlobalCommands";
//import CartesianForm from "../components/Input/CartesianForm.js";

//import { useStore } from "../components/WebSocketStore/WebSocketStore.js";
//import FormSelector from "../components/Input/FormSelector.js";

const Dashboard = () => {
    //const {rxData} = useStore();
  return (
    //<Layout>
    <>
        <div className="flex flex-wrap">
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <CardScatterChart title="Position Data" subTitle="2D Plane" initialDisplayData={{"Robot Position": []}} />
                {/* <CardLineChart title="Velocity Data" subTitle="3D Components" displayData={rxData.velData} /> */}
            </div>
            <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
                <div className="relative flex flex-col flex-nowrap h-48">
                    <div className="w-full flex-auto">
                        <CardTable color="dark" />
                    </div>
                    {/* <CardScatterChart title="Position Data" subTitle="2D Plane" displayData={{"Robot Position": rxData.posData}}/> */}
                    <div className="w-full flex-aut h-80">
                        <GlobalCommands />
                    </div>
                </div>
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

export default Dashboard;
