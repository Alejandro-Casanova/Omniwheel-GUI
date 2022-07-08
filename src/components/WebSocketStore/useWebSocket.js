import reconnectingWebSocket from "./reconnectingWebSocket";
import {useRef, useReducer, useEffect, useState} from 'react'
import PropTypes from "prop-types";

const defaultInitRxData = (intialVal) =>  {
    if(typeof intialVal !== 'object' && intialVal.constructor !== Object){
        return intialVal;
    }
    
    return {...intialVal}
}

const defaultRxDataReducer = (state, action) => {
    console.log("Default rxDatareducer. Action: %s", JSON.stringify(action));
    return state;
}

const txDataReducer = (state, action) => {

    //const clonedData = {...state}; // Prevents state mutation (indispensable)

    if(action === null){
        return null;
    }
  
    if (typeof action === 'string' || action instanceof String){
      if(action === 'reset'){
        console.log("Reset achieved");
        return null; 
      }
    }
  
    // Checks if message is an object
    if(typeof action !== 'object' && action.constructor !== Object){
      console.log("Not an object:")
      console.log(action)
      return null;
    }

    // Checks if message object has a "data_type" key
    if(!('msg_type' in action)){
        console.log("Missing msg_type")
        console.log(action)
        return null
      }
  
    // Checks if message object has a "data_type" key
    if(!('command_type' in action)){
      console.log("Missing command_type")
      console.log(action)
      return null
    }

    // Checks if message object has a "rw" key
    if(!('rw' in action)){
        console.log("Missing rw")
        console.log(action)
        return null
    }

    // Checks if message object has values
    if(!('value1' in action) || !('value2' in action) || !('value3' in action)){
        console.log("Missing value1, value2 or value3")
        console.log(action)
        return null
    }
  
    return action;
}


const useWebSocket = (
    rxDataReducer = defaultRxDataReducer, 
    initialValRxData = null, 
    initRxData = defaultInitRxData
) => {
    const _wsRef = useRef();
    const [_rxData, _dispatch_rxData] = useReducer(rxDataReducer, initialValRxData, initRxData);
    const [_txData, _dispatch_txData] = useReducer(txDataReducer, null);
    const [_isConnected, _setIsConnected] = useState(false);
        
    // Open socket and subscribe to state changes and messages
    useEffect(() => {
        _wsRef.current = reconnectingWebSocket();
        _wsRef.current.on(_dispatch_rxData);

        return _wsRef.current.onStateChange(_setIsConnected);
    }, []);

    // Configure cleanup
    useEffect(() => {
        const wsCopy = _wsRef.current;
        return () => {
            wsCopy.off(_dispatch_rxData);
            wsCopy.close();
        }
    }, []);

    //Message Send
    useEffect(() => {
        if(_txData === null) return;
        if( !_isConnected ) return;
        
        _wsRef.current.send(JSON.stringify(_txData));
        _dispatch_txData(null);

    }, [_isConnected, _txData])

    return [_dispatch_txData, _rxData]
}

useWebSocket.propTypes = {
    rxDataReducer: PropTypes.func.isRequired,
    initRxData: PropTypes.func.isRequired,
    initialValRxData: PropTypes.isRequired,
}

export default useWebSocket;