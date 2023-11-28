const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const formatMessage = require('format-message');
// https://github.com/xcratch/xcx-example/blob/main/src/block/translations.json

const {TuioClient} = require('tuio-client');

let isConnected = false;
const markersEntered = new Array();
const markersExited = new Array();
const markerMap = new Map();
let aMarkerHasEntered = false;
let aMarkerHasExited = false;
const sleepingTime = 600;
const highestMarkerID = 4;

/**
 * Enum for follow type parameter values.
 * @readonly
 * @enum {string}
 */
const FollowType = {
    POSITION: 'position',
    ANGLE: 'angle',
    BOTH: 'position and angle'
};

const AnyMarker = 'any';

const _translate = function (msg) {
    const translations = {
        it: {
            'tuio.connect': 'connetti a TUIO',
            'tuio.whenMarkerWithIDEnters': 'quando entra il Marker [MARKER_ID]',
            'tuio.whenMarkerWithIDExits': 'quando esce il Marker [MARKER_ID]',
            'tuio.isMarkerWithIDPresent': 'il Marker [MARKER_ID] è presente',
            'tuio.followMarker': 'segui [FOLLOW_TYPE] del Marker [MARKER_ID]',
            'tuio.getMarkerX': 'coordinata X del Marker [MARKER_ID]',
            'tuio.getMarkerY': 'coordinata Y del Marker [MARKER_ID]',
            'tuio.getMarkerAngle': 'angolo del Marker [MARKER_ID]',
            'tuio.getMarkerXSpeed': 'velocità X del Marker [MARKER_ID]',
            'tuio.getMarkerYSpeed': 'velocità Y del Marker [MARKER_ID]',
            'tuio.getMarkerAngularSpeed': 'velocità angolare del Marker [MARKER_ID]',
            'tuio.followType.position': '(1) posizione',
            'tuio.followType.angle': '(2) angolo',
            'tuio.followType.both': '(3) posizione e angolo',
            'tuio.markerID.any': 'qualsiasi'
        }
    };
    const locale = formatMessage.setup().locale || 'en';
    if (locale in translations) {
        return translations[locale][msg.id] || msg.default;
    }
    return msg.default;
};

/**
     * Initialize color parameters menu with localized strings
     * @returns {array} of the localized text and values for each menu element
     * @private
     */
const _initFollowTypes = function () {
    return [
        {
            text: _translate({
                id: 'tuio.followType.position',
                default: 'position',
                description: 'menu item to enable following the postion'
            }),
            value: FollowType.POSITION
        },
        {
            text: _translate({
                id: 'tuio.followType.angle',
                default: 'angle',
                description: 'menu item to enable following the angle'
            }),
            value: FollowType.ANGLE
        },
        {
            text: _translate({
                id: 'tuio.followType.both',
                default: 'position and angle',
                description: 'menu item to enable following both position and angle'
            }),
            value: FollowType.BOTH
        }
    ];
};

const _initVariables = function () {
    aMarkerHasEntered = false;
    aMarkerHasExited = false;
    markersEntered.length = 0;
    markersExited.length = 0;
    markerMap.clear();
};

const _createMarkerIDArray = function (withAny) {
    const markerIDs = new Array();
    if (withAny) {
        markerIDs.push(
            {
                text: _translate({
                    id: 'tuio.markerID.any',
                    default: 'any',
                    description: 'describes any marker'
                }),
                value: AnyMarker
            }
        );
    }
    for (let i = 0; i <= highestMarkerID; i++) {
        markerIDs.push(i.toString());
    }
    return markerIDs;
};

const _sanitizeNumberValue = function (value) {
    if (typeof value !== 'number' || Number.isNaN(value)) value = 0;
    return value;
};

const _removeMarker = function (m) {
    const id = m.id;
    // log.log(`${new Date().toISOString()} - really exits id: ${id}`);
    markerMap.delete(id);
    markersExited.push(id);
    // log.log(`${new Date().toISOString()} - markersExited after push: [${markersExited}]`);
    setTimeout(() => {
        markersExited.shift();
    }, 400);
    aMarkerHasExited = true;
    setTimeout(() => {
        aMarkerHasExited = false;
        // log.log(`${new Date().toISOString()} - aMarkerHasExited: ${aMarkerHasExited}`);
    }, 1000);
};

const _makeMarkerObject = function (marker) {
    const x = marker.xPos;
    const y = marker.yPos;
    const angle = marker.angle;
    const xSpeed = marker.xSpeed;
    const ySpeed = marker.ySpeed;
    const angularSpeed = marker.rotationSpeed;
    const id = marker.symbolId;
    const condition = 'active';
    return {
        id: id,
        condition: condition,
        x: x,
        y: y,
        angle: angle,
        xSpeed: xSpeed,
        ySpeed: ySpeed,
        angularSpeed: angularSpeed
    };
};

const client = new TuioClient({host: 'ws://localhost:8080'});
client.on('connect', () => {
    isConnected = true;
    // log.log('yeah, connected!');
});

client.on('addTuioObject', marker => {

    const id = marker.symbolId;
    // log.log(`${new Date().toISOString()} - enters id: ${id}`);
    if (markerMap.has(id)) {
        const m = markerMap.get(id);
        // log.log(`${new Date().toISOString()} - ${id} was sleeping`);
        m.condition = 'active';
        m.sleepingSince = null;
    } else {
        markerMap.set(id, _makeMarkerObject(marker));
        markersEntered.push(id);
        // log.log(`${new Date().toISOString()} - markersEntered after push: [${markersEntered}]`);

        setTimeout(() => {
            // log.log(`${new Date().toISOString()} - shift id: ${markersEntered.shift()}`);
            markersEntered.shift();
            // log.log(`${new Date().toISOString()} - markersEntered after shift: [${markersEntered}]`);
        }, 400);

        aMarkerHasEntered = true;
        // log.log(`${new Date().toISOString()} - aMarkerHasEntered: ${aMarkerHasEntered}`);

        setTimeout(() => {
            aMarkerHasEntered = false;
            // log.log(`${new Date().toISOString()} - aMarkerHasEntered: ${aMarkerHasEntered}`);
        }, 1000);
    }

});

client.on('updateTuioObject', marker => {
    const id = marker.symbolId;
    markerMap.set(id, _makeMarkerObject(marker));
});

client.on('removeTuioObject', marker => {
    const id = marker.symbolId;
    // log.log(`${new Date().toISOString()} - : ${id} disappears`);
    // markersEntered.splice(markersEntered.indexOf(id), 1);
    const m = markerMap.get(id);
    if (marker.condition === 'killed') {
        _removeMarker(m);
    } else if (m.condition === 'active') {
        m.condition = 'sleeping';
        m.sleepingSince = Date.now();
        // log.log(`${new Date().toISOString()} - : ${id} sent to sleep`);
        setTimeout(() => {
            // log.log(`${new Date().toISOString()} - fires timeout for id: ${m.id}`);
            if (m.condition === 'sleeping') {
                const exitDueDate = m.sleepingSince + sleepingTime;
                // log.log(`${new Date().toISOString()} - : ${exitDueDate} exit due date vs ${Date.now()}`);
                if (Date.now() >= exitDueDate) {
                    _removeMarker(m);
                }
            }
        }, sleepingTime);
    }
});


class Scratch3Tuio {

    constructor (runtime) {
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
        this.markerIDs = _createMarkerIDArray();
    }

    getInfo () {
        return {
            id: 'tuio',
            name: 'Tuio',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: _translate({
                        id: 'tuio.connect',
                        default: 'connect TUIO',
                        description: 'connect to TUIO server'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'whenMarkerWithIDEnters',
                    blockType: BlockType.HAT,
                    text: _translate({
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
                    text: _translate({
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
                    text: _translate({
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
                    opcode: 'followMarkerWithID',
                    blockType: BlockType.COMMAND,
                    text: _translate({
                        id: 'tuio.followMarker',
                        default: 'follow marker [MARKER_ID] [FOLLOW_TYPE]',
                        description: 'follow position and/or angle of marker '
                    }),
                    arguments: {
                        FOLLOW_TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'followTypes'
                        },
                        MARKER_ID: {
                            type: ArgumentType.STRING,
                            menu: 'markerIDMenuWithoutAny'
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getMarkerX',
                    blockType: BlockType.REPORTER,
                    text: _translate({
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
                    text: _translate({
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
                    text: _translate({
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
                    text: _translate({
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
                    text: _translate({
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
                    opcode: 'getMarkerAngularSpeed',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuio.getMarkerAngularSpeed',
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
                markerIDMenuWithoutAny: _createMarkerIDArray(false),
                markerIDMenuWithAny: _createMarkerIDArray(true),
                followTypes: _initFollowTypes()
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

    rescaleX (rawX) {
        const rescaledX = (rawX - 0.5) * 480;
        return rescaledX;
    }

    rescaleY (rawY) {
        const rescaledY = (0.5 - rawY) * 360;
        return rescaledY;
    }

    rescaleAngle (rawAngle) {
        const rescaledAngle = rawAngle / Math.PI * 180;
        return rescaledAngle;
    }

    whenMarkerWithIDEnters (args) {
        if (args.MARKER_ID === AnyMarker) {
            if (aMarkerHasEntered) {
                aMarkerHasEntered = false;
                return true;
            }
            return false;
        }
        const isNotEmpty = markersEntered.length > 0;
        if (isNotEmpty) {
            const id = markersEntered[0];
            // log.log(`${new Date().toISOString()} - if int ${args.MARKER_ID} - id in array[0] : ${id}`);

            const markerId = Cast.toNumber(args.MARKER_ID);

            if (id === markerId) {
                // log.log(`${new Date().toISOString()} - if int ${args.MARKER_ID} - mrkEntered: [${markersEntered}]`);
                // log.log(`${new Date().toISOString()} - if int ${args.MARKER_ID} - shift id: ${}`);
                markersEntered.shift();
                // log.log(`${new Date().toISOString()} - if int ${args.MARKER_ID} - mrkEntered: [${markersEntered}]`);
                return true;
            }
        }
        return false;
    }

    whenMarkerWithIDExits (args) {
        if (args.MARKER_ID === AnyMarker) {
            if (aMarkerHasExited) {
                aMarkerHasExited = false;
                return true;
            }
            return false;
        }
        const isNotEmpty = markersExited.length > 0;
        if (isNotEmpty) {
            const id = markersExited[0];
            // log.log(`${new Date().toISOString()} - exitif int ${args.MARKER_ID} - id in array[0] : ${id}`);
            const markerId = Cast.toNumber(args.MARKER_ID);
            if (id === markerId) {
                // log.log(`${new Date().toISOString()} - exitif ${args.MARKER_ID} - mrkExited: [${markersExited}]`);
                // log.log(`${new Date().toISOString()} - exitif ${args.MARKER_ID} - shift id: ${}`);
                markersExited.shift();
                // log.log(`${new Date().toISOString()} - exitif ${args.MARKER_ID} - mrkExited: [${markersExited}]`);
                return true;
            }
        }
        return false;
    }

    isMarkerWithIDPresent (args) {
        const markerId = Cast.toNumber(args.MARKER_ID);
        return markerMap.has(markerId);
    }

    followMarkerWithID (args, util) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const followType = args.FOLLOW_TYPE;
        const m = markerMap.get(markerID);
        if (m) {
            if (followType === FollowType.POSITION || followType === FollowType.BOTH) {
                util.target.setXY(this.rescaleX(m.x), this.rescaleY(m.y), false);
            }
            if (followType === FollowType.ANGLE || followType === FollowType.BOTH) {
                util.target.setDirection(this.rescaleAngle(m.angle));
            }
        }
        return;
    }

    getMarkerX (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.x);
        }
        return 0;
    }

    getMarkerY (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.y);
        }
        return 0;
    }

    getMarkerAngle (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.angle);
        }
        return 0;
    }

    getMarkerXSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.xSpeed);
        }
        return 0;
    }

    getMarkerYSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.ySpeed);
        }
        return 0;
    }

    getMarkerAngularSpeed (args) {
        const markerID = Cast.toNumber(args.MARKER_ID);
        const m = markerMap.get(markerID);
        if (m) {
            return _sanitizeNumberValue(m.angularSpeed);
        }
        return 0;
    }
}

module.exports = {Scratch3Tuio, FollowType, _makeMarkerObject, _initVariables};
