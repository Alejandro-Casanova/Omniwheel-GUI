import React, {createContext, useRef, useState, useEffect} from "react";

const URL = "ws://localhost:8080/ws"

///////////////////////////////////////////////////////////////////////
// CONTEXT HANDLING - STORE ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

const storeContext = createContext();
storeContext.displayName = 'StoreContext';

// HOC - HIGH ORDER COMPONENT (check react docs for more info) ACTS AS WRAPPER
// Used in gatsby-browser.jsx
export const withStore = ({element}) => {
  return(
    <MyStore>
      {element}
    </MyStore>
  ) 
}

export const useStore = () => {
  return React.useContext(storeContext);
}

const MyStore = ({children}) => {

  return (
    <storeContext.Provider value={{
      // rxData: rxData,
      // setConnectionData: setConnectionData,
      // setTxCmdData: setTxCmdData
    }}>
      {children}
    </storeContext.Provider>
  )  
}

///////////////////////////////////////////////////////////////////////
// RX DATA INIT AND REDUCER ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
const initialRxData = {
  messageList: [],
  velData: { xVel: [], yVel: [], zVel: [] },
  //timeData: [],
  posData: []
}
const initRxData = (intialVal) => intialVal

const rxDataReducer = (state, action) => {

  const clonedData = {...state}; // Prevents state mutation (indispensable)

  // Pushes message into FIFO array
  if(clonedData.messageList.length >= 50){
    clonedData.messageList.shift();
  }
  clonedData.messageList.push(action);

  // Checks if message is an object
  if(typeof action !== 'object' && action.constructor !== Object){
    console.log("Not an object:")
    console.log(action)
    return clonedData;
  }

  // Checks if message object has a "data_type" key
  if(!('data_type' in action)){
    console.log("Missing data_type")
    console.log(action)
    return clonedData
  }

  // Process message object
  switch(action.data_type){
    case 'POS':
      // return {...state, 
      //   posData: state.posData.length >= 50 
      //   ? {...state.posData, val: state.posData.val.slice(1).concat({x: action.pos[0], y: action.pos[1]})}
      //   : {...state.posData, length: state.posData.length + 1, val: state.posData.val.concat({x: action.pos[0], y: action.pos[1]})}
      // }
      if(clonedData.posData.length >= 50){
        clonedData.posData.shift();
      }
      clonedData.posData.push({x: action.pos[0], y: action.pos[1]});
    break;
    case 'VEL':
      if(clonedData.velData.xVel.length >= 50){
        clonedData.velData.xVel.shift();
        clonedData.velData.yVel.shift();
        clonedData.velData.zVel.shift();
      }
      clonedData.velData.xVel.push({x: action.tiempo, y: action.vel[0]});
      clonedData.velData.yVel.push({x: action.tiempo, y: action.vel[1]});
      clonedData.velData.zVel.push({x: action.tiempo, y: action.vel[2]});
    break;
    default: 
      console.log("Unknown command type: %s", action.cmd_type)
      
    break;
  }

  return clonedData;
}

// //Update State
// setRxData( (oldData) => {
//   const clonedData = {...oldData}; // Prevents state mutation (indispensable)
//   if(clonedData.messageList.length >= 50){
//     clonedData.messageList.shift();
//     clonedData.velData.xVel.shift();
//     clonedData.velData.yVel.shift();
//     clonedData.velData.zVel.shift();
//     clonedData.timeData.shift();
//     clonedData.posData.shift();
//   }
//   clonedData.messageList.push(data);
//   clonedData.velData.xVel.push({x: data.tiempo, y: data.vel[0]});
//   clonedData.velData.yVel.push({x: data.tiempo, y: data.vel[1]});
//   clonedData.velData.zVel.push({x: data.tiempo, y: data.vel[2]});
//   clonedData.timeData.push(data.tiempo);
//   clonedData.posData.push({x: data.pos[0], y: data.pos[1]});

//   return clonedData;
// });

///////////////////////////////////////////////////////////////////////
// WEBSOCKET COMPONENT - CONTEXT PROVIDER /////////////////////////////
///////////////////////////////////////////////////////////////////////

const WebSocketStore = ({children}) => {

  const [rxData, dispatch_rxData] = React.useReducer(rxDataReducer, {...initialRxData}, initRxData)

  const [connectionData, setConnectionData] = React.useState({
    ip: "",
    port: ""
  });

  const [txCmddData, setTxCmdData] = React.useState({
    command_type: "",
    rw: "",
    value1: 0,
    value2: 0,
    value3: 0
  });

  //const [_isMounted, setMounted] = React.useState(false);
  //const _ws = React.useRef(null);
  // const [_ws, setWs] = useState(null);
  // const _wsIsOpen = React.useRef(false);
  const wsRef = useRef(null);
  const [waitingToReconnect, setWaitingToReconnect] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const timer = useRef(null);

  // const closeSocket = useCallback(() => {
  //   _ws.close(10, 'Component Unmounted'); //Clean close
  // }, [_ws])

  useEffect(() => {
    
    if (waitingToReconnect) {
      return;
    }

    // Only set up the websocket once
    if (!wsRef.current) {
      const ws = new WebSocket(URL)
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket Opened")
        setIsOpen(true);
        ws.send(JSON.stringify('ping'));
      };

      ws.onerror = (e) => console.error(e);
      
      ws.onmessage = message => {
        // Parse and debug
        console.log("Message Received:");
        console.log(message);
        const data = JSON.parse(message.data);
        console.log("Message Data:");
        console.log(data);
        
        if (message.data.length > 0) {
          dispatch_rxData(data);
        }
        
      };

      ws.onclose = (e) => {
        console.log('Socket is closed. Reason: ', e.reason, 'Code: ', e.code);

        setIsOpen(false);

        if (wsRef.current) {
          // Connection failed
          console.log('ws closed by server');
        } else {
          // Cleanup initiated from app side, can return here, to not attempt a reconnect
          console.log('ws closed by app component unmount');
          return;
        }

        // if (waitingToReconnect) {
        //   return;
        // };
        
        // Parse event code and log
        
        //console.log('ws closed');

        // Setting this will trigger a re-run of the effect,
        // cleaning up the current websocket, but not setting
        // up a new one right away
        setWaitingToReconnect(true);

        // This will trigger another re-run, and because it is false,
        // the socket will be set up again
        timer.current = setTimeout(() => setWaitingToReconnect(null), 5000);
        console.log("Timeout Set")
        
      };

      return () => {
        console.log('Cleanup');
        //wsRef.current.close(100, "Clean Exit");
        wsRef.current = null;
        ws.close();
      }
    }
  }, [waitingToReconnect]);

  React.useEffect(() => {
    // In case component unmounts while timer is running
    return () => {
      clearTimeout(timer.current)
    };
  }, []);

  React.useEffect( () => {
    console.log("RXDATA CHANGED: ")
    //console.log(JSON.stringify(rxData));
  }, [rxData]);

  React.useEffect(() => {
    isOpenRef.current = isOpen
  }, [isOpen]);

  React.useEffect(() => {
    if(isOpenRef.current) {
      try {
        wsRef.current.send(JSON.stringify({...connectionData, cmd_type: "connect"})) //send data to the server
      } catch (error) {
        console.log(error) // catch error
      }
    }
  }, [connectionData]);

  React.useEffect(() => {
    if(isOpenRef.current) {
      try {
        wsRef.current.send(JSON.stringify(txCmddData)) //send data to the server
      } catch (error) {
        console.log(error) // catch error
      }
    }
  }, [txCmddData]);

  return (
    <storeContext.Provider value={{
      // rxData: rxData,
      // setConnectionData: setConnectionData,
      // setTxCmdData: setTxCmdData
    }}>
      {children}
    </storeContext.Provider>
  )  
}