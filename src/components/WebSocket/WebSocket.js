import React from "react";

const WebSocketComponent = () => {

  const [rxData, setRxData] = React.useState({
    messageList: [
      { tiempo: 0, vel: [0, 0, 0], pos: [0, 0] },
    ],
    velData: [
      { tiempo: 0, xVel: 0, yVel: 0, zVel: 0 },
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
            clonedData.messageList.push(data);
            clonedData.velData.push({tiempo: data.tiempo, xVel: data.vel[0], yVel: data.vel[1], zVel: data.vel[2]});
            clonedData.posData.push({tiempo: data.tiempo, xPos: data.pos[0], yPos: data.pos[1]});
            return clonedData;
          });

          //console.log(JSON.stringify(rxData));
        }
      }
    }
    
  }, [_isMounted]);

  //React.useEffect( () => {}, [state]);

  return (
    <div>
      <ul>
        {rxData.messageList.map((item, index) => (
          <li
            key={index}
          >
            {JSON.stringify(item)}
          </li>
        ))}
      </ul>
      
    </div>
  );
  
}

export default WebSocketComponent;
