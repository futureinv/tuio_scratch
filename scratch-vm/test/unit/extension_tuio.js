const test = require('tap').test;
const Tuio = require('../../src/extensions/scratch3_tuio/index.js');


/* const fakeRuntime = {
    getTargetForStage: () => ({}),
    on: () => {} // Stub out listener methods used in constructor.
}; */

const tuio = new Tuio();

// test('a failing test', t => {
//    t.equal(0, 1);
//    t.end();
//});

test('isConnected variable correctly describes state', t => {
    t.equal(tuio.isConnected, 0);
    tuio.connect();
    t.equal(tuio.isConnected, 1);
    t.end();
});
