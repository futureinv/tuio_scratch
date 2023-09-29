const dgram = require('dgram');
const ws = require('ws');

// define the server
const tuioServer = (function () {
    let WebSocketServer = ws.Server,
        server = null,
        udpSocket = null,
        webSocketClients = [],

        init = function (params) {
            udpSocket = dgram.createSocket('udp4');
            udpSocket.on('listening', onSocketListening);
            udpSocket.bind(params.udpPort, params.udpHost);
            udpSocket.on('message', function (msg) {
                webSocketClients.forEach(function (webSocket) {
                    if (webSocket.readyState === webSocket.OPEN) {
                        webSocket.send(msg, function onWebSocketSendError(error) {
                            if (typeof error !== "undefined") {
                                console.log(error);
                            }
                        });
                    }
                });
            }),

                server = new WebSocketServer({
                    port: params.socketPort,
                });
            server.on('connection', onSocketConnection);
        },

        onSocketListening = function () {
            let address = udpSocket.address();
            console.log("TuioServer listening for events on: " + address.address + ":" + address.port);
        },

        onSocketConnection = function (webSocket) {
            webSocketClients.push(webSocket);
            console.log("Websocket client connected");
            webSocket.on('close', function () {
                let indexOf = webSocketClients.indexOf(webSocket);
                webSocketClients.splice(indexOf, 1);
                console.log("Websocket client disconnected");
            });
        };

    return {
        init: init
    };
}());

// export the server
exports.init = tuioServer.init;
