const dgram = require('dgram');
const ws = require('ws');

// define the server
const tuioServer = (function () {
    const WebSocketServer = ws.Server;
    let server = null;
    let udpSocket = null;
    const webSocketClients = [];

    const onSocketListening = function () {
        const address = udpSocket.address();
        console.log(`TuioServer listening for events on: ${address.address}:${address.port}`);
    };

    const onSocketConnection = function (webSocket) {
        webSocketClients.push(webSocket);
        console.log('Websocket client connected');
        webSocket.on('close', () => {
            const indexOf = webSocketClients.indexOf(webSocket);
            webSocketClients.splice(indexOf, 1);
            console.log('Websocket client disconnected');
        });
    };

    const init = function (params) {
        udpSocket = dgram.createSocket('udp4');
        udpSocket.on('listening', onSocketListening);
        udpSocket.bind(params.udpPort, params.udpHost);
        udpSocket.on('message', msg => {
            webSocketClients.forEach(webSocket => {
                if (webSocket.readyState === webSocket.OPEN) {
                    webSocket.send(msg, error => {
                        if (typeof error !== 'undefined') {
                            console.log(error);
                        }
                    });
                }
            });
        });

        server = new WebSocketServer({
            port: params.socketPort
        });
        server.on('connection', onSocketConnection);
    };

    return {
        init: init
    };
}());

// export the server
exports.init = tuioServer.init;
