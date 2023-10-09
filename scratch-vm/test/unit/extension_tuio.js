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

/* test('marker object contains all data', t => {
    const marker = new Marker();
    const markerObject = Tuio._ma
}) */
