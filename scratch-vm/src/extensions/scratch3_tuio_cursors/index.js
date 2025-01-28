const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const formatMessage = require('format-message');

const {TuioClient} = require('tuio-client');

const cursorsEntered = new Array();
const cursorsExited = new Array();
const cursorMap = new Map();
let lastCursorEntered = -1;
let lastCursorExited = -1;
let isConnected = false;
let aCursorHasEntered = false;
let aCursorHasExited = false;

const client = new TuioClient({host: 'ws://localhost:8080'});

const _translate = function (msg) {
    const translations = {
        it: {
            'tuioCursors.connect': 'connetti a TUIO',
            'tuioCursors.lastEntered' : 'ultimo Cursore entrato',
            'tuioCursors.lastExited' : 'ultimo Cursore uscito',
            'tuioCursors.whenAnyCursorEnters': 'quando entra un Cursore',
            'tuioCursors.whenAnyCursorExits': 'quando esce un Cursore',
            'tuioCursors.whenCursorWithIDEnters': 'quando entra il Cursore [CURSOR_ID]',
            'tuioCursors.whenCursorWithIDExits': 'quando esce il Cursore [CURSOR_ID]',
            'tuioCursors.isCursorPresent': 'il Cursore [CURSOR_ID] è presente',
            'tuioCursors.reachCursor': 'raggiungi il Cursore [CURSOR_ID]',
            'tuioCursors.getCursorX': 'coordinata X del Cursore [CURSOR_ID]',
            'tuioCursors.getCursorY': 'coordinata Y del Cursore [CURSOR_ID]',
            'tuioCursors.getCursorXSpeed': 'velocità X del Cursore [CURSOR_ID]',
            'tuioCursors.getCursorYSpeed': 'velocità Y del Cursore [CURSOR_ID]',
            'tuioCursors.itemIndex': 'elemento [INDEX_PARAM] della lista dei cursori',
            'tuioCursors.listLength': 'lunghezza della lista dei cursori'
        }
    };
    const locale = formatMessage.setup().locale || 'en';
    if (locale in translations) {
        return translations[locale][msg.id] || msg.default;
    }
    return msg.default;
};

const _initVariables = function () {
    aCursorHasEntered = false;
    aCursorHasExited = false;
    cursorsEntered.length = 0;
    cursorsExited.length = 0;
    cursorMap.clear();
};

const _sanitizeNumberValue = function (value) {
    if (typeof value !== 'number' || Number.isNaN(value)) value = 0;
    return value;
};

client.on('connect', () => {
    isConnected = true;
    log.log('connected!');
});

const _makeCursorObject = function (cursor) {
    const x = cursor.xPos;
    const y = cursor.yPos;
    const xSpeed = cursor.xSpeed;
    const ySpeed = cursor.ySpeed;
    const id = cursor.cursorId;
    return {
        id: id,
        x: x,
        y: y,
        xSpeed: xSpeed,
        ySpeed: ySpeed
    };
};

client.on('addTuioCursor', cursor => {
    const id = cursor.cursorId;
    cursorMap.set(id, _makeCursorObject(cursor));
    lastCursorEntered = id;
    cursorsEntered.push(id);
    setTimeout(() => {
        cursorsEntered.shift();
    }, 400);
    aCursorHasEntered = true;
    setTimeout(() => {
        aCursorHasEntered = false;
    }, 1000);
});

client.on('updateTuioCursor', cursor => {
    const id = cursor.cursorId;
    cursorMap.set(id, _makeCursorObject(cursor));
});

client.on('removeTuioCursor', cursor => {
    const id = cursor.cursorId;
    cursorMap.delete(id);
    lastCursorExited = id;
    cursorsExited.push(id);
    setTimeout(() => {
        cursorsExited.shift();
    }, 400);
    aCursorHasExited = true;
    setTimeout(() => {
        aCursorHasExited = false;
    }, 1000);
});

class Scratch3TuioCursors {
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
        //     this.frameToggle = !this.frameToggle;
        // }, this.runtime.currentStepTime);
    }

    getInfo () {
        return {
            id: 'tuiocursors',
            name: 'Tuio Cursors',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: _translate({
                        id: 'tuioCursors.connect',
                        default: 'connect TUIO',
                        description: 'connect to TUIO server'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'getLastCursorEnteredID',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.lastEntered',
                        default: 'last cursor entered',
                        description: 'last cursor entered'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'getLastCursorExitedID',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.lastExited',
                        default: 'last cursor exited',
                        description: 'last cursor exited'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'whenAnyCursorEnters',
                    blockType: BlockType.HAT,
                    text: _translate({
                        id: 'tuioCursors.whenAnyCursorEnters',
                        default: 'when a cursor enters',
                        description: 'when a cursor enters'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'whenAnyCursorExits',
                    blockType: BlockType.HAT,
                    text: _translate({
                        id: 'tuioCursors.whenAnyCursorExits',
                        default: 'when a cursor exits',
                        description: 'when a cursor exits'
                    }),
                    arguments: {}
                },
                {
                    opcode: 'whenCursorWithIDEnters',
                    blockType: BlockType.HAT,
                    text: _translate({
                        id: 'tuioCursors.whenCursorWithIDEnters',
                        default: 'when cursor [CURSOR_ID] enters',
                        description: 'when cursor [CURSOR_ID] enters'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenCursorWithIDExits',
                    blockType: BlockType.HAT,
                    text: _translate({
                        id: 'tuioCursors.whenCursorWithIDExits',
                        default: 'when cursor [CURSOR_ID] exits',
                        description: 'when cursor [CURSOR_ID] exited'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'reachCursorWithID',
                    blockType: BlockType.COMMAND,
                    text: _translate({
                        id: 'tuioCursors.reachCursor',
                        default: 'reach cursor [CURSOR_ID]',
                        description: 'reach position of cursor'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    },
                    filter: [TargetType.SPRITE]
                },
                {
                    opcode: 'getCursorX',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.getCursorX',
                        default: 'cursor [CURSOR_ID] x',
                        description: 'cursor [CURSOR_ID] x'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorY',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.getCursorY',
                        default: 'cursor [CURSOR_ID] y',
                        description: 'cursor [CURSOR_ID] y'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorXSpeed',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.getCursorXSpeed',
                        default: 'cursor [CURSOR_ID] x speed',
                        description: 'cursor [CURSOR_ID] x speed'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorYSpeed',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.getCursorYSpeed',
                        default: 'cursor [CURSOR_ID] y speed',
                        description: 'cursor [CURSOR_ID] y speed'
                    }),
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'isCursorPresent',
                    text: _translate({
                        id: 'tuioCursors.isCursorPresent',
                        default: 'cursor [CURSOR_ID] present?',
                        description: 'cursor [CURSOR_ID] present?'
                    }),
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        CURSOR_ID: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorItem',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.itemIndex',
                        default: 'item [INDEX_PARAM] in cursor list',
                        description: 'item [INDEX_PARAM] in cursor list'
                    }),
                    arguments: {
                        INDEX_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'getCursorCount',
                    blockType: BlockType.REPORTER,
                    text: _translate({
                        id: 'tuioCursors.listLength',
                        default: 'length of cursor list',
                        description: 'length of cursor list'
                    }),
                    arguments: {}
                }
            ],
            menus: {
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

    whenAnyCursorEnters () {
        if (aCursorHasEntered) {
            aCursorHasEntered = false;
            return true;
        }
        return false;
    }

    whenAnyCursorExits () {
        if (aCursorHasExited) {
            aCursorHasExited = false;
            return true;
        }
        return false;
    }

    whenCursorWithIDEnters (args) {
        const isNotEmpty = cursorsEntered.length > 0;
        if (isNotEmpty) {
            const id = cursorsEntered[0];
            const cursorId = Cast.toNumber(args.CURSOR_ID);
            if (id === cursorId) {
                cursorsEntered.shift();
                return true;
            }
        }
        return false;
    }

    whenCursorWithIDExits (args) {
        const isNotEmpty = cursorsExited.length > 0;
        if (isNotEmpty) {
            const id = cursorsExited[0];
            const cursorId = Cast.toNumber(args.CURSOR_ID);
            if (id === cursorId) {
                cursorsExited.shift();
                return true;
            }
        }
        return false;
    }

    getLastCursorEnteredID () {
        return lastCursorEntered;
    }

    getLastCursorExitedID () {
        return lastCursorExited;
    }

    reachCursorWithID (args, util) {
        const cursorID = Cast.toNumber(args.CURSOR_ID);
        const c = cursorMap.get(cursorID);
        if (c) {
            util.target.setXY(this.rescaleX(c.x), this.rescaleY(c.y), false);
        }
        return;
    }

    getCursorX (args) {
        const cursorId = Cast.toNumber(args.CURSOR_ID);
        const c = cursorMap.get(cursorId);
        if (c) {
            return _sanitizeNumberValue(c.x);
        }
        return 0;
    }

    getCursorY (args) {
        const cursorId = Cast.toNumber(args.CURSOR_ID);
        const c = cursorMap.get(cursorId);
        if (c) {
            return _sanitizeNumberValue(c.y);
        }
        return 0;
    }

    getCursorXSpeed (args) {
        const cursorId = Cast.toNumber(args.CURSOR_ID);
        const c = cursorMap.get(cursorId);
        if (c) {
            return _sanitizeNumberValue(c.xSpeed);
        }
        return 0;
    }

    getCursorYSpeed (args) {
        const cursorId = Cast.toNumber(args.CURSOR_ID);
        const c = cursorMap.get(cursorId);
        if (c) {
            return _sanitizeNumberValue(c.ySpeed);
        }
        return 0;
    }

    isCursorPresent (args) {
        const cursorId = Cast.toNumber(args.CURSOR_ID);
        return cursorMap.has(cursorId);
    }

    getCursorCount () {
        return cursorMap.size;
    }

    getCursorItem (args) {
        const index = Cast.toNumber(args.INDEX_PARAM);
        if (index > 0 && index <= cursorMap.size && cursorMap.size > 0) {
            const array = Array.from(cursorMap.keys());
            return array[index - 1];
        
        }
        return -1;
    }
}

module.exports = {Scratch3TuioCursors, _makeCursorObject, _initVariables};
