import React, { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  LineElement,
  Filler,
  Tooltip,
  LinearScale,
  PointElement,
  Legend,
  LineController
} from 'chart.js';

import PropTypes from "prop-types";
import useWebSocket from "../../WebSocket/useWebSocket";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

//const colors = ["yellow", "magenta", "cyan", "red", "blue", "green"];
const colors = ["#0004ff", "#ee00bf", "#ff0075", "#ff4631", "#ffac00", "#fff200"];

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
    return Array(360).fill(0);
  }

  if(typeof initialVal !== 'object' && initialVal.constructor !== Object){
      return initialVal;
  }
  
  return {...initialVal}
}

const rxDataReducer = (state, action) => {

  const clonedData = [...state]; // Prevents state mutation (indispensable)

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

  try {
    if(action_parsed.msg_type !== "data"){
      throw new Error("Msg type is NOT data");
    }else if(action_parsed.payload.data_type !== "radar"){
      throw new Error("Data type is NOT radar");
    }

    const payload_data = action_parsed.payload.data;
    // If received array (many points)
    if(Array.isArray(payload_data)){
      payload_data.forEach((value) => {
        clonedData[value.angle] = value.amplitude;
      })
    }else{
      clonedData[payload_data.angle] = payload_data.amplitude;
    }
    
  } catch (error) {
    console.log("Error: ", error, " - Message ", action_parsed);
  }

  return clonedData;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////77

export default function CardRadarChart({
  title = "Default Title",
  subTitle = "Default Subtitle",
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

    _dispatch_txData({msg_type: "subscribe", payload: {device_id: deviceId, data_type: "radar"} });

    return () => {
      _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: deviceId, data_type: "radar"} });    
    }
}, [_dispatch_txData, deviceId]);
  
  useEffect(() => {
    _setData({
      labels: [...Array(360).keys()],
      datasets: [
        {
          label: "default",
          data: _rxData,
          borderColor: colors[0],
          backgroundColor: colors[0],
          fill: false,
        }
      ]
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
  const options = useMemo(() => {
    return {
      animation: false,
      //parsing: false, //Important: datasets must be array of objects with x and y key-value pairs
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltip: {
          enabled: false,
        },
      },
      interaction: {
        intersect: false,
      },
      elements:{
        point: {
          radius: (value) => { // Just draw points with value > 0
            if(value.raw > 0)
              return 1;
          },
          hoverRadius: (value) => { // Just draw points with value > 0
            if(value.raw > 0)
              return 1;
          },
          hitRadius: (value) => { // Just draw points with value > 0
            if(value.raw > 0)
              return 1;
          },
          hoverBorderWidth: (value) => { // Just draw points with value > 0
            if(value.raw > 0)
              return 1;
          },
        },
        line: {
          borderWidth: 0,
        }
      },
      scales: {
        r: {
          angleLines: {
              color: "rgba(255, 255, 255, 0.15)",
              display: true,
              lineWidth: [ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
          },
          display: true,
          suggestedMin: 0,
          suggestedMax: 10,
          grid: {
            borderDash: [3],
            borderDashOffset: [3],
            circular: true,
            color: "rgba(255, 255, 255, 0.15)",
          },
          pointLabels: {
            callback: function(value, index) {
              return index % 30 ? null : value;
            },
            reversed: true,
          },
          ticks: {
            backdropColor: 'rgba(255, 255, 255, 0.1)',
            showLabelBackdrop: false,
            color: 'rgba(255, 255, 255, 0.5)',
            // textStrokeWidth: 10,
            // textStrokeColor:  'rgba(255, 0, 0, 0.5)',
            z: -1,
          },
        }
      }
    }
  }, [])

  // Drawing and re-drawing chart
  useEffect(() => {
    const ctx = document.getElementById('myRadarChart');
    const myRadarChart = new ChartJS(ctx, {
        type: 'radar',
        data: _data,
        options: options,
    });
  
    // when component unmounts
    return () => {
        myRadarChart.destroy()
    }

}, [_data, options])

  return (
    <>
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" +
                      " bg-myGray-2" 
                      //" bg-blueGray-700"
                      }>
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
            {/* <Line options={options} data={_data} /> */}
            <canvas id="myRadarChart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}

CardRadarChart.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  // yAxisLabel : PropTypes.string,
  // xAxisLabel : PropTypes.string,
  deviceID : PropTypes.number,
  //initialDisplayData : PropTypes.objectOf(PropTypes.array).isRequired,
  //xAxisLabels : PropTypes.array,
};

//export default CardLineChart;