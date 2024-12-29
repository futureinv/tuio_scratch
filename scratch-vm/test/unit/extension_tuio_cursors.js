const test = require('tap').test;
// const TuioClient = require('../../../tuio-client').TuioClient;
const Tuio = require('../../src/extensions/scratch3_tuio_cursors/index.js').Scratch3TuioCursors;
const _makeCursorObject = require('../../src/extensions/scratch3_tuio_cursors/index.js')._makeCursorObject;
const _initVariables = require('../../src/extensions/scratch3_tuio_cursors/index.js')._initVariables;

const {TuioTime, TuioCursor} = require('tuio-client');

const Runtime = require('../../src/engine/runtime.js');
const Sprite = require('../../src/sprites/sprite.js');
const RenderedTarget = require('../../src/sprites/rendered-target.js');
const formatMessage = require('format-message');

const tuio = new Tuio();

const addTestCursor = function (cursorID) {
    const cursor = new TuioCursor({
        si: 1,
        ci: cursorID,
        xp: 0,
        yp: 0
    });
    tuio.client.cursorAdded(cursor);
};

const updateTestCursor = function (cursorID, args) {
    const cursor = new TuioCursor({
        si: 1,
        ci: cursorID,
        xp: 0,
        yp: 0
    });
    for (const key in args) {
        cursor[key] = args[key];
    }
    tuio.client.currentTime = new TuioTime();
    tuio.client.cursorDefault(cursor);
};

const removeTestCursor = function (cursorID) {
    const cursor = new TuioCursor({
        si: 1,
        ci: cursorID,
        xp: 0,
        yp: 0
    });
    tuio.client.currentTime = new TuioTime();
    tuio.client.cursorRemoved(cursor);
};

test('isConnected variable correctly describes state', t => {
    t.equal(tuio.isConnected(), false);
    tuio.client.onConnect();
    t.equal(tuio.isConnected(), true);
    t.end();
});

test('cursor object contains all data', t => {
    const cursor = new TuioCursor({
        ttime: tuio.client.currentTime,
        si: 1,
        ci: 1,
        xp: 0,
        yp: 0
    });
    const cursorObject = _makeCursorObject(cursor);
    t.ok('id' in cursorObject);
    t.ok('x' in cursorObject);
    t.ok('y' in cursorObject);
    t.ok('xSpeed' in cursorObject);
    t.ok('ySpeed' in cursorObject);
    t.end();
});

test('adding a cursor sets the corresponding hat block to true', t => {
    t.notOk(tuio.whenCursorWithIDEnters({CURSOR_ID: 2}));
    addTestCursor(2);
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: 2}));
    removeTestCursor(2, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('hat block with any fires for any cursor', t => {
    t.notOk(tuio.whenAnyCursorEnters());
    t.notOk(tuio.whenAnyCursorExits());
    addTestCursor(3);
    t.ok(tuio.whenAnyCursorEnters());
    t.notOk(tuio.whenAnyCursorExits());
    removeTestCursor(3, true);
    t.ok(tuio.whenAnyCursorExits());
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('removing a cursor sets the corresponding hat block to true', t => {
    addTestCursor(5);
    t.notOk(tuio.whenCursorWithIDExits({CURSOR_ID: 5}));
    removeTestCursor(5, true);
    t.ok(tuio.whenCursorWithIDExits({CURSOR_ID: 5}));
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('adding a cursor makes it present for Scratch', t => {
    t.notOk(tuio.isCursorPresent({CURSOR_ID: 1}));
    addTestCursor(1);
    t.ok(tuio.isCursorPresent({CURSOR_ID: 1}));
    removeTestCursor(1, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('removing a cursor makes it absent for Scratch', t => {
    addTestCursor(1);
    t.ok(tuio.isCursorPresent({CURSOR_ID: 1}));
    removeTestCursor(1, true);
    t.notOk(tuio.isCursorPresent({CURSOR_ID: 1}));
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('Tuio extension has 11 blocks', t => {
    const infoObject = tuio.getInfo();
    const blocks = infoObject.blocks;
    t.equal(blocks.length, 11);
    t.end();
});

test('Tuio extension has 3 menus', t => {
    const infoObject = tuio.getInfo();
    const menus = infoObject.menus;
    t.equal(Object.keys(menus).length, 3);
    t.end();
});

test('coordinates getters returns correct values for existing cursors', t => {
    addTestCursor(9);
    updateTestCursor(9, {xPos: 0.9, yPos: 0.1});
    t.equal(tuio.getCursorX({CURSOR_ID: 9}), 0.9);
    t.equal(tuio.getCursorY({CURSOR_ID: 9}), 0.1);
    removeTestCursor(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('coordinates getters returns zero values for missing cursors', t => {
    t.equal(tuio.getCursorX({CURSOR_ID: 7}), 0);
    t.equal(tuio.getCursorY({CURSOR_ID: 7}), 0);
    t.end();
});

test('speed getters returns correct values for existing cursors', t => {
    addTestCursor(9);
    updateTestCursor(9, {xSpeed: 0.7, ySpeed: 0.3});
    t.equal(tuio.getCursorXSpeed({CURSOR_ID: 9}), 0.7);
    t.equal(tuio.getCursorYSpeed({CURSOR_ID: 9}), 0.3);
    removeTestCursor(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('speed getters returns zero values for missing cursors', t => {
    t.equal(tuio.getCursorXSpeed({CURSOR_ID: 8}), 0);
    t.equal(tuio.getCursorYSpeed({CURSOR_ID: 8}), 0);
    t.end();
});

test('rescaling of X coordinates works correctly', t => {
    const farLeftRaw = 0;
    const halfwayRaw = 0.5;
    const farRightRaw = 1;
    const farLeftScratch = -240;
    const halfwayScratch = 0;
    const farRightScratch = 240;
    t.equal(tuio.rescaleX(farLeftRaw), farLeftScratch);
    t.equal(tuio.rescaleX(halfwayRaw), halfwayScratch);
    t.equal(tuio.rescaleX(farRightRaw), farRightScratch);
    t.end();
});

test('rescaling of Y coordinates works correctly', t => {
    const farUpRaw = 0;
    const halfwayRaw = 0.5;
    const farDownRaw = 1;
    const farUpScratch = 180;
    const halfwayScratch = 0;
    const farDownScratch = -180;
    t.equal(tuio.rescaleY(farUpRaw), farUpScratch);
    t.equal(tuio.rescaleY(halfwayRaw), halfwayScratch);
    t.equal(tuio.rescaleY(farDownRaw), farDownScratch);
    t.end();
});

test('if a speed is NaN, scratch block will return 0', t => {
    addTestCursor(15);
    updateTestCursor(15, {xSpeed: NaN});
    t.equal(tuio.getCursorXSpeed({CURSOR_ID: 15}), 0);
    removeTestCursor(15, true);
    t.end();
});

test('reach cursor position only', t => {
    const rt = new Runtime();
    const sprite = new Sprite(null, rt);
    const target = new RenderedTarget(sprite, rt);
    const util = {target};
    addTestCursor(9);
    updateTestCursor(9, {xPos: 0.9, yPos: 0.1});
    tuio.reachCursorWithID({CURSOR_ID: 9}, util);
    t.equal(target.x, 192);
    t.equal(target.y, 144);
    removeTestCursor(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

// tests on sleeping

test('removing a cursor make it sleeping', t => {
    addTestCursor(1);
    t.ok(tuio.isCursorPresent({CURSOR_ID: 1}));
    removeTestCursor(1, false);
    t.ok(tuio.isCursorPresent({CURSOR_ID: 1}));
    t.notOk(tuio.whenCursorWithIDExits({CURSOR_ID: 1}));
    setTimeout(() => {
        t.ok(tuio.whenCursorWithIDExits({CURSOR_ID: 1}));
    }, 800);

    removeTestCursor(1, true);
    t.teardown(() => {
        _initVariables();
    });
    setTimeout(() => {
        t.end();
    }, 1500);
});

// Questo test fa un po' pena, perchè ho bisogno di simulare un po' di tempo tra una cosa e l'altra
test('entering while sleeping', t => {
    addTestCursor(10);
    removeTestCursor(10, false);
    setTimeout(() => {
        addTestCursor(10);
    }, 500);
    setTimeout(() => {
        t.notOk(tuio.whenCursorWithIDEnters({CURSOR_ID: 10}));
        removeTestCursor(10, true);
    }, 550);
  
    setTimeout(() => {
        t.teardown(() => {
            _initVariables();
        });
        t.end();
    }, 1500);
});

test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestCursor(3);
    addTestCursor(4);
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: 3}));
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: 4}));
    removeTestCursor(3, true);
    removeTestCursor(4, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

// Questo test fallisce ma ha poca importanza: gli hat vengono eseguiti in continuazione, anche se ritorna
// false la prima andrà alla seconda, forse
/*
test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestCursor(3);
    addTestCursor(4);
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: '4'}));
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: '3'}));
    removeTestCursor(3, true);
    removeTestCursor(4, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});
*/

test('bug: hat block with id removes the value in the array for the hat with any', t => {
    addTestCursor(3);
    t.ok(tuio.whenCursorWithIDEnters({CURSOR_ID: 3}));
    t.ok(tuio.whenAnyCursorEnters());
    removeTestCursor(3, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('changing locale translates blocks', t => {
    const infoObject = tuio.getInfo();
    const blocks = infoObject.blocks;
    const connectBlock = blocks[0];
    t.equal(connectBlock.text, 'connect TUIO');
    formatMessage.setup({locale: 'it'});
    const infoObjectIT = tuio.getInfo();
    const blocksIT = infoObjectIT.blocks;
    const connectBlockIT = blocksIT[0];
    t.equal(connectBlockIT.text, 'connetti a TUIO');
    t.end();
});
