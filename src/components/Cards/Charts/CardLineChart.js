import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  //Title,
  //Tooltip,
  //Legend,
  LineController
} from 'chart.js';

import PropTypes from "prop-types";
//simport { prototype } from "keyv";
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  //Title,
  //Tooltip,
  //Legend,
  LineController
);

export const colors = ["yellow", "magenta", "cyan", "red", "blue", "green"];

const CardLineChart = ({
  title = "Default Title",
  subTitle = "Default Subtitle",
  yAxisLabel = "Value",
  xAxisLabel = "time (s)",
  displayData = {default: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5}]},
  //xAxisLabels = [0, 1, 2, 3, 4, 5]
}) => {

  const config = {
    type: "line",
    data: {
      
      //labels: xAxisLabels,
      //labels: xAxisLabels,
      datasets: Array.from(Object.keys(displayData), (key, i) => {
        return {
          label: key,
          backgroundColor: colors[i],
          borderColor: colors[i],
          data: displayData[key],
          fill: false,
        }
      }),
        //[
        // {
        //   label: new Date().getFullYear(),
        //   backgroundColor: "#4c51bf",
        //   borderColor: "#fff",
        //   data: [65, 78, 66, 44, 56, 67, 75],
        //   fill: false,
        //   //tension: 0.4,
        // },
        // {
        //   label: new Date().getFullYear() - 1,
        //   fill: false,
        //   backgroundColor: "#fff",
        //   borderColor: "#4c51bf",
        //   data: [40, 68, 86, 74, 56, 60, 87],
        //   //tension: 0.4,
        // },
      //],
    },
    options: {
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
    },
  };


  // config.data.datasets = Array.from(Object.keys(displayData), (key, i) => {
  //   return {
  //     label: key,
  //     backgroundColor: colors[i],
  //     borderColor: colors[i],
  //     data: displayData[key],
  //     fill: false,
  //   }
  // });


  //React.useEffect(() => {
    // let i = 0;
    // for (const key in displayData){
    //   config.data.datasets.push({
    //     label: key,
    //     backgroundColor: colors[i],
    //     borderColor: colors[i],
    //     data: displayData[key],
    //     fill: false,
        
    //   });
    //   i++;
    // }
    
    //let ctx = document.getElementById("line-chart").getContext("2d");
    //const myChart = new ChartJS(ctx, config);
  //});

  // console.log("Plot Datasets: ");
  // console.log(config.data.datasets);

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
            <Line options={config.options} data={config.data} />
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
  displayData : PropTypes.objectOf(PropTypes.array),
  //xAxisLabels : PropTypes.array,
};

export default CardLineChart;