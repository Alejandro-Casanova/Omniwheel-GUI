import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  //Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js';

import PropTypes from "prop-types";
//simport { prototype } from "keyv";
import { Line } from 'react-chartjs-2';
import useWebSocket from "../../WebSocket/useWebSocket";
//import defaultMessage from "../../WebSocket/defaultMessage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  //Title,
  Tooltip,
  Legend,
  LineController
);

const colors = ["yellow", "magenta", "cyan", "red", "blue", "green"];

// RX DATA ////////////////////////////////////////////////////////////////////////

// const initialDisplayData = (intialVal) => {
//   return {
//     xVel: [intialVal], 
//     yVel: [intialVal], 
//     zVel: [intialVal],
//   }
// }

const initRxData = (initialVal) =>  {

  if(initialVal === null ){
    return {xVel: [], yVel: [], zVel: []};
  }

  if(typeof initialVal !== 'object' && initialVal.constructor !== Object){
      return initialVal;
  }
  
  return {...initialVal}
}

const rxDataReducer = (state, action) => {

  const clonedData = {...state}; // Prevents state mutation (indispensable)

  if (typeof action === 'string' || action instanceof String){
    if(action === 'reset'){
      console.log("Reset achieved");
      return initRxData(null)
    }
  }

  const action_parsed = JSON.parse(action)

  // Checks if message is an object
  if(typeof action_parsed !== 'object' && action.constructor !== Object){
    console.log("Not an object:")
    console.log(action_parsed)
    return clonedData;
  }

  

  // Checks if message object has a "data_type" key
  // if(!('data_type' in action_parsed)){
  //   console.log("Missing data_type")
  //   console.log(action_parsed)
  //   return clonedData
  // }

  // Process message object
  //if(action_parsed.data_type === 'VEL'){
  try {
    if(action_parsed.msg_type !== "data"){
      throw new Error("Msg type is NOT data");
    }else if(action_parsed.payload.data_type !== "velocity"){
      throw new Error("Data type is NOT velocity");
    }

    const payload_data = action_parsed.payload.data;
    // If received array (many points)
    if(Array.isArray(payload_data)){
      payload_data.forEach((value) => {
        clonedData.xVel.push({x: value.time, y: value.vel[0]});
        clonedData.yVel.push({x: value.time, y: value.vel[1]});
        clonedData.zVel.push({x: value.time, y: value.vel[2]});
      })
    }else{
      // Not array (Single Object)
      clonedData.xVel.push({x: payload_data.time, y: payload_data.vel[0]});
      clonedData.yVel.push({x: payload_data.time, y: payload_data.vel[1]});
      clonedData.zVel.push({x: payload_data.time, y: payload_data.vel[2]});
    }

    // Remove excess elements
    while(clonedData.xVel.length >= 50){
      clonedData.xVel.shift();
      clonedData.yVel.shift();
      clonedData.zVel.shift();
    }
    

  } catch (error) {
    console.log("Error: ", error, " - Message ", action_parsed);
  }
  // }else{
  //   console.log("Unknown data type: %s", action_parsed.data_type)
  // }

  return clonedData;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////77

export default function CardLineChart({
  title = "Default Title",
  subTitle = "Default Subtitle",
  yAxisLabel = "Value",
  xAxisLabel = "time (s)",
  deviceId = null,
  //initialDisplayData = {xVel: [], yVel: [], zVel: []},
  //xAxisLabels = [0, 1, 2, 3, 4, 5]
}) {

  // const ws = useRef();
  // const [rxData, dispatch_rxData] = React.useReducer(rxDataReducer, 0, initRxData)
  // const [data, setData] = useState({datasets:[]});
  const [_dispatch_txData, _rxData] = useWebSocket(rxDataReducer, null, initRxData);
  const [_data, _setData] = useState({datasets:[]});
  //console.log("CARDLINE STORE: ", deviceId);
  // useEffect(() => {
  //   ws.current = reconnectingWebSocket();
  //   ws.current.on(dispatch_rxData);
    
  //   return () => {
  //     ws.current.off(dispatch_rxData);
  //     ws.current.close();
  //   }
  // }, []);

  // Subscribe to relevant data
  useEffect(() => {
    if( deviceId === null || deviceId === undefined ){
      return;
    }
    //console.log("DISPATCHED: ", deviceId);

    _dispatch_txData({msg_type: "subscribe", payload: {device_id: deviceId, data_type: "velocity"} });

    return () => {
      _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: deviceId, data_type: "velocity"} });    
    }
}, [_dispatch_txData, deviceId]);
  
  useEffect(() => {
    _setData({
      datasets: Array.from(Object.keys(_rxData), (key, i) => {
        return {
          label: key,
          backgroundColor: colors[i],
          borderColor: colors[i],
          data: _rxData[key],
          fill: false,
        }
      }),
    })
  }, [_rxData])

  // const data = {
  //   datasets: Array.from(Object.keys(rxData), (key, i) => {
  //     return {
  //       label: key,
  //       backgroundColor: colors[i],
  //       borderColor: colors[i],
  //       data: rxData[key],
  //       fill: false,
  //     }
  //   }),
  // }

  //const options = useCallback(() => { return {
  const options = {
    animation: false,
    parsing: false, //Important: datasets must be array of objects with x and y key-value pairs
    maintainAspectRatio: false,
    responsive: true,
    datasets: {
      line: {
        pointRadius: 0,
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
        align: "end",
        position: "bottom",
      },
      title: {
        display: false,
        text: title,
        fontColor: "white",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      xAxis: {
        type: "linear",
        grace: "2%",
        display: true,
        //suggestedMin: 0,
        suggestedMax: 1,
        ticks: {
          color: "rgba(255,255,255,.7)",
          display: true,
          stepSize: 0.1, //interval between ticks
          //precision: 2,
          //labels: xAxisLabels,
          
          callback: function(value, index, ticks) {
            return value.toFixed(2);
          },
        },
        title: {
          display: true,
          text: xAxisLabel,
          color: "white",
        },
        grid: {
          display: false,
          borderDash: [2],
          borderDashOffset: [2],
          color: "rgba(33, 37, 41, 0.3)",
          zeroLineColor: "rgba(0, 0, 0, 0)",
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
        },
      },
      yAxis:{
        grace: "2%",
        ticks: {
          color: "rgba(255,255,255,.7)",
          stepSize: 1,
        },
        display: true,
        title: {
          display: true,
          text: yAxisLabel,
          color: "white",
        },
        grid: {
          borderDash: [3],
          borderDashOffset: [3],
          drawBorder: false,
          color: "rgba(255, 255, 255, 0.15)",
          zeroLineColor: "rgba(33, 37, 41, 0)",
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
        },
      },
    },
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                {subTitle}
              </h6>
              <h2 className="text-white text-xl font-semibold">
                {title}
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* ChartJS */}
          <div className="relative h-350-px">
            {/* <canvas id="line-chart"></canvas> */}
            <Line options={options} data={_data} />
          </div>
        </div>
      </div>
    </>
  );
}

CardLineChart.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  yAxisLabel : PropTypes.string,
  xAxisLabel : PropTypes.string,
  deviceID : PropTypes.number,
  //initialDisplayData : PropTypes.objectOf(PropTypes.array).isRequired,
  //xAxisLabels : PropTypes.array,
};

//export default CardLineChart;