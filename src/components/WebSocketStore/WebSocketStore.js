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

const WebSocketStore = ({children}) => {

  const [rxData, setRxData] = React.useState({
    messageList: [
      { tiempo: 0, vel: [0, 0, 0], pos: [0, 0] },
    ],
    velData: {
      xVel: [0, 1, 2],
      yVel: [2, 1, 0],
      zVel: [2, 2, 2],
    },
    timeData: [
      0, 1, 2,
    ],
    posData:[
      { tiempo: 0, xPos: 0, yPos: 0 },
    ]
  });

  const [_isMounted, setMounted] = React.useState(false);
  const _ws = React.useRef(null);

  React.useEffect(() => {
    _ws.current = new WebSocket("ws://localhost:8080/ws");
    _ws.current.onopen = () => console.log("ws opened");
    _ws.current.onclose = () => console.log("ws closed");
    setMounted(true);
    const wsCurrent = _ws.current;

    return () => {
      wsCurrent.close();
      setMounted(false);
    };
  }, []);

  React.useEffect(() => {
    
    //const _ws = new WebSocket("ws://localhost:8080/ws");
    if (!_ws.current) return;

    console.log("Use effect");

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
          
          //Update State
          setRxData( (oldData) => {
            const clonedData = {...oldData}; // Prevents state mutation (indispensable)
            if(clonedData.messageList.length >= 50){
              clonedData.messageList.shift();
              clonedData.velData.xVel.shift();
              clonedData.velData.yVel.shift();
              clonedData.velData.zVel.shift();
              clonedData.timeData.shift();
              clonedData.posData.shift();
            }
            clonedData.messageList.push(data);
            clonedData.velData.xVel.push(data.vel[0]);
            clonedData.velData.yVel.push(data.vel[1]);
            clonedData.velData.zVel.push(data.vel[2]);
            clonedData.timeData.push(data.tiempo);
            clonedData.posData.push({tiempo: data.tiempo, xPos: data.pos[0], yPos: data.pos[1]});
            return clonedData;
          });
          
          
        }
      }
    }
    
  }, [_isMounted]);

  React.useEffect( () => {
    console.log("RXDATA CHANGED: ")
    //console.log(JSON.stringify(rxData));
  }, [rxData]);

  return (
    <wsContext.Provider value={rxData}>
      {children}
    </wsContext.Provider>
  )  
}