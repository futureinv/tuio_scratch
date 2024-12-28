const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

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

client.on('connect', () => {
    isConnected = true;
    log.log('connected!');
});

const _makeCursorObject = function (cursor) {
    const x = cursor.xPos;
    const y = cursor.yPos;
    const id = cursor.cursorId;
    return {id: id, x: x, y: y};
};

client.on('addTuioCursor', cursor => {
    const id = cursor.cursorId;
    cursorMap.set(id, _makeCursorObject(cursor));
    lastCursorEntered = id;
    cursorsEntered.push(id);
    setTimeout(() => {
        cursorsEntered.pop();
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
        cursorsExited.pop();
    }, 400);
    aCursorHasExited = true;
    setTimeout(() => {
        aCursorHasExited = false;
    }, 1000);
});

class Scratch3TuioCursors {
    constructor (runtime) {
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
            id: 'tuiocursors',
            name: 'Tuio Cursors',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: 'connect TUIO',
                    arguments: {}
                },
                {
                    opcode: 'getLastCursorEnteredId',
                    blockType: BlockType.REPORTER,
                    text: 'last cursor entered',
                    arguments: {}
                },
                {
                    opcode: 'getLastCursorExitedId',
                    blockType: BlockType.REPORTER,
                    text: 'last cursor exited',
                    arguments: {}
                },
                {
                    opcode: 'whenACursorEntered',
                    blockType: BlockType.HAT,
                    text: 'when a cursor entered',
                    arguments: {}
                },
                {
                    opcode: 'whenACursorExited',
                    blockType: BlockType.HAT,
                    text: 'when a cursor exited',
                    arguments: {}
                },
                {
                    opcode: 'whenCursorWithIdEntered',
                    blockType: BlockType.HAT,
                    text: 'when cursor [CURSOR_PARAM] entered',
                    arguments: {
                        CURSOR_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'whenCursorWithIdExited',
                    blockType: BlockType.HAT,
                    text: 'when cursor [CURSOR_PARAM] exited',
                    arguments: {
                        CURSOR_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorX',
                    blockType: BlockType.REPORTER,
                    text: 'cursor [CURSOR_PARAM] x',
                    arguments: {
                        CURSOR_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorY',
                    blockType: BlockType.REPORTER,
                    text: 'cursor [CURSOR_PARAM] y',
                    arguments: {
                        CURSOR_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'isCursorPresent',
                    text: 'cursor [CURSOR_PARAM] present?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        CURSOR_PARAM: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                },
                {
                    opcode: 'getCursorItem',
                    blockType: BlockType.REPORTER,
                    text: 'item [INDEX_PARAM] in cursor list',
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
                    text: 'length of cursor list',
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

    whenACursorEntered () {
        if (aCursorHasEntered) {
            aCursorHasEntered = false;
            return true;
        }
        return false;
    }

    whenACursorExited () {
        if (aCursorHasExited) {
            aCursorHasExited = false;
            return true;
        }
        return false;
    }

    whenCursorWithIdEntered (args) {
        const isNotEmpty = cursorsEntered.length > 0;
        if (isNotEmpty) {
            const id = cursorsEntered[0];
            const cursorId = Cast.toNumber(args.CURSOR_PARAM);
            if (id === cursorId) {
                cursorsEntered.pop();
                return true;
            }
        }
        return false;
    }

    whenCursorWithIdExited (args) {
        const isNotEmpty = cursorsExited.length > 0;
        if (isNotEmpty) {
            const id = cursorsExited[0];
            const cursorId = Cast.toNumber(args.CURSOR_PARAM);
            if (id === cursorId) {
                cursorsExited.pop();
                return true;
            }
        }
        return false;
    }

    getLastCursorEnteredId () {
        return lastCursorEntered;
    }

    getLastCursorExitedId () {
        return lastCursorExited;
    }

    getCursorX (args) {
        const cursorId = Cast.toNumber(args.CURSOR_PARAM);
        const c = cursorMap.get(cursorId);
        if (c) {
            return c.x;
        }
        return 0;
    }

    getCursorY (args) {
        const cursorId = Cast.toNumber(args.CURSOR_PARAM);
        const c = cursorMap.get(cursorId);
        if (c) {
            return c.y;
        }
        return 0;
    }

    isCursorPresent (args) {
        const cursorId = Cast.toNumber(args.CURSOR_PARAM);
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

module.exports = Scratch3TuioCursors;
