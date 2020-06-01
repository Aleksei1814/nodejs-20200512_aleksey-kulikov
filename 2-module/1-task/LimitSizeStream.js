const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.setEncoding(options.encoding || 'utf-8');
    this.limit = options.limit;
    this.sizeData = 0;
  }

  _transform(chunk, encoding, callback) {
    this.sizeData += chunk.byteLength;
    if (this.sizeData > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
