const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');

const formatMessage = require('format-message');
//https://github.com/xcratch/xcx-example/blob/main/src/block/translations.json
const transl = {
    "hr": { 
        "tuioConnect": "Connect TUIO HR"
    },
    "it": {
        "tuioConnect": "Connetti a TUIO"
    },
    "en": { 
        "tuioConnect": "Connect TUIO"
    },
    "fr": { 
        "tuioConnect": "Connect TUIO FR"
    }
}

formatMessage.setup({
    translations: transl
});

const TuioClient = require('tuio-client');

let isConnected = false;

const client = new TuioClient({host:'ws://localhost:8080'});
client.on("connect", function() {
   isConnected = true;
   log.log("connected!");
});


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
                    text: formatMessage({
                        id: 'tuioConnect',
                        default : 'connect TUIO',
                        description: 'connect to TUIO server'
                    }),
                    arguments: {}
                }
            ]
        }
    }

    connect() {
        if(isConnected) {
            return;
        }
        client.connect();
    }

}

module.exports = Scratch3Tuio;