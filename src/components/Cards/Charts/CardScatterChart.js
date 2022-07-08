import React, {useState, useEffect} from 'react';
import { graphql, useStaticQuery } from 'gatsby'

import {StaticImage} from "gatsby-plugin-image"
import BackgroundImage from 'gatsby-background-image'

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
import useWebSocket from '../../WebSocketStore/useWebSocket';
import defaultMessage from '../../WebSocketStore/defaultMessage'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const colors = ["yellow", "magenta", "cyan", "red", "blue", "green"];

const initRxData = (intialVal) =>  {
    if(typeof intialVal !== 'object' && intialVal.constructor !== Object){
        return intialVal;
    }
    
    return {...intialVal}
}

const rxDataReducer = (state, action) => {

    const clonedData = {...state}; // Prevents state mutation (indispensable)
  
    if (typeof action === 'string' || action instanceof String){
      if(action === 'reset'){
        console.log("Reset achieved");
        return state; // Doesn't work
      }
    }
    
    //const action_parsed = JSON.parse(action)
    let action_parsed;
    try {
        action_parsed = JSON.parse(action)
    } catch (error) {
      console.log("Invalid JSON string: %s", action);
    }
  
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
    //if(action_parsed.data_type === 'POS'){
    try {

        Object.keys(clonedData).forEach((value) => { // Warning: won't work with more than 1 datasets
            if(clonedData[value].length >= 50){
                clonedData[value].shift();
            }
            clonedData[value].push({x: action_parsed.pos[0], y: action_parsed.pos[1]});
        });

    } catch (error) {
        console.log("Error: ", error, " - Message ", action_parsed);
    }

    // }else{
    //   console.log("Unknown data type: %s", action_parsed.data_type)
    // }
  
    return clonedData;
}

const CardScatter = ({
    title = "Default Title",
    subTitle = "Default Subtitle",
    yAxisLabel = "Y",
    xAxisLabel = "X",
    initialDisplayData = {default:  [
                                        //{x: -4, y: 4}, {x: -4, y: -4}, {x: 0, y: 0}, {x: 1, y: 1}, {x: 4, y: 4}, {x: 4, y: -4} 
                                    ]},
}) => {
    const [_dispatch_txData, _rxData] = useWebSocket(rxDataReducer, initialDisplayData, initRxData);
    const [_data, _setData] = useState({datasets:[]});

    const imageData = useStaticQuery(
        graphql`
            {
                file(relativePath: {eq: "layout.png"}) {
                    childImageSharp {
                        id
                        gatsbyImageData
                    }
                }
            }
        `
    ).file.childImageSharp.fluid

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

    // Subscribe to relevant data
    useEffect(() => {
        _dispatch_txData({...defaultMessage, msg_type: "subscribe", sub_id: 0, sub_data_type: "position"});

        return () => {
        _dispatch_txData({...defaultMessage, msg_type: "unsubscribe", sub_id: 0, sub_data_type: "position"});    
        }
    }, [_dispatch_txData]);

    // const data = {
    //     datasets: Array.from(Object.keys(displayData), (key, i) => {
    //         return {
    //           label: key,
    //           backgroundColor: colors[i],
    //           borderColor: colors[i],
    //           data: displayData[key],
    //           fill: false,
    //         }
    //     }),
    // };

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
                    stepSize: 1,
                    
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
                    display: false,
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
                
                    <StaticImage
                                src="../../../assets/layouts/layout.png"
                                data={imageData}
                                className="absolute w-full left-4 bottom-10"
                                alt="A dinosaur"
                                placeholder="blurred"
                                layout="fullWidth"
                                loading ='eager'
                                // width={1024}
                                // height={1024}
                    />
                    <div    className={"relative"
                                    //+ " bg-white"
                                    //+ " aspect-video" 
                                    + " aspect-square"
                                    //+ " h-600-px"
                                    }
                            style={{backgroundImage: "url('../../../assets/layouts/layout.png');"}}
                    >
                        {/* <canvas id="line-chart"></canvas> */}
                        
                        <Scatter options={options} data={_data} />
                        
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