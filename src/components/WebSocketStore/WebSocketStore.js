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
      xVel: [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}],
      yVel: [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}],
      zVel: [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}],
    },
    timeData: [ 0, 1, 2 ],
    posData:[
      { x: 0, y: 0 },
    ]
  });

  const [_isMounted, setMounted] = React.useState(false);
  const _ws = React.useRef(null);

  // On Boot
  React.useEffect(() => {

    setRxData({
      messageList: [],
      velData: { xVel: [], yVel: [], zVel: [] },
      timeData: [],
      posData:[{}]
    });

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

  // After WebSocket Init
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
            clonedData.velData.xVel.push({x: data.tiempo, y: data.vel[0]});
            clonedData.velData.yVel.push({x: data.tiempo, y: data.vel[1]});
            clonedData.velData.zVel.push({x: data.tiempo, y: data.vel[2]});
            clonedData.timeData.push(data.tiempo);
            clonedData.posData.push({x: data.pos[0], y: data.pos[1]});
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