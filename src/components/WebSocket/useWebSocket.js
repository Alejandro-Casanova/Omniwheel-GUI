////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WebSocket Custom Hook ///////////////////////////////////////////////////////////////////////////////////
// Receives: rx data reducer and initializers //////////////////////////////////////////////////////////////
// Returns: rx data state variable and tx data dispatcher //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

import reconnectingWebSocket from "./reconnectingWebSocket";
import {useRef, useReducer, useEffect, useState} from 'react'
import PropTypes from "prop-types";

// TODO: Websocket closes too fast, unsibscribe before closing

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
    //console.log("State: ", state, " - Action: ", action)

    //const clonedData = {...state}; // Prevents state mutation (indispensable)
    try{

        if(action === null){
            return null;
        }
    
        if (typeof action === 'string' || action instanceof String){
            if(action === "shift"){
                const clonedData = state.slice();
                clonedData.shift();
                if(clonedData.length <= 0){
                    return null
                }
                return clonedData;

            }else if(action === 'reset'){
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

        // Checks if message object has a "msg_type" key
        if(!('msg_type' in action)){
            console.log("Missing msg_type")
            console.log(action)
            return null
        }
    
        // Checks if message object has a "payload" key
        if(!('payload' in action)){
            console.log("Missing payload")
            console.log(action)
            return null
        }
        
        if(state === null){
            //Start array
            return [action];
        }else{
            //Push
            const clonedData = state.slice();
            clonedData.push(action);
            return clonedData;
        }
        
    }catch(err){
        console.log("Error at txDataDispatcher: ", err, "Action: ", action, "State: ", state);
    }

    return state;
    
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
        //console.log("TXDATA: ", _txData)

        if(_txData === null) return;
        if( !_isConnected ) return;
        
        _wsRef.current.send(JSON.stringify(_txData[0]));
        _dispatch_txData("shift");

    }, [_isConnected, _txData])

    return [_dispatch_txData, _rxData, _isConnected]
}

useWebSocket.propTypes = {
    rxDataReducer: PropTypes.func.isRequired,
    initRxData: PropTypes.func.isRequired,
    initialValRxData: PropTypes.isRequired,
}

export default useWebSocket;