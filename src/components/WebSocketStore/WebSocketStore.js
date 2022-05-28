import React, {createContext} from "react";

export const wsContext = createContext();
wsContext.displayName = 'WebSocketContext';

// HOC - HIGH ORDER COMPONENT (check react docs for more info)
// Used in gatsby-browser.jsx
export const withStore = ({element}) => {
  return(
    <WebSocketStore>
      {element}
    </WebSocketStore>
  ) 
}

export const useStore = () => {
  return React.useContext(wsContext);
}

const initialRxData = {
  messageList: [],
  velData: { xVel: [], yVel: [], zVel: [] },
  //timeData: [],
  posData: []
}
const initRxData = (intialVal) => intialVal

const rxDataReducer = (state, action) => {

  const clonedData = {...state}; // Prevents state mutation (indispensable)

  if(clonedData.messageList.length >= 50){
    clonedData.messageList.shift();
  }
  clonedData.messageList.push(action);

  if(!('data_type' in action)){
    console.log("Missing data_type")
    console.log(action)
    return clonedData
  }

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

const WebSocketStore = ({children}) => {

  const [rxData, dispatch_rxData] = React.useReducer(rxDataReducer, initialRxData, initRxData)
  // {
  //   messageList: [
  //     { tiempo: 0, vel: [0, 0, 0], pos: [0, 0] },
  //   ],
  //   velData: {
  //     length: 3,
  //     xVel: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
  //     yVel: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
  //     zVel: [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}],
  //   },
  //   timeData: [ 0, 1, 2 ],
  //   posData:{
  //     length: 3,
  //     val: [{ x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }]
  //   }
  // }

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

  const [_isMounted, setMounted] = React.useState(false);
  const _ws = React.useRef(null);
  const _wsIsOpen = React.useRef(false);

  // On Boot
  React.useEffect(() => {

    // setRxData({
    //   messageList: [],
    //   velData: { length: 0, xVel: [], yVel: [], zVel: [] },
    //   timeData: [],
    //   posData: { length: 0, val: []}
    // });

    _ws.current = new WebSocket("ws://localhost:8080/ws");
    _ws.current.onopen = () => {
      console.log("ws opened")
      _wsIsOpen.current = true
    }
    _ws.current.onclose = () => {
      console.log("ws closed")
      _wsIsOpen.current = false
    }


    setMounted(true);
    const wsCurrent = _ws.current;

    return () => {
      wsCurrent.close();
      setMounted(false);
    };
  }, []);

  // After WebSocket Init
  React.useEffect(() => {
    
    //const _ws = new WebSocket("ws://localhost:8080/ws");
    if (!_ws.current) return;

    //console.log("Use effect");

    _ws.current.onmessage = message => {
      if(_isMounted){
        // Parse and debug
        console.log("Message Received:");
        console.log(message);
        const data = JSON.parse(message.data);
        console.log("Message Data:");
        console.log(data);
        
        // Push object into array
        //let currentstate = state;
        if (message.data.length > 0) {
          
          dispatch_rxData(data);
          
        }
      }
    }
    
  }, [_isMounted]);

  React.useEffect( () => {
    console.log("RXDATA CHANGED: ")
    //console.log(JSON.stringify(rxData));
  }, [rxData]);

  React.useEffect(() => {
    if(!_wsIsOpen.current) return;

    try {
      _ws.current.send(JSON.stringify({...connectionData, cmd_type: "connect"})) //send data to the server
    } catch (error) {
      console.log(error) // catch error
    }

  }, [connectionData]);

  React.useEffect(() => {
    if(!_wsIsOpen.current) return;

    try {
      _ws.current.send(JSON.stringify(txCmddData)) //send data to the server
    } catch (error) {
      console.log(error) // catch error
    }

  }, [txCmddData]);

  return (
    <wsContext.Provider value={{
      rxData: rxData,
      setConnectionData: setConnectionData,
      setTxCmdData: setTxCmdData
    }}>
      {children}
    </wsContext.Provider>
  )  
}