const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
// const Cast = require('../../util/cast');
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

const client = new TuioClient({host: 'ws://localhost:8080'});
client.on('connect', () => {
    isConnected = true;
    log.log('connected!');
});


class Scratch3Tuio {
    constructor (runtime){
        this.runtime = runtime;
            
   
        /**
         * A toggle that alternates true and false each frame, so that an
         * edge-triggered hat can trigger on every other frame.
         * @type {boolean}
         */
        this.frameToggle = false;

        // Set an interval that toggles the frameToggle every frame.
        setInterval(() => {
            this.frameToggle = !this.frameToggle;
        }, this.runtime.currentStepTime);
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
                },
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

    whenMarkerWithIDEnters () {
        return false;
    }

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
}

module.exports = Scratch3Tuio;
