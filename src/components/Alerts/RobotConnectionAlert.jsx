////////////////////////////////////////////////////////////////////////////
// Uses DynamicAlert to show whether a robot has been selected or not //////
////////////////////////////////////////////////////////////////////////////

import React, {useEffect} from "react";
import PropTypes from "prop-types";
import useWebSocket from "../WebSocket/useWebSocket";
import DynamicAlert from "./DynamicAlert";

const initRxData = (initialVal) =>  {
    
    if( initialVal === null){
        return "unknown";
    }

    return "unknown";
}

const rxDataReducer = (state, action) => {
    
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
      return state;
    }

    try {

        if(action_parsed.payload.data_type === "info"){
            return action_parsed.payload.data.name;
        }else{
            throw new Error("ERROR: RobotConnectionAlert Reducer unexpected data type");
        }
        
    } catch (error) {
        console.log("Error: ", error, " - Message; ", action_parsed);
    }
  
    return state;
}

export default function RobotConnectionAlert({deviceId}) {
    const [_dispatch_txData, _rxData] = useWebSocket(rxDataReducer, null, initRxData);

    useEffect(() => {
        if( deviceId === null || deviceId === undefined ){
            return;
        }
        _dispatch_txData({msg_type: "subscribe", payload: {device_id: deviceId, data_type: "info"} });
        return () => {
            _dispatch_txData({msg_type: "unsubscribe", payload: {device_id: deviceId, data_type: "info"} });
        };
    }, [deviceId, _dispatch_txData]);

    return <DynamicAlert 
        displayText={deviceId === null ? "No Robot has been Selected. Go to the Dashboard View and Choose one from the Available Units Table."
                        : (_rxData + " is now Active!")} 
        type={deviceId === null ? "Error" : "Success"} 
    />
}

RobotConnectionAlert.defaultProps = {
    deviceId: null,
};
  
RobotConnectionAlert.propTypes = {
    deviceId: PropTypes.number,
};
