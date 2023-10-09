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

const TuioClient = require('tuio-client');

let isConnected = false;
const markersEntered = new Array();
const markerMap = new Map();
let lastMarkerEntered = null;
let aMarkerHasEntered = false;

const _makeMarkerObject = function (marker) {
    const x = marker.xPos;
    const y = marker.yPos;
    const angle = marker.angle;
    const id = marker.symbolID;
    return {id: id, x: x, y: y, angle: angle};
};

const client = new TuioClient({host: 'ws://localhost:8080'});
client.on('connect', () => {
    isConnected = true;
    log.log('yeah, connected!');
});

client.on('addTuioObject', marker => {
    const id = marker.symbolID;
    markerMap.set(id, _makeMarkerObject(marker));
    lastMarkerEntered = id;
    markersEntered.push(id);
    setTimeout(() => {
        markersEntered.pop();
    }, 400);
    aMarkerHasEntered = true;
    setTimeout(() => {
        aMarkerHasEntered = false;
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
                        default: 'when Marker [markerID] enters',
                        description: 'fires when marker markerID enters'
                    }),
                    arguments: {
                        markerID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithAny'
                        }
                    }
                }/* ,
                {
                    opcode: 'whenMarkerWithIDExits',
                    blockType: BlockType.HAT,
                    text: formatMessage({
                        id: 'tuio.whenMarkerWithIDExits',
                        default: 'when Marker [markerID] exits',
                        description: 'fires when marker markerID exits'
                    }),
                    arguments: {
                        markerID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithAny'
                        }
                    }
                },
                {
                    opcode: 'isMarkerWithIDPresent',
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: 'tuio.isMarkerWithIDPresent',
                        default: 'Marker [markerID] is present',
                        description: 'checks if Marker [markerID] is present'
                    }),
                    arguments: {
                        markerID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                },
                {
                    opcode: 'getMarkerX',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: 'tuio.getMarkerX',
                        default: 'Marker [markerID] X coordinate',
                        description: 'returns X coordinate of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
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
                        default: 'Marker [markerID] Y coordinate',
                        description: 'returns Y coordinate of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
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
                        default: 'Marker [markerID] rotation angle',
                        description: 'returns rotation angle of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
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
                        default: 'Marker [markerID] X Speed',
                        description: 'returns X Speed of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
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
                        default: 'Marker [markerID] Y Speed',
                        description: 'returns Y Speed of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
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
                        default: 'Marker [markerID] angular velocity',
                        description: 'returns angular velocity of Marker [markerID]'
                    }),
                    arguments: {
                        markerID: {
                            type: ArgumentType.NUMBER,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    }
                }*/
            ],
            menus: {
                markerIDMenuWithAny: ['1', '2', '3', '4', 'any'],
                markerIDMenuWithoutAny: ['1', '2', '3', '4']

            }
        };
    }

    connect () {
        if (this.isConnected) {
            return;
        }
        this.client.connect();
    }
    
    isConnected () {
        return isConnected;
    }

    whenMarkerWithIDEnters (args) {
        const isNotEmpty = markersEntered.length > 0;
        if (isNotEmpty) {
            const id = markersEntered[0];
            const markerId = Cast.toNumber(args.markerID);
            if (id === markerId) {
                markersEntered.pop();
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
/*
    whenMarkerWithIDExits () {
        return false;
    }

    isMarkerWithIDPresent () {
        return false;
    }

    getMarkerX () {
        return 0;
    }

    getMarkerY () {
        return 0;
    }

    getMarkerAngle () {
        return 0;
    }

    getMarkerXSpeed () {
        return 0;
    }

    getMarkerYSpeed () {
        return 0;
    }

    getMarkerAngleSpeed () {
        return 0;
    }
    */
}

module.exports = Scratch3Tuio;
