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
import WebSocket, { WebSocketServer } from "ws"

import net from "net"
import { parse } from 'path';
import { list } from 'postcss';

const http_server = http.createServer(accept).listen(8080, () => {
  console.log("Opened http server on ", http_server.address());
})

const wss = new WebSocketServer({noServer: true});

// const Browser_clients = new Set();
// const Arduino_clients = new Set();
const Browser_clients = [null];
const Arduino_clients = [null];

const Arduino_data = [
  {
    position: [],
    velocity: [],
  }
];

const Arduino_listeners = [
  {
    position: new Set(),
    velocity: new Set(),
  }
]

///////////////////////////////////////////////////////////////////////////////////////////////////
// WEBSOCKET SERVER ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

function add_client(client, array){
  console.log("Add client function called");
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
  const index = add_client(ws, Browser_clients);
  let sub_id = null;
  let sub_data_type = null;

  console.log(`new connection`);

  // ON MESSAGE CALLBACK ///////////////////////////////////////////////////////////////////////////////////////
  ws.on('message', (message) => {
    console.log(`message received: ${message}`);

    //message = message.slice(0, 100); // max message length will be 50

    // Parse Message
    let parsed_message;
    try {
      parsed_message = JSON.parse(message)
    } catch (error) {
      console.log("Invalid JSON string: %s", message);
    }
  
    //log(`message after slice: ${message}`);
    console.log("Parsed object: ", parsed_message);

    try {
      
      if(parsed_message.msg_type === "test"){ // Test: add data to arduino data buffer at index 0
        const pos_data = {"pos": parsed_message.pos, "tiempo": parsed_message.tiempo};
        const vel_data = {"vel": parsed_message.vel, "tiempo": parsed_message.tiempo};

        // Stash data
        Arduino_data[0].position.push(pos_data)
        Arduino_data[0].velocity.push(vel_data)

        if(Arduino_data[0].position.length >= 50){
          Arduino_data[0].position.shift();
          Arduino_data[0].velocity.shift();
        }

        // Redirect if active subscription
        Arduino_listeners[0].position.forEach((listener_indx) => {
          Browser_clients[listener_indx].send(JSON.stringify(pos_data));
        });
        Arduino_listeners[0].velocity.forEach((listener_indx) => {
          Browser_clients[listener_indx].send(JSON.stringify(vel_data));
        });

        return;
      }else if(parsed_message.msg_type === "subscribe"){
        //Check no other subscription active
        if(sub_id !== null || sub_data_type !== null){
          throw "Already subscribed to something else";
        }

        // Save subscription parameters
        sub_id = parsed_message.sub_id;
        sub_data_type = parsed_message.sub_data_type;

        // Add to listeners
        Arduino_listeners[sub_id][sub_data_type].add(index); 

        console.log("Added subscription for Arduino index: ", sub_id, " - data: ", sub_data_type);

        // Send cached data
        for(let data of Arduino_data[sub_id][sub_data_type]){ 
          ws.send(JSON.stringify(data));
        }

        return
      }else if(parsed_message.msg_type === "unsubscribe"){
        // Check subscription parameters are correct
        if( sub_id !== parsed_message.Arduino_id ){
          throw "Sub id doesn't match";
        }else if( sub_data_type !== parsed_message.data_type ){
          throw "Sub data_type doesn't match";
        }
        
        // Remove from listeners
        Arduino_listeners[sub_id][sub_data_type].delete(index);

        return;
      }
      
    } catch (error) {
      console.log("Error: ", error, " - Message ", parsed_message);
    }

    //const parsed = JSON.parse(message)
    //console.log(`parsed message: ${parsed}`);
    // for(let client of Browser_clients) {
    //   //client.send(JSON.stringify(parsed));
    //   if(client === null){
    //     continue;
    //   }
    //   client.send(JSON.stringify(parsed_message));
    // }
  });

  // ON CLOSE CALLBACK ///////////////////////////////////////////////////////////////////////////////////////
  ws.on('close', (e) => {
    console.log(`Connection closed. Code:`, e);

    try {

      // Check for active subscription
      if(sub_id === null && sub_data_type === null){
        console.log("No subscription to remove");
      }else if (sub_id === null || sub_data_type === null){
        throw "Something went wrong";
      }else{
        // Remove subscription
        Arduino_listeners[sub_id][sub_data_type].delete(index);
        console.log("Removed subscription for Arduino index: ", sub_id, " - data: ", sub_data_type);
      }

    } catch (error) {
      console.log("Error: ", error, " - Message ", parsed_message);
    }

    // Remove client
    delete Browser_clients[index];
    Browser_clients[index] = null;
    console.log("Removed client at index: %d", index);

    //console.log(Browser_clients);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// ARDUINO SERVER /////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

const Arduino_server = net.createServer((client) => {
  console.log('Client connect. Client local address: ' + client.localAddress + ':' + client.localPort + '. client remote address: ' + client.remoteAddress + ':' + client.remotePort);
  
  //Arduino_clients.add(client);
  const index = add_client(client, Arduino_clients);

  //client.setTimeout(20000);   // default socket timeout
  //client.setKeepAlive(true);

  client.on('data', async (data) => {
    // Print received client data and length.
    console.log('Received client data: ' + data.toString('utf-8') + ', data size : ' + client.bytesRead);
  })

  // When client signals end of transmition
  client.on('end', () => {

    //Arduino_clients.delete(client);
    delete Arduino_clients[index];
    Arduino_clients[index] = null;
    
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

  });

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
  console.log('opened server on', Arduino_server.address());

  Arduino_server.on('close', () => {
    console.log('TCP server socket is closed.d');

    for(let client of Arduino_clients) {
      //client.send(JSON.stringify(parsed));
      client.end(JSON.stringify("Server Closed"));
    }

  });
});

