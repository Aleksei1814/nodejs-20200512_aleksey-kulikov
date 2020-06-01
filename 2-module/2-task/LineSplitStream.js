const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.setEncoding(options.encoding || 'utf-8');
    this.chunkDataString = null;
  }

  _transform(chunk, encoding, callback) {
    let chunkData = chunk.toString();
    if (this.chunkDataString) {
      chunkData = this.chunkDataString + chunkData;
    }
    const lines = chunkData.split(os.EOL);
    this.chunkDataString = lines.splice(lines.length-1, 1)[0];
    for (const item of lines) {
      this.push(item);
    }
    callback();
  }

  _flush(callback) {
    if (this.chunkDataString) this.push(this.chunkDataString);
    this.chunkDataString = null;
    callback();
  }
}

module.exports = LineSplitStream;
