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

const http_server = http.createServer(accept).listen(8080)

const wss = new WebSocketServer({noServer: true});

const clients = new Set();
const Arduino_clients = new Set();

const log = console.log;

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
    log("Web socket connected")
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else if (req.url == '/') { // index.html
    log("Browser Connected")
    fs.createReadStream('./index.html').pipe(res);
  } else { // page not found
    log("Page not Found: ", req.url);
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  log(`new connection`);

  ws.on('message', (message) => {
    log(`message received: ${message}`);

    //message = message.slice(0, 100); // max message length will be 50
    let parsed_message;
    try {
      parsed_message = JSON.parse(message)
    } catch (error) {
      console.log("Invalid JSON string: %s", message);
    }
  
    //log(`message after slice: ${message}`);
    log("Parsed object: ");
    log(parsed_message);
    //const parsed = JSON.parse(message)
    //log(`parsed message: ${parsed}`);
    for(let client of clients) {
      //client.send(JSON.stringify(parsed));
      client.send(JSON.stringify(parsed_message));
    }
  });

  ws.on('close', (e) => {
    log(`Connection closed. Code:`, e);
    clients.delete(ws);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// SERVIDOR ARDUINO ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

const server = net.createServer((client) => {
  console.log('Client connect. Client local address: ' + client.localAddress + ':' + client.localPort + '. client remote address: ' + client.remoteAddress + ':' + client.remotePort);
  
  Arduino_clients.add(client);

  //client.setTimeout(20000);   // default socket timeout

  client.on('data', async (data) => {
    // Print received client data and length.
    console.log('Received client data: ' + data.toString('utf-8') + ', data size : ' + client.bytesRead);
  })

  // When client send data complete.
  client.on('end', () => {

    Arduino_clients.delete(client);
    
    console.log('Client disconnect.');
    
    // Get current connections count.
    server.getConnections((err, count) => {

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
server.on('error', (err) => {
  console.error(err);
  throw err;
});

// Listen on port 8090
server.listen(8090, () => {
  console.log('opened server on', server.address());

  server.on('close', () => {
    console.log('TCP server socket is closed.');
  });
});

