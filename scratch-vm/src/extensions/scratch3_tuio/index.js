const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const formatMessage = require('format-message');
// https://github.com/xcratch/xcx-example/blob/main/src/block/translations.json
const transl = {
    hr: {
        'tuio.connect': 'Connect TUIO HR'
    },
    it: {
        'tuio.connect': 'Connetti a TUIO'
    },
    en: {
        'tuio.connect': 'Connect TUIO'
    },
    fr: {
        'tuio.connect': 'Connect TUIO FR'
    }
};

formatMessage.setup({
    translations: transl
});

// console.log(formatMessage.setup().locale);

const {TuioClient} = require('tuio-client');

let isConnected = false;
const markersEntered = new Array();
const markersExited = new Array();
const markerMap = new Map();
let lastMarkerEntered = null;
let aMarkerHasEntered = false;
let lastMarkerExited = null;
let aMarkerHasExited = false;

const _makeMarkerObject = function (marker) {
    const x = marker.xPos;
    const y = marker.yPos;
    const angle = marker.angle;
    const xSpeed = marker.xSpeed;
    const ySpeed = marker.ySpeed;
    const angularSpeed = marker.rotationSpeed;
    const id = marker.symbolId;
    return {id: id, x: x, y: y, angle: angle, xSpeed: xSpeed, ySpeed: ySpeed, angularSpeed: angularSpeed};
};

const client = new TuioClient({host: 'ws://localhost:8080'});
client.on('connect', () => {
    isConnected = true;
    log.log('yeah, connected!');
});

client.on('addTuioObject', marker => {

    const id = marker.symbolId;
    log.log('${new Date().toISOString()} - enters id: ${id}');

    markerMap.set(id, _makeMarkerObject(marker));
    lastMarkerEntered = id;
    log.log('${new Date().toISOString()} - lastMarkerEntered: ${lastMarkerEntered}');

    markersEntered.push(id);
    log.log('${new Date().toISOString()} - markersEntered after push: [${markersEntered}]');
        
    setTimeout(() => {
        log.log('${new Date().toISOString()} - pop id: ${markersEntered.pop()}');
        log.log('${new Date().toISOString()} - markersEntered after pop: [${markersEntered}]');
    }, 400);

    aMarkerHasEntered = true;
    log.log('${new Date().toISOString()} - aMarkerHasEntered: true');
    
    setTimeout(() => {
        aMarkerHasEntered = false;
        log.log('${new Date().toISOString()} - aMarkerHasEntered: false');
    }, 1000);
});

client.on('updateTuioObject', marker => {
    const id = marker.symbolId;
    markerMap.set(id, _makeMarkerObject(marker));
});

client.on('removeTuioObject', marker => {
    const id = marker.symbolId;
    markerMap.delete(id);
    markersEntered.splice(markersEntered.indexOf(id), 1);
    lastMarkerExited = id;
    markersExited.push(id);
    setTimeout(() => {
        markersExited.pop();
    }, 400);
    aMarkerHasExited = true;
    setTimeout(() => {
        aMarkerHasExited = false;
    }, 1000);
});


class Scratch3Tuio {

    constructor (runtime){
        this.runtime = runtime;
        this.client = client;

        /**
         * A toggle that alternates true and false each frame, so that an
         * edge-triggered hat can trigger on every other frame.
         * @type {boolean}
         */
        this.frameToggle = false;

        // Set an interval that toggles the frameToggle every frame.
        // setInterval(() => {
        //    this.frameToggle = !this.frameToggle;
        // }, this.runtime.currentStepTime);
    }
    
    getInfo () {
        return {
            id: 'tuio',
            name: 'Tuio',
            blocks: [
                {
                    opcode: 'test_aggiuntivi',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tuio.test_aggiuntivi',
                        default: 'test_aggiuntivi',
                        description: 'test_aggiuntivi'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'tuio.connect',
                        default: 'connect TUIO',
                        description: 'connect to TUIO server'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'whenMarkerWithIDEnters',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'tuio.whenMarkerWithIDEnters',
                        default: 'when Marker [MARKER_ID] enters',
                        description: 'fires when marker markerID enters'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.STRING,
                            menu: 'markerIDMenuWithAny'
                        }
                    }
                },
                {
                    opcode: 'whenMarkerWithIDExits',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'tuio.whenMarkerWithIDExits',
                        default: 'when Marker [MARKER_ID] exits',
                        description: 'fires when marker markerID exits'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.STRING,
                            menu: 'markerIDMenuWithAny'
                        }
                    }
                },
                {
                    opcode: 'isMarkerWithIDPresent',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'tuio.isMarkerWithIDPresent',
                        default: 'Marker [MARKER_ID] is present',
                        description: 'checks if Marker [markerID] is present'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.STRING,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerX',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerX',
                        default: 'Marker [MARKER_ID] X coordinate',
                        description: 'returns X coordinate of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerY',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerY',
                        default: 'Marker [MARKER_ID] Y coordinate',
                        description: 'returns Y coordinate of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerAngle',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerAngle',
                        default: 'Marker [MARKER_ID] rotation angle',
                        description: 'returns rotation angle of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerXSpeed',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerXSpeed',
                        default: 'Marker [MARKER_ID] X Speed',
                        description: 'returns X Speed of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerYSpeed',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerYSpeed',
                        default: 'Marker [MARKER_ID] Y Speed',
                        description: 'returns Y Speed of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerAngleSpeed',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerAngleSpeed',
                        default: 'Marker [MARKER_ID] angular velocity',
                        description: 'returns angular velocity of Marker [markerID]'
                    }),
                    arguments: {
                        MARKER_ID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                }
            ],
            menus: {
                markerIDMenuWithAny: ['1', '2', '3', '4', 'any'],
                markerIDMenuWithoutAny: ['1', '2', '3', '4']
            }
        };
    }

    connect () {
        if (isConnected) {
            return;
        }
        client.connect();
    }

    isConnected () {
        return isConnected;
    }

    whenMarkerWithIDEnters (args) {
        const isNotEmpty = markersEntered.length > 0;
        if (isNotEmpty) {
            if (args.MARKER_ID === 'any') {
                log.log('${new Date().toISOString()} - if int ${args.MARKER_ID} - return true');
                return true;
            }
            const id = markersEntered[0];
            log.log('${new Date().toISOString()} - if int ${args.MARKER_ID} - id in array[0] : ${id}');

            const markerId = Cast.toNumber(args.MARKER_ID);
            
            if (id === markerId) {
                log.log('${new Date().toISOString()} - if int ${args.MARKER_ID} - markersEntered: [${markersEntered}]');
                log.log('${new Date().toISOString()} - if int ${args.MARKER_ID} - pop id: ${markersEntered.pop()}');
                log.log('${new Date().toISOString()} - if int ${args.MARKER_ID} - markersEntered: [${markersEntered}]');
                return true;
            }
        }
        return false;
    }

    whenMarkerWithIDExits (args) {
        const isNotEmpty = markersExited.length > 0;
        if (isNotEmpty) {
            if (args.MARKER_ID === 'any') {
                return true;
            }
            const id = markersExited[0];
            const markerId = Cast.toNumber(args.MARKER_ID);
            if (id === markerId) {
                markersExited.pop();
                return true;
            }
        }
        return false;
    }

    getLastMarkerEntered () {
        if (aMarkerHasEntered) {
            return lastMarkerEntered;
        }
        return null;
    }

    getLastMarkerExited () {
        if (aMarkerHasExited) {
            return lastMarkerExited;
        }
        return null;
    }

    isMarkerWithIDPresent (args) {
        const markerId = Cast.toNumber(args.MARKER_ID);
        return markerMap.has(markerId);
    }

    getMarkerX (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.x;
        }
        return 0;
    }

    getMarkerY (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.y;
        }
        return 0;
    }

    getMarkerAngle (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.angle;
        }
        return 0;
    }

    getMarkerXSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.xSpeed;
        }
        return 0;
    }

    getMarkerYSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.ySpeed;
        }
        return 0;
    }

    getMarkerAngleSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return m.angularSpeed;
        }
        return 0;
    }
    
}

module.exports = {Scratch3Tuio, _makeMarkerObject};
