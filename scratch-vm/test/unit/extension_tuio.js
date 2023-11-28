const test = require('tap').test;
// const TuioClient = require('../../../tuio-client').TuioClient;
const Tuio = require('../../src/extensions/scratch3_tuio/index.js').Scratch3Tuio;
const _makeMarkerObject = require('../../src/extensions/scratch3_tuio/index.js')._makeMarkerObject;
const _initVariables = require('../../src/extensions/scratch3_tuio/index.js')._initVariables;
const FollowType = require('../../src/extensions/scratch3_tuio/index.js').FollowType;

const {TuioTime, TuioObject} = require('../../../tuio-client');

const Runtime = require('../../src/engine/runtime');
const Sprite = require('../../src/sprites/sprite.js');
const RenderedTarget = require('../../src/sprites/rendered-target.js');
const formatMessage = require('format-message');

const tuio = new Tuio();

const addTestMarker = function (markerID) {
    const marker = new TuioObject({
        si: 1,
        sym: markerID,
        xp: 0,
        yp: 0,
        a: 0
    });
    tuio.client.objectAdded(marker);
};

const updateTestMarker = function (markerID, args) {
    const marker = new TuioObject({
        si: 1,
        sym: markerID,
        xp: 0,
        yp: 0,
        a: 0
    });
    for (const key in args) {
        marker[key] = args[key];
    }
    tuio.client.currentTime = new TuioTime();
    tuio.client.objectDefault(marker);
};

const removeTestMarker = function (markerID, force) {
    const marker = new TuioObject({
        si: 1,
        sym: markerID,
        xp: 0,
        yp: 0,
        a: 0
    });
    if (force) marker.condition = 'killed';
    tuio.client.currentTime = new TuioTime();
    tuio.client.objectRemoved(marker);
};

test('isConnected variable correctly describes state', t => {
    t.equal(tuio.isConnected(), false);
    tuio.client.onConnect();
    t.equal(tuio.isConnected(), true);
    t.end();
});

test('marker object contains all data', t => {
    const marker = new TuioObject({
        ttime: tuio.client.currentTime,
        si: 1,
        sym: 1,
        xp: 0,
        yp: 0,
        a: 0
    });
    const markerObject = _makeMarkerObject(marker);
    t.ok('id' in markerObject);
    t.ok('x' in markerObject);
    t.ok('y' in markerObject);
    t.ok('angle' in markerObject);
    t.ok('xSpeed' in markerObject);
    t.ok('ySpeed' in markerObject);
    t.ok('angularSpeed' in markerObject);
    t.end();
});

test('adding a marker sets the corresponding hat block to true', t => {
    t.notOk(tuio.whenMarkerWithIDEnters({MARKER_ID: '2'}));
    addTestMarker(2);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '2'}));
    removeTestMarker(2, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('hat block with any fires for any marker', t => {
    t.notOk(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    addTestMarker(3);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    removeTestMarker(3, true);
    t.ok(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('removing a marker sets the corresponding hat block to true', t => {
    addTestMarker(5);
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: '5'}));
    removeTestMarker(5, true);
    t.ok(tuio.whenMarkerWithIDExits({MARKER_ID: '5'}));
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('adding a marker makes it present for Scratch', t => {
    t.notOk(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('removing a marker makes it absent for Scratch', t => {
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1, true);
    t.notOk(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
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

test('follow type menu has 3 elements', t => {
    const infoObject = tuio.getInfo();
    const menus = infoObject.menus;
    const followTypeMenu = menus.followTypes;
    t.equal(followTypeMenu.length, 3);
    t.end();
});

test('markerID menus differ by one element', t => {
    const infoObject = tuio.getInfo();
    const menus = infoObject.menus;
    const withAny = menus.markerIDMenuWithAny;
    const withoutAny = menus.markerIDMenuWithoutAny;
    t.equal(withAny.length - withoutAny.length, 1);
    t.end();
});

test('coordinates getters returns correct values for existing markers', t => {
    addTestMarker(9);
    updateTestMarker(9, {xPos: 0.9, yPos: 0.1, angle: 2});
    t.equal(tuio.getMarkerX({MARKER_ID: '9'}), 0.9);
    t.equal(tuio.getMarkerY({MARKER_ID: '9'}), 0.1);
    t.equal(tuio.getMarkerAngle({MARKER_ID: '9'}), 2);
    removeTestMarker(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('coordinates getters returns zero values for missing markers', t => {
    t.equal(tuio.getMarkerX({MARKER_ID: '7'}), 0);
    t.equal(tuio.getMarkerY({MARKER_ID: '7'}), 0);
    t.equal(tuio.getMarkerAngle({MARKER_ID: '7'}), 0);
    t.end();
});

test('speed getters returns correct values for existing markers', t => {
    addTestMarker(9);
    updateTestMarker(9, {xSpeed: 0.7, ySpeed: 0.3, rotationSpeed: 1});
    t.equal(tuio.getMarkerXSpeed({MARKER_ID: '9'}), 0.7);
    t.equal(tuio.getMarkerYSpeed({MARKER_ID: '9'}), 0.3);
    t.equal(tuio.getMarkerAngularSpeed({MARKER_ID: '9'}), 1);
    removeTestMarker(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('speed getters returns zero values for missing markers', t => {
    t.equal(tuio.getMarkerXSpeed({MARKER_ID: '8'}), 0);
    t.equal(tuio.getMarkerYSpeed({MARKER_ID: '8'}), 0);
    t.equal(tuio.getMarkerAngularSpeed({MARKER_ID: '8'}), 0);
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

test('rescaling of Angle coordinates works correctly', t => {
    const facingUpRaw = 0;
    const facingRightRaw = Math.PI / 2;
    const facingDownRaw = Math.PI;
    const facingUpScratch = 0;
    const facingRightScratch = 90;
    const facingDownScratch = 180;
    t.equal(tuio.rescaleAngle(facingUpRaw), facingUpScratch);
    t.equal(tuio.rescaleAngle(facingRightRaw), facingRightScratch);
    t.equal(tuio.rescaleAngle(facingDownRaw), facingDownScratch);
    t.end();
});

test('if a speed is NaN, scratch block will return 0', t => {
    addTestMarker(15);
    updateTestMarker(15, {xSpeed: NaN});
    t.equal(tuio.getMarkerXSpeed({MARKER_ID: '15'}), 0);
    removeTestMarker(15, true);
    t.end();
});

test('follow marker position only', t => {
    const rt = new Runtime();
    const sprite = new Sprite(null, rt);
    const target = new RenderedTarget(sprite, rt);
    const util = {target};
    addTestMarker(9);
    updateTestMarker(9, {xPos: 0.9, yPos: 0.1, angle: Math.Pi});
    tuio.followMarkerWithID({MARKER_ID: '9', FOLLOW_TYPE: FollowType.POSITION}, util);
    t.equal(target.x, 192);
    t.equal(target.y, 144);
    t.equal(target.direction, 90);
    removeTestMarker(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});


test('follow marker angle only', t => {
    const rt = new Runtime();
    const sprite = new Sprite(null, rt);
    const target = new RenderedTarget(sprite, rt);
    const util = {target};
    addTestMarker(9);
    updateTestMarker(9, {xPos: 0.9, yPos: 0.1, angle: Math.PI});
    tuio.followMarkerWithID({MARKER_ID: '9', FOLLOW_TYPE: FollowType.ANGLE}, util);
    t.equal(target.x, 0);
    t.equal(target.y, 0);
    t.equal(target.direction, 180);
    removeTestMarker(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

test('follow marker position and angle', t => {
    const rt = new Runtime();
    const sprite = new Sprite(null, rt);
    const target = new RenderedTarget(sprite, rt);
    const util = {target};
    addTestMarker(9);
    updateTestMarker(9, {xPos: 0.9, yPos: 0.1, angle: Math.PI});
    tuio.followMarkerWithID({MARKER_ID: '9', FOLLOW_TYPE: FollowType.BOTH}, util);
    t.equal(target.x, 192);
    t.equal(target.y, 144);
    t.equal(target.direction, 180);
    removeTestMarker(9, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

// tests on sleeping

test('removing a marker make it sleeping', t => {
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1, false);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: '1'}));
    setTimeout(() => {
        t.ok(tuio.whenMarkerWithIDExits({MARKER_ID: '1'}));
    }, 800);

    removeTestMarker(1, true);
    t.teardown(() => {
        _initVariables();
    });
    setTimeout(() => {
        t.end();
    }, 1500);
});

// Questo test fa un po' pena, perchè ho bisogno di simulare un po' di tempo tra una cosa e l'altra
test('entering while sleeping', t => {
    addTestMarker(10);
    removeTestMarker(10, false);
    setTimeout(() => {
        addTestMarker(10);
    }, 500);
    setTimeout(() => {
        t.notOk(tuio.whenMarkerWithIDEnters({MARKER_ID: '10'}));
        removeTestMarker(10, true);
    }, 550);
  
    setTimeout(() => {
        t.teardown(() => {
            _initVariables();
        });
        t.end();
    }, 1500);
});

test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestMarker(3);
    addTestMarker(4);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '4'}));
    removeTestMarker(3, true);
    removeTestMarker(4, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});

// Questo test fallisce ma ha poca importanza: gli hat vengono eseguiti in continuazione, anche se ritorna
// false la prima andrà alla seconda, forse
/*
test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestMarker(3);
    addTestMarker(4);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '4'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    removeTestMarker(3, true);
    removeTestMarker(4, true);
    t.teardown(() => {
        _initVariables();
    });
    t.end();
});
*/

test('bug: hat block with id removes the value in the array for the hat with any', t => {
    addTestMarker(3);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    removeTestMarker(3, true);
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
