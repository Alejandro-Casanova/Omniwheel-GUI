// NOT USED

import React, { useRef, useState, useEffect } from 'react';

const URL = "ws://localhost:8080/ws";


export default function reconnectingWebSocket() {
    let client;
    let isConnected = false;
    let reconnectOnClose = true;
    let messageListeners = [];
    let stateChangeListeners = [];

    function on(fn) {
        messageListeners.push(fn);
    }

    function off(fn) {
        messageListeners = messageListeners.filter(l => l !== fn);
    }

    function onStateChange(fn) {
        stateChangeListeners.push(fn);
        return () => {
            stateChangeListeners = stateChangeListeners.filter(l => l !== fn);
        };
    }

    function start() {
        client = new WebSocket(URL);

        client.onopen = () => {
            isConnected = true;
            stateChangeListeners.forEach(fn => fn(true));
        }

        const close = client.close;

        // Close without reconnecting;
        client.close = () => {
            reconnectOnClose = false;
            close.call(client);
        }

        client.onmessage = (event) => {
            messageListeners.forEach(fn => fn(event.data));
        }

        client.onerror = (e) => console.error(e);

        client.onclose = () => {

            isConnected = false;
            stateChangeListeners.forEach(fn => fn(false));

            if (!reconnectOnClose) {
                console.log('ws closed by app');
                return;
            }

            console.log('ws closed by server');

            setTimeout(start, 3000);
        }
    }

    start();

    return {
        on,
        off,
        onStateChange,
        close: () => client.close(),
        getClient: () => client,
        isConnected: () => isConnected,
        send: (msg) => client.send(msg),
    };
}


//const client = reconnectingWebSocket();


// function useMessages() {
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         function handleMessage(message) {
//             setMessages([...messages, message]);
//         }
//         client.on(handleMessage);
//         return () => client.off(handleMessage);
//     }, [messages, setMessages]);

//     return messages;
// }

// function WebSocketDisplay() {

//     const [message, setMessage] = useState('');
//     const messages = useMessages();
//     const [isConnected, setIsConnected] = useState(client.isConnected());

//     useEffect(() => {
//         return client.onStateChange(setIsConnected);
//     }, [setIsConnected]);

//     useEffect(() => {
//         if (isConnected) {
//             client.getClient().send('hi');
//         }
//     }, [isConnected]);

//     function sendMessage(e) {
//         e.preventDefault();
//         client.getClient().send(message);
//         setMessage('');
//     }

//     return (
//         <div>
//             <h1>Websocket {isConnected ? 'Connected' : 'Disconnected'}</h1>

//             <form onSubmit={sendMessage}>
//                 <input value={message} onChange={e => setMessage(e.target.value)} />
//                 <button type="submit">Send</button>
//             </form>

//             {messages.map(m => <p>{JSON.stringify(m, null, 2)}</p>)}
//         </div>
//     );
// }