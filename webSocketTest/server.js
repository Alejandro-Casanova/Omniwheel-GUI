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

const wss = new WebSocketServer({noServer: true});

const clients = new Set();

const log = console.log;

http.createServer(accept).listen(8080)

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
    log("Web socket upgrade")
    wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } else if (req.url == '/') { // index.html
    log("Browser Connected")
    fs.createReadStream('./index.html').pipe(res);
  } else { // page not found
    log("Page not Found");
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  log(`new connection`);

  ws.on('message', function(message) {
    log(`message received: ${message}`);

    message = message.slice(0, 50); // max message length will be 50
    //message = JSON.parse(message)
    log(`message after slice: ${message}`);

    const parsed = JSON.parse(message)
    log(`parsed message: ${parsed}`);
    for(let client of clients) {
      client.send(JSON.stringify(parsed));
    }
  });

  ws.on('close', function() {
    log(`connection closed`);
    clients.delete(ws);
  });
}

