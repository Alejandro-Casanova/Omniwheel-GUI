////////////////////////////////////////////////////////////////////////////
// Displays information from connected devices /////////////////////////////
////////////////////////////////////////////////////////////////////////////

import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import useWebSocket from "../../WebSocket/useWebSocket";
import {URL} from "../../WebSocket/defines"

import TableItem from "./TableItem"

const initRxData = (intialVal) =>  {
 
  if( intialVal === null){
    return {};
  }

  return {};
 
}

const rxDataReducer = (state, action) => {

  const clonedData = {...state}; // Prevents state mutation (indispensable)

  console.log("State: ", state)
  console.log("Action: ", action)
  
  //const action_parsed = JSON.parse(action)
  let action_parsed;
  try {
      action_parsed = JSON.parse(action)
  } catch (error) {
      console.log("Invalid JSON string: %s", action);
  }

  console.log("Action Parsed: ", action_parsed)

  try {

    const data_type = action_parsed.payload.data_type;
    const device_id = action_parsed.payload.device_id;

    // Checks if message is an object
    if(typeof action_parsed !== 'object' && action.constructor !== Object){
      throw new Error("Device Table Reducer: Not an Object");
    }

    if(clonedData[device_id] === undefined){
      clonedData[device_id] = {
          info: {
            name:"unknown",
            type:"unknown",
          },
          status: {
            connection: "unknown",
            battery: 0,
          },
      }
    }
    
    if( data_type !== "info" && data_type !== "status"){
      throw new Error("ProxyConnectionState Reducer: Unexpected Data Type");
    }
    
    clonedData[device_id][data_type] = action_parsed.payload.data;
      
  } catch (error) {
      console.log("Error: ", error, " - Message; ", action_parsed);
  }

  return clonedData;
}

export default function ProxyConnectionState({ color }) {

  const [_dispatch_txData, _rxData, _isConnected] = useWebSocket(rxDataReducer, null, initRxData);
  const [_timeOffline, _setTimeOffline] = useState(0)

  // useEffect(() => {
  //   _dispatch_txData({msg_type: "subscribe", payload: {device_id: -1, data_type: "info"} });
  //   _dispatch_txData({msg_type: "subscribe", payload: {device_id: -1, data_type: "status"} });

  //   return () => { // Never takes place, websocket closes too fast
  //     _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: -1, data_type: "info"} });    
  //     _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: -1, data_type: "status"} });
  //   }
  // }, [_dispatch_txData]);

  useEffect(() => {
    const timer = setInterval(()=>{
      _setTimeOffline((state)=> state + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full pb-4 mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-myGray-2 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Robot Server Connection Status
              </h3>
            </div>
          </div>
        </div>
        <div className={"block w-full overflow-x-auto"
                        + " h-64"
                        //+ " max-h-full"
                        }>

          {/* Devices table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="sticky top-0 mb-4 z-10">
              <tr>
                <th
                  className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                      )
                  }
                >
                  Server Address
                </th>
                <th
                  className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                    )}
                >
                  Connection Status
                </th>
                <th
                  className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                    )
                  }
                >
                  Time Offline
                </th>
                <th className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                    )
                  }
                >{" "}</th>
              </tr>
            </thead>
            <tbody className="">
              {/* {
                Object.keys(_rxData).map((id, i) =>  */}
                  <TableItem 
                    color="dark"
                    connectionStatus={(_isConnected ? "online" : "offline")}
                    proxyAddress={URL}
                    timeout={_timeOffline}
                  />
                {/* )
              } */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

ProxyConnectionState.defaultProps = {
  color: "light",
};

ProxyConnectionState.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
