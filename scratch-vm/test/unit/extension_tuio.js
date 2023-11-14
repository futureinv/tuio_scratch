const test = require('tap').test;
// const TuioClient = require('../../../tuio-client').TuioClient;
const Tuio = require('../../src/extensions/scratch3_tuio/index.js').Scratch3Tuio;
const _makeMarkerObject = require('../../src/extensions/scratch3_tuio/index.js')._makeMarkerObject;
const {TuioTime, TuioObject} = require('../../../tuio-client');

/* const fakeRuntime = {
    getTargetForStage: () => ({}),
    on: () => {} // Stub out listener methods used in constructor.
}; */

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

const removeTestMarker = function (markerID) {
    const marker = new TuioObject({
        si: 1,
        sym: markerID,
        xp: 0,
        yp: 0,
        a: 0
    });
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
    removeTestMarker(2);
    setTimeout(() => t.end(), 500);
});

test('hat block with any fires for any marker', t => {
    t.notOk(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    addTestMarker(3);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    removeTestMarker(3);
    t.ok(tuio.whenMarkerWithIDExits({MARKER_ID: 'any'}));
    setTimeout(() => t.end(), 500);
});

test('removing a marker sets the corresponding hat block to true', t => {
    addTestMarker(5);
    t.notOk(tuio.whenMarkerWithIDExits({MARKER_ID: '5'}));
    removeTestMarker(5);
    t.ok(tuio.whenMarkerWithIDExits({MARKER_ID: '5'}));
    setTimeout(() => t.end(), 500);
});

test('adding a marker makes it present for Scratch', t => {
    t.notOk(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1);
    setTimeout(() => t.end(), 500);
});

test('removing a marker makes it absent for Scratch', t => {
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1);
    t.notOk(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    setTimeout(() => t.end(), 500);
});

test('Tuio extension has 11 blocks', t => {
    const infoObject = tuio.getInfo();
    const blocks = infoObject.blocks;
    t.equal(blocks.length, 12);
    t.end();
});

test('Tuio extension has 2 menus', t => {
    const infoObject = tuio.getInfo();
    const menus = infoObject.menus;
    t.equal(Object.keys(menus).length, 3);
    t.end();
});

test('coordinates getters returns correct values for existing markers', t => {
    addTestMarker(9);
    updateTestMarker(9, {xPos: 0.9, yPos: 0.1, angle: 2});
    t.equal(tuio.getMarkerX({MARKER_ID: '9'}), 0.9);
    t.equal(tuio.getMarkerY({MARKER_ID: '9'}), 0.1);
    t.equal(tuio.getMarkerAngle({MARKER_ID: '9'}), 2);
    removeTestMarker(9);
    setTimeout(() => t.end(), 500);
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
    removeTestMarker(9);
    setTimeout(() => t.end(), 500);
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

// Failing tests until we fix known issue with push/pop

test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestMarker(3);
    addTestMarker(4);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '4'}));
    removeTestMarker(3);
    removeTestMarker(4);
    t.end();
});

test('bug: hat block with id removes the value in the array for the hat with any', t => {
    addTestMarker(3);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: 'any'}));
    removeTestMarker(3);
    t.end();
});