/**
Before running:
> npm install ws
Then:
> node server.js
> open http://localhost:8080 in the browser
*/

import http from 'http';
import fs from 'fs';
//const ws = new require('ws');
import { WebSocketServer } from "ws"
import os from 'os'

import net from "net"

const MOTOR_PULSES_PER_REVOLUTION = 4000

/////////////////////////////////////////////////////////////////////////////////////////////////
/// AUXILIARY FUNCTIONS /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

// Adds ceros to the left to format message (always 8 digits)
// FOR SAFETY: if a number is longer than "size", it will be overflowed to 0
function zeros(num, size) {
  num = num == "" ? 0 : parseInt(num)
  // console.log(num)
  if( isNaN(num) ){
    // console.log("TRUE")
    num = 0
  }
  if(num < 0){
      num = -num;
      num = num.toString();

      // Check overflow
      if(num.length >= size){
        num = "0";
      }

      while (num.length < size-1) num = "0" + num;
      num = "1" + num; 
  }
  else{
      num = num.toString();

      // Check overflow
      // console.log(num)
      // console.log("len: ", num.length)
      if(num.length >= size){
        num = "0";
      }

      // console.log(num)
      while (num.length < size-1){
        num = "0" + num;
        // console.log(num)
      } 
      num = "0" + num;  
      // console.log(num)
  }
  return num;
}

// Parse messages to Arduino format
function parse_to_arduino(command_type, rw , data){

  let header;
  var s;

  if(rw == 'w'){
    switch(command_type){
      
      case 'MOT':
        header = "OWR";
        s = `${header}:${zeros((data.value1*MOTOR_PULSES_PER_REVOLUTION/2/Math.PI), 8)}:${zeros((data.value2*MOTOR_PULSES_PER_REVOLUTION/2/Math.PI), 8)}:${zeros((data.value3*MOTOR_PULSES_PER_REVOLUTION/2/Math.PI), 8)}`;
        return s;

      case 'VEL':
        header = "OWR_CI";
        break;

      case 'POS':
        header = "OWR_RP";
        break;

      case 'POSC':
        header = "OWR_CP";
        break;
      
      default:
        console.log(`On parse_to_arduino: unknown command type for operation write: ${command_type}`);
        return null;

    }

    s = `${header}:${zeros(data.value1,8)}:${zeros(data.value2,8)}:${zeros(data.value3,8)}`;

  }
  else if (rw == 'r'){

    switch(command_type){
      
      case 'MOT':
        header = "OWR-RMOT";
        break;

      case 'VEL':
        header = "OWR-RVEL";
        break;

      case 'POS':
        header = "OWR-RPOS";
        break;
      
      default:
        console.log(`On parse_to_arduino: unknown command type for operation read: ${command_type}`);
        return null;
        
    }
    
    s = `${header}:${zeros(0,8)}:${zeros(0,8)}:${zeros(0,8)}`;

  }

  return s;

}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

const http_server = http.createServer(accept).listen(8080, () => {
  console.log("Opened http server on ", http_server.address());
})

const wss = new WebSocketServer({noServer: true});

// const Browser_clients = new Set();
// const Arduino_clients = new Set();
const Browser_clients = [null];
const Arduino_clients = [null];

//const Arduino_data = [];

class ArduinoData {
  #data;
  #globalListeners
  constructor() {
    this.#data = []
    this.#globalListeners = new ArduinoListenerObject();
  }

  set(deviceID, dataID, value){
    try{
      // Check if object exists
      if( (this.#data[deviceID] === undefined) || (this.#data[deviceID] === null) ){
        this.#data[deviceID] = new ArduinoDataObject();
      }

      // Set Value
      if( dataID == "gpio" ){
        // GPIO Data
        this.#data[deviceID][dataID] = value;
      }else if(Array.isArray(this.#data[deviceID][dataID])){
        // Is array, push into FIFO
        if(this.#data[deviceID][dataID].length > 50){
          this.#data[deviceID][dataID].shift();
        }
        this.#data[deviceID][dataID].push(value);
      }else{
        // Not an array, just set
        this.#data[deviceID][dataID] = value;
      }

      //Notify Subscribers
      this.#data[deviceID].listeners[dataID].forEach((listener_id, index) => {
        sendData(Browser_clients[listener_id], deviceID, dataID, value);
      })

      //Notify Global Listeners
      this.#globalListeners[dataID].forEach((listener_id, index) => {
        sendData(Browser_clients[listener_id], deviceID, dataID, value);
      })
    }catch(err){
      console.log("Error on ArduinoData setter: ", err);
    }

    console.log("ARDUINO_DATA: ", this.#data);
  }

  get(deviceID, dataID){
    try{
      if(deviceID == -1){
        //TODO getter for all devices
        throw "Getter for all devices not implemented";
      }
      return this.#data[deviceID][dataID];
    }catch(err){
      console.log("Error on ArduinoData getter: ", err);
    }
    
  }

  subscribe(deviceID, dataID, clientID){
    try{
      if(deviceID == -1){
        //Subscribe to all devices
        this.#globalListeners[dataID].add(clientID)
        console.log("Added subscription for all Arduinos - data: ", dataID); 

        // Send stashed data
        this.#data.forEach((value, index) => {
          if(value !== undefined && value !== null){
            sendData(Browser_clients[clientID], index, dataID, value[dataID]);
          }
        })
      }else{
        //Subscribe to one device
        this.#data[deviceID].listeners[dataID].add(clientID)
        console.log("Added subscription for Arduino index: ", deviceID, " - data: ", dataID);

        // Send stashed data
        sendData(Browser_clients[clientID], deviceID, dataID, this.#data[deviceID][dataID]);
      }

    }catch(err){
      console.log("Error on ArduinoData subscribe: ", err);
    }
  }

  unsubscribe(deviceID, dataID, clientID){
    try{
      if(deviceID == -1){
        //UnSubscribe from all devices
        this.#globalListeners[dataID].delete(clientID)
        console.log("Removed subscription for all Arduino devices - data: ", dataID, " - client: ", clientID);
      }else{
        //UnSubscribe from one device
        this.#data[deviceID].listeners[dataID].delete(clientID)
        console.log("Removed subscription for Arduino index: ", deviceID, " - data: ", dataID, " - client: ", clientID);
      }
    }catch(err){
      console.log("Error on ArduinoData unsubscribe: ", err);
    }
  }

  clear(deviceID){
    delete this.#data[deviceID];
    this.#data[deviceID] = null;
  }
}

class ArduinoDataObject {
  constructor() {
    this.info = {
      name: "unkown",
      type: "unkown"
    }
    this.status = {
      connection: "unknown",
      battery: 0
    }
    this.position = [
      // {
      //   pos: [],
      //   time: 0
      // }
    ]
    this.velocity = [
      // {
      //   vel: [],
      //   time: 0,
      // }
    ]
    this.radar = [
      // {
      //   amplitude: 0,
      //   angle: 0,
      //   time: 0
      // }
    ]
    this.gpio = [
      // {
      //   name: "",
      //   num: "",
      //   val: ""
      // }
    ]
    this.listeners = new ArduinoListenerObject();
  }
}

class ArduinoListenerObject {
  constructor() {
    this.info = new Set(),
    this.status = new Set(),
    this.position = new Set(),
    this.velocity = new Set(),
    this.radar = new Set(),
    this.gpio = new Set()
  }
}

const myArduinoData = new ArduinoData()

// const Arduino_listeners = [
//   {
//     status: new Set(),
//     position: new Set(),
//     velocity: new Set(),
//   }
// ]

// Listeners for all Arduino devices
// const Arduino_listeners_global = 
// {
//   status: new Set(),
//   position: new Set(),
//   velocity: new Set(),
// }

function sendData(ws, device_id, data_type, data){
  const message = {
    msg_type: "data",
    payload: {
      device_id: device_id,
      data_type: data_type,
      data: data
    }
  }
  console.log("Message Sent: ", message);
  ws.send(JSON.stringify(message));
}

// Log network interfaces to check local ip addresses
console.log(os.networkInterfaces());

///////////////////////////////////////////////////////////////////////////////////////////////////
// WEBSOCKET SERVER ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function add_client(client, array){
  console.log("Add client function called");

  // Check for gaps
  for(let i = 0; i < array.length; i++){
    if(array[i] === null){
      array[i] = client;
      console.log("Saved at index: %d", i);
      return i;
    }
  }

  // No gaps
  array.push(client);
  console.log("Saved at index: %d", array.length - 1);
  return (array.length - 1);
  
}

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
    console.log("Web socket connected")
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else if (req.url == '/') { // index.html
    console.log("Browser Connected")
    fs.createReadStream('./index.html').pipe(res);
  } else { // page not found
    console.log("Page not Found: ", req.url);
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  //Browser_clients.add(ws);
  const _client_index = add_client(ws, Browser_clients);

  //Current Subscription Data
  //let _sub_device_id = null;
  //let _sub_data_type = null;
  const _sub_data = [];

  console.log(`new connection`);

  // ON MESSAGE CALLBACK ///////////////////////////////////////////////////////////////////////////////////////
  ws.on('message', (message) => {
    //onsole.log(`message received: ${message}`);

    //message = message.slice(0, 100); // max message length will be 50

    // Parse Message
    let parsed_message;
    try {
      parsed_message = JSON.parse(message)
    } catch (error) {
      console.log("Invalid JSON string: %s", message);
    }
    
    // FOR TEST
    // if(parsed_message.msg_type.startsWith("test")){
    //   if(Arduino_data[_client_index] === undefined){
    //     Arduino_data[_client_index] = new ArduinoDataObject("unknown", "unknown");
    //   }
    // }

    //log(`message after slice: ${message}`);
    console.log("Parsed object from msg: ", parsed_message);

    try {
      
      switch(parsed_message.msg_type){

        case "test":{
          const pos_data = {"pos": parsed_message.pos, "time": parsed_message.time};
          const vel_data = {"vel": parsed_message.vel, "time": parsed_message.time};

          myArduinoData.set(_client_index, "position", pos_data);
          myArduinoData.set(_client_index, "velocity", vel_data);

          break;
        }

        case "test_status":{
          const data = {connection: parsed_message.payload.connection, battery: parsed_message.payload.battery};
          myArduinoData.set(_client_index, "status", data);

          break;
        }

        case "test_info":{
          const data = { name: parsed_message.payload.name, type: parsed_message.payload.type}
          myArduinoData.set(_client_index, "info", data);

          break;
        }

        case "test_clear":{
          myArduinoData.clear(_client_index);

          break;
        }

        case "test_radar":
          {
            const data = { amplitude: parsed_message.amplitude, angle: parsed_message.angle, time: parsed_message.time }
            myArduinoData.set(_client_index, "radar", data);
          }
          break;

        case "subscribe":{

          // Subscription parameters
          const device_id = parsed_message.payload.device_id;
          const data_type = parsed_message.payload.data_type;

          // Check for subscription already aactive
          for( let sub in _sub_data ){
            if( (sub.device_id == device_id) && (sub.data_type == data_type) ){
              throw "Already subscribed to something else";
            }
          }

          // Save parameters
          _sub_data.push({ device_id: device_id, data_type: data_type });

          myArduinoData.subscribe(device_id, data_type, _client_index);

          break;
        }

        case "unsubscribe":{
          // Subscription parameters
          const device_id = parsed_message.payload.device_id;
          const data_type = parsed_message.payload.data_type;
          let found_indx = -1;

          // Check subscription parameters are correct
          for (const [i, sub] of _sub_data.entries()) {
            if( (sub.device_id == device_id) && (sub.data_type == data_type) ){
              myArduinoData.unsubscribe(_sub_device_id, _sub_data_type, _client_index);
              found_indx = i;
            }
          }
          
          // No matching subscription found
          if(found_indx == -1){
            throw "Error in UnSubscibe: Sub info doesn't match";
          }
          
          // Remove entry
          _sub_data.splice(found_indx, 1);

          break;
        }

        case "get":{
          const dev_id_get = parsed_message.payload.device_id;
          const data_type_get = parsed_message.payload.data_type;

          const data  = myArduinoData.get(dev_id_get, data_type_get);
          sendData(ws, dev_id_get, data_type_get, data);

          break;
        }

        case "command":{
          var string = parse_to_arduino(parsed_message.payload.cmd_type, parsed_message.payload.rw, parsed_message.payload.data);
          // console.log(Arduino_clients);
          // console.log(parsed_message.payload.device_id)
          // console.log(Arduino_clients[parsed_message.device_id])
          console.log("String to Send: ", string)

          if(parsed_message.payload.device_id >= 0){
            Arduino_clients[parsed_message.payload.device_id].write(string);
          }else{
            for(let client of Arduino_clients) {
              //client.send(JSON.stringify(parsed));
              if(client !== null){
                client.write(string);
              }
            }
          }
          

          break;
        }

        default:
          throw Error(`Unknown msg_type : ${parsed_message.msg_type} sent by client n.${_client_index}`);
        

      }
      
    } catch (error) {
      console.log("On client message Error: ", error, " - Message ", parsed_message);
    }

    //console.log("Arduino Data: ", Arduino_data);
   
  });

  // ON CLOSE CALLBACK ///////////////////////////////////////////////////////////////////////////////////////
  ws.on('close', (e) => {
    console.log(`Connection closed. Code:`, e);

    try {

      // Check for active subscription
      if( _sub_data.length == 0 ){
        console.log("No subscription to remove");
      }else{
        // Remove subscriptions
        console.log("Sub Data: ", _sub_data);
        for(let sub of _sub_data){
          myArduinoData.unsubscribe(sub.device_id, sub.data_type, _client_index);
        }
      }

      // Remove client
      delete Browser_clients[_client_index];
      Browser_clients[_client_index] = null;
      console.log("Removed client at index: %d", _client_index);

    } catch (error) {
      console.log("Error: ", error);
    }

  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// ARDUINO SERVER /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

const Arduino_server_options = {
  //keepAlive: true,
}
const Arduino_server = net.createServer(Arduino_server_options, (client) => {
  console.log('Client connect. Client local address: ' + client.localAddress + ':' + client.localPort + '. client remote address: ' + client.remoteAddress + ':' + client.remotePort);
  
  //Arduino_clients.add(client);
  const current_index = add_client(client, Arduino_clients);
  // console.log(Arduino_clients)
  //Arduino_data[current_index] = new ArduinoDataObject("unkown", "unknown");

  client.setTimeout(30000);   // 30s
  //client.setKeepAlive(true);

  client.on('data', async (data) => {
    // Print received client data and length.
    console.log('Received client data: ' + data.toString('utf-8') + ', data size: ' + data.length + ', total bytes read : ' + client.bytesRead);
    let parsed_message;

    try{
      parsed_message = JSON.parse(data);

      switch(parsed_message.msg_type){

        case "data":
        case "test":{
          const pos_data = {"pos": parsed_message.pos, "time": parsed_message.time};
          const vel_data = {"vel": parsed_message.vel, "time": parsed_message.time};

          myArduinoData.set(current_index, "position", pos_data);
          myArduinoData.set(current_index, "velocity", vel_data);

          break;
        }
        
        case "status":{
          const data = {connection: parsed_message.connection, battery: parsed_message.battery};
          myArduinoData.set(current_index, "status", data);
          break;
        }

        case "info":{
          const data = { name: parsed_message.name, type: parsed_message.robot_type}
          myArduinoData.set(current_index, "info", data);
          break;
        }

        case "gpio":{
          myArduinoData.set(current_index, "gpio", parsed_message.gpio);
          break;
        }

        case "keepAlive":{
          client.setTimeout(30000);
          break;
        }

        default:
          throw Error(`Unknown message type: ${parsed_message.msg_type}`);        
      }

      // if(msg.msg_type === "init"){
      //   // Arduino_data[current_index].name = msg.name;
      //   // Arduino_data[current_index].type = msg.type;
      //   myArduinoData.set(current_index, "info", (({name, robot_type}) => ({name, type: robot_type}))(msg));
      // }else if(msg.msg_type === "keepAlive"){
      //   client.setTimeout(30000);
      // }
    }catch(err){
      console.log(err);
    }
  })

  // When client signals end of transmition
  client.on('end', () => {

    // //Arduino_clients.delete(client);
    // delete Arduino_clients[current_index];
    // Arduino_clients[current_index] = null;
    
    // console.log('Client disconnect.');
    
    // // Get current connections count.
    // Arduino_server.getConnections((err, count) => {

    //   if(!err) {
    //     // Print current connection count in server console.
    //     console.log("There are %d connections now. ", count);
    //   } else {
    //     console.error(err);
    //   }

    // });
    console.log("Socket on end, index: ", current_index);

  });

  client.on('error', (err) => {
    console.log("Socket on error: ", err, " index: ", current_index)
  })

  client.on('close', (hadError) => {
    console.log("Socket on close, index: ", current_index, (hadError ? " with error" : " with NO error"));

    //Arduino_clients.delete(client);
    delete Arduino_clients[current_index];
    Arduino_clients[current_index] = null;
    myArduinoData.clear(current_index)
    
    console.log('Client disconnect.');
    
    // Get current connections count.
    Arduino_server.getConnections((err, count) => {

      if(!err) {
        // Print current connection count in server console.
        console.log("There are %d connections now. ", count);
      } else {
        console.error(err);
      }

    });

  })

  client.on('timeout', () => {
    console.log("Socket on timeout, index: ", current_index)
    Arduino_clients[current_index].end();
  })

  // When client timeout.
  // client.on('timeout', function () {
  //     console.log('Client request time out. ');
  //     client.destroy();
  // })

})

// Error handling
Arduino_server.on('error', (err) => {
  console.error(err);
  throw err;
});

// Listen on port 8090
Arduino_server.listen(8090, () => {
  console.log('opened Arduino server on', Arduino_server.address());

  Arduino_server.on('close', () => {
    console.log('TCP server socket is closed.');

    for(let client of Arduino_clients) {
      //client.send(JSON.stringify(parsed));
      client.end(JSON.stringify("Server Closed"));
    }

  });
});

