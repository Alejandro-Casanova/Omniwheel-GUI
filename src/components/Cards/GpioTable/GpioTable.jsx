////////////////////////////////////////////////////////////////////////////
// Display GPIOs and available options from selected robot /////////////////
////////////////////////////////////////////////////////////////////////////

import React, {useEffect} from "react";
import PropTypes from "prop-types";
import useWebSocket from "../../WebSocket/useWebSocket";

import TableItem from "./TableItem"

const initRxData = (intialVal) =>  {
 
  if( intialVal === null){
    return {};
  }

  return {};
 
}

const rxDataReducer = (state, action) => {

  const clonedData = [...state]; // Prevents state mutation (indispensable)
  //const clonedData = state.slice();

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
    // const device_id = action_parsed.payload.device_id;

    // Checks if message is an object
    if(typeof action_parsed !== 'object' && action.constructor !== Object){
      throw new Error("Gpio Table Reducer: Not an Object");
    }
    
    // Check correct data type
    if( data_type !== "gpio" ){
      throw new Error("Gpio Reducer: Unexpected Data Type");
    }

    // Check data is array of gpio
    if( !Array.isArray(action_parsed.payload.data) ){
      throw new Error("Gpio Reducer: Payload data is not array");
    }
    
    return action_parsed.payload.data;
      
  } catch (error) {
    console.log("Error: ", error, " - Message; ", action_parsed);
  }

  return clonedData;
}

export default function GpioTable({ 
  color = "light",
  deviceId = null, 
}) {

  const [_dispatch_txData, _rxData] = useWebSocket(rxDataReducer, null, initRxData);

  // Subscribe to desired data
  useEffect(() => {
    if( deviceId === null || deviceId === undefined ){
      return;
    }

    _dispatch_txData({msg_type: "subscribe", payload: {device_id: -1, data_type: "gpio"} });

    return () => { // Never take place, websocket closes too fast
      _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: -1, data_type: "gpio"} });    
    }
  }, [_dispatch_txData, deviceId]);

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
                Available Units
              </h3>
            </div>
          </div>
        </div>
        <div className={"block w-full overflow-x-auto"
                        + " h-64"
                        }>

          {/* GPIO table */}
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
                  Name
                </th>
                <th
                  className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                    )}
                >
                  GPIO Number
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
                  Status
                </th>
                <th className={
                    "px-6 align-middle py-3 text-xs uppercase whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-myGray-3 text-blueGray-300"
                    )
                  }
                ></th>
              </tr>
            </thead>
            <tbody className="">
              {
                Object.keys(_rxData).map((id, i) => 
                  <TableItem 
                    color="dark"
                    batteryLevel={parseInt(_rxData[id].status.battery)} 
                    deviceName={_rxData[id].info.name}
                    status={_rxData[id].status.connection} 
                    deviceID={parseInt(id)}
                    deviceType={_rxData[id].info.type}
                    key={i}
                  />
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

GpioTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
