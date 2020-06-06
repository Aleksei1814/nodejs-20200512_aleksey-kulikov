const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const limitSize = 1048576;
server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(writeStream);

      let sizeFile = 0;
      req.on('data', (chunk) => {
        sizeFile = sizeFile + chunk.byteLength;
        if (sizeFile > limitSize) {
          res.statusCode = 413;
          res.end('error sizeFile');
          fs.unlink(filepath, (err) => {
            if (err) return console.log(`can't remove file ${filepath}`);
            console.log(`file ${filepath} removed`);
          });
        }
      });

      writeStream.on('finish', () => {
        res.statusCode = 200;
        res.end('its ok');
      });

      writeStream.on('error', (error) => {
        switch (error.code) {
          case 'EEXIST':
            res.statusCode = 409;
            res.end('File exists');
            break;
          case 'EISDIR':
            res.statusCode = 400;
            res.end('Is a directory');
            break;
          default:
            res.statusCode = 500;
            res.end('internal server error');
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
