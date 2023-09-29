const tuioServer = require('./src/server');

// set default params
let port = 8080;

// try to retrieve user defined params
const args = process.argv.slice(2);
if (args.length > 0) {
    const userPort = args[0];
    if (isNaN(userPort)) {
        console.log("Usage example: node index.js 8080");
        process.exit();
    }
    port = userPort;
}

// init the server
tuioServer.init({
    udpPort: 3333,
    udpHost: '127.0.0.1',
    socketPort: port
});
