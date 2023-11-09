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

const removeTestMarker = function (markerID) {
    const marker = new TuioObject({
        si: 3,
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
    t.end();
});

test('adding a marker makes it present for Scratch', t => {
    t.notOk(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    addTestMarker(1);
    t.ok(tuio.isMarkerWithIDPresent({MARKER_ID: '1'}));
    removeTestMarker(1);
    t.end();
});

test('bug: the push/pop bug generating the critical run is avoided', t => {
    addTestMarker(3);
    addTestMarker(4);
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '3'}));
    t.ok(tuio.whenMarkerWithIDEnters({MARKER_ID: '4'}));
    removeTestMarker(3);
    removeTestMarker(4);
    t.end();
});

test('Tuio extension has 11 blocks', t => {
    const infoObject = tuio.getInfo();
    const blocks = infoObject.blocks;
    t.equal(blocks.length, 11);
    t.end();
});

test('Tuio extension has 2 menus', t => {
    const infoObject = tuio.getInfo();
    const menus = infoObject.menus;
    t.equal(Object.keys(menus).length, 2);
    t.end();
});
