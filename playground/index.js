var Buffer         = require('buffer').Buffer
,   WritableStream = require('stream').Writable
,   Responder;

Responder = function () {
  WritableStream.call(this);
};

require('util').inherits(Responder, WritableStream);

Responder.prototype._write = function (data, enc, done) {
  data = Buffer.isBuffer(data) ? data : new Buffer(data, enc || 'utf8');
  this.emit('data', data);
};

module.exports = Responder;
