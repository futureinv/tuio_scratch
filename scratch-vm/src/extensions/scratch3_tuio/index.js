const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

//const TuioClient = require('../../../../tuio-client/');

//const client = new TuioClient({host:'ws://localhost:8080'});
//client.on("connect", function() {
 //   isConnected = true;
 //   log.log("connected!");
//});


class Scratch3Tuio {
    constructor(runtime) {
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
            id: 'tuio',
            name: 'Tuio',
            blocks: [
                {
                    opcode: 'connect',
                    blockType: BlockType.COMMAND,
                    text: 'connect TUIO',
                    arguments: {}
                }
            ]
        }
    }

    connect () {
        console.log('Connect!');
    }

}

module.exports = Scratch3Tuio;