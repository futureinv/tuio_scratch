const test = require('tap').test;
// const TuioClient = require('tuio-client');
const Tuio = require('../../src/extensions/scratch3_tuio/index.js');
// const Marker = require('../../../tuio-client/tuio-extended/src/TuioObject/');

/* const fakeRuntime = {
    getTargetForStage: () => ({}),
    on: () => {} // Stub out listener methods used in constructor.
}; */

const tuio = new Tuio();

// test('a failing test', t => {
//    t.equal(0, 1);
//    t.end();
// });

test('isConnected variable correctly describes state', t => {
    t.equal(tuio.isConnected(), false);
    tuio.client.onConnect();
    // tuio.connect();
    t.equal(tuio.isConnected(), true);
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

/* test('follow marker works correctly'), t => {
    tuio.followMarkerWithID(args, util)
    t.equal(util.target.x, 100);
    t.end();
}); */

/* test('marker object contains all data', t => {
    const marker = new Marker();
    const markerObject = Tuio._ma
}) */
