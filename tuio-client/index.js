const Tuio = require('tuio-extended/src/Tuio');

Tuio.Cursor = require('tuio-extended/src/TuioCursor');
Tuio.Object = require('tuio-extended/src/TuioObject');
Tuio.Component = require('tuio-extended/src/TuioComponent');
Tuio.Token = require('tuio-extended/src/TuioToken');
Tuio.Client = require('tuio-extended/src/TuioClient');
Tuio.Time = require('tuio-extended/src/TuioTime');

const TuioClient = Tuio.Client;
const TuioTime = Tuio.Time;
const TuioObject = Tuio.Object;

module.exports = {TuioClient, TuioTime, TuioObject};
