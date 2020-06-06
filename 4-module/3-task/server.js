const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      fs.stat(filepath, (error) => {
        if (error) {
          switch (error.code) {
            case 'ENOENT':
              if (pathname.split('/').length > 1) {
                res.statusCode = 400;
                res.end('subfolders are not supported');
              } else {
                res.statusCode = 404;
                res.end('No such file');
              }
              break;
            default:
              res.statusCode = 500;
              res.end('something wrong');
          }
          return;
        }

        fs.unlink(filepath, (err) => {
          if (err) {
            res.statusCode = 500;
            res.end('something wrong');
            return;
          }
          res.statusCode = 200;
          res.end('its ok');
        });
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
