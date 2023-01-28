////////////////////////////////////////////////////////////////////////////
// Scatter Chart to plot robot positions in XY plane ///////////////////////
////////////////////////////////////////////////////////////////////////////

import React, {useState, useEffect, useMemo} from 'react';
import { graphql, useStaticQuery } from 'gatsby'

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  CategoryScale,
  ScatterController
} from 'chart.js';

import PropTypes from "prop-types";
import useWebSocket from '../../WebSocket/useWebSocket';

ChartJS.register(CategoryScale, ScatterController, LinearScale, PointElement, LineElement, Legend, Tooltip);

const colors = ["#0004ff", "#ee00bf", "#ff0075", "#ff4631", "#ffac00", "#fff200"];

const initRxData = (intialVal) =>  {
    //console.log("Init Val: ", intialVal);
    //console.log(typeof intialVal !== 'object', intialVal.constructor !== Object);
    if( intialVal === null){
        return {};
    }
    if( (typeof intialVal !== 'object') || (intialVal.constructor !== Object) ){
        console.log("ERROR: CardScatter Init Not Object")
        return null;
    }
    console.log("Init Object")
    return { 0: {...intialVal} }
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

    console.log("Action Parsed: ", action_parsed)
  
    // Checks if message is an object
    if(typeof action_parsed !== 'object' && action.constructor !== Object){
      console.log("Not an object:")
      console.log(action_parsed)
      return clonedData;
    }

    try {

        if(clonedData[action_parsed.payload.device_id] === undefined){
            clonedData[action_parsed.payload.device_id] = {
                name: "unknown",
                x: 0,
                y: 0,
            }
        }
        if(action_parsed.payload.data_type === "position"){
            try{
                clonedData[action_parsed.payload.device_id].x = action_parsed.payload.data.pos[0]/1000;
                clonedData[action_parsed.payload.device_id].y = action_parsed.payload.data.pos[1]/1000;
            }catch(err){
                if(action_parsed.payload.data.length <= 0){
                    return clonedData;
                }
                // Data is an array, get just the last one
                clonedData[action_parsed.payload.device_id].x = (action_parsed.payload.data.pop()).pos[0]/1000;
                clonedData[action_parsed.payload.device_id].y = (action_parsed.payload.data.pop()).pos[1]/1000;
            }
            
        }else if(action_parsed.payload.data_type === "info"){
            clonedData[action_parsed.payload.device_id].name = action_parsed.payload.data.name;
        }
        
    } catch (error) {
        console.log("Error: ", error, " - Message; ", action_parsed);
    }
  
    return clonedData;
}

const CardScatter = ({
    title = "Default Title",
    subTitle = "Default Subtitle",
    yAxisLabel = "Y",
    xAxisLabel = "X",
}) => {
    const [_dispatch_txData, _rxData] = useWebSocket(rxDataReducer, null, initRxData);
    const [_data, _setData] = useState({datasets:[]});

    useEffect(() => {
        _setData((state) => {
            return {
                datasets: Array.from(Object.keys(_rxData), (key, i) => {
                    
                    const { name, ...dataWithoutName } = _rxData[key];
                    console.log("Data without name: ", dataWithoutName)

                    return {
                        label: name,
                        backgroundColor: colors[i % colors.length],
                        borderColor: colors[i % colors.length],
                        data: [dataWithoutName],
                        fill: false,
                    }
                }),
            }
        })
    }, [_rxData])

    // Subscribe to relevant data
    useEffect(() => {
        _dispatch_txData({msg_type: "subscribe", payload: {device_id: -1, data_type: "position"} });
        _dispatch_txData({msg_type: "subscribe", payload: {device_id: -1, data_type: "info"} });

        // const timer = setInterval(() => {
            _dispatch_txData({ // If no timer is set, data is just requested on first component mount
                msg_type: "command",
                payload: {
                    rw: "r",
                    cmd_type: "VEL",
                    device_id: -1,
                    data: {
                        value1: 0,
                        value2: 0,
                        value3: 0
                    }
                }
            })
        // }, 500)

        return () => {
            // clearInterval(timer);
            _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: -1, data_type: "position"} });    
            _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: -1, data_type: "info"} });
        }
    }, [_dispatch_txData]);

    // Chart Configuration
    const options = useMemo(() => {
        return {
            animation: false,
            parsing: true, //Important: datasets must be array of objects with x and y key-value pairs
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1,
            plugins: {
                legend: {
                    display: true,
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
                  mode: "dataset",
                  intersect: true,
                },
            },
            elements:{
                point: {
                  radius: 10,
                  hoverRadius: 12,
                  hitRadius: 2,
                }
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
            }
        };
    }, [title, xAxisLabel, yAxisLabel]); 

    // Static query for background image
    const image_data = useStaticQuery(graphql`
        {
            file(name: {eq: "layout2"}) {
                publicURL
                childImageSharp {
                    gatsbyImageData
                }
            }
        }
    `)

    // Note: changes to the plugin code is not reflected to the chart, because the plugin is loaded at chart construction time and editor changes only trigger an chart.update().
    
    // Plugin for chart background image
    const plugin = useMemo(() => {
        const image = new Image();
        image.src = image_data.file.publicURL;
        return {
            id: 'custom_canvas_background_image',
            beforeDraw: (chart) => {
                if (image.complete) {
                    const ctx = chart.ctx;
                    const {top, left, width, height} = chart.chartArea;
                    ctx.drawImage(image, left, top, width, height);
                    
                } else {
                    image.onload = () => chart.draw();
                }
            }
        };
    }, [image_data]);
    
    // Drawing and re-drawing chart
    useEffect(() => {
        const ctx = document.getElementById('myScatterChart');
        const myScatterChart = new ChartJS(ctx, {
            type: 'scatter',
            data: _data,
            options: options,
            plugins: [plugin],
        });
      
        // when component unmounts
        return () => {
            myScatterChart.destroy()
        }

    }, [_data, options, plugin])

    return (
        <>
            <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded" +
                            //" bg-blueGray-700"
                            " bg-myGray-2"
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
                <div className="p-4 flex-auto sm:mx-4 md:mx-4 lg:mx-8 xl:mx-8 2xl:mx-28">
                {/* ChartJS */}
                    <canvas id="myScatterChart"></canvas>
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
}

export default CardScatter;