import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { Scatter } from 'react-chartjs-2';
import PropTypes from "prop-types";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const colors = ["yellow", "magenta", "cyan", "red", "blue", "green"];

const CardScatter = ({
    title = "Default Title",
    subTitle = "Default Subtitle",
    yAxisLabel = "Y",
    xAxisLabel = "X",
    displayData = {default: [{x: -4, y: 4}, {x: -4, y: -4}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 4, y: 4}, {x: 4, y: -4} ]},
}) => {

    const data = {
        datasets: Array.from(Object.keys(displayData), (key, i) => {
            return {
              label: key,
              backgroundColor: colors[i],
              borderColor: colors[i],
              data: displayData[key],
              fill: false,
            }
        }),
    };

    const options = {
        animation: false,
        parsing: true, //Important: datasets must be array of objects with x and y key-value pairs
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
        scales: {
            x: {
                //type: "linear",
                position: "bottom",
                display: true,
                suggestedMin: -10,
                suggestedMax: 10,
                ticks: {
                    color: "rgba(255,255,255,.7)",
                    //stepSize: 1,
                    
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
            y: {
                beginAtZero: true,
                //type: "linear",
                position: "left",
                display: true,
                suggestedMin: -10,
                suggestedMax: 10,
                ticks: {
                    color: "rgba(255,255,255,.7)",
                    stepSize: 1,
                    min: 10,
                    max: -10,
                },
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
    };

    // console.log("Scatter data: ");
    // console.log(data.datasets[0].data);

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
                    <Scatter options={options} data={data} />
                </div>
                </div>
            </div>
        </>
  
    );
}

CardScatter.propTypes = {
    title: PropTypes.string,
    subTitle: PropTypes.string,
    yAxisLabel : PropTypes.string,
    xAxisLabel : PropTypes.string,
    displayData : PropTypes.objectOf(PropTypes.array),
}

export default CardScatter;