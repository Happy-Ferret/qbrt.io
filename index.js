const fs = require('mz/fs');
const server = require('spdy');
const express = require('express');
const morgan = require('morgan');

const publicDirName = 'public';

const app = express();
app.use(morgan(process.env.NODE_ENV === 'production' ? '' : 'dev'));
app.use(express.static(publicDirName));

const host = process.env.QBRT_HOST || process.env.HOST || '0.0.0.0';
const port = process.env.QBRT_PORT || process.env.PORT || 5000;
const tlsOptions = {
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
};

if (!module.parent) {
  server.createServer(tlsOptions, app).listen(port, host, err => {
    if (err) {
      throw err;
    }
    console.log(`Listening on https://${host}:${port}`);
  });
}

module.exports = server;

app.get('/home', (req, res) => {
  Promise.all([
    fs.readFile('public/examples/hello-world/index.html'),
  ]).then(files => {

    // Does the browser support HTTP/2 Server Push?
    if (res.push) {
        // The JS file.
        var squareRootStream = res.push('/js/squareRoot.js', {
            req: {'accept': '**/*'},
            res: {'content-type': 'application/javascript'}
        });

        squareRootStream.on('error', err => {
          console.log(err);
        });

        squareRootStream.end(files[1]);

        // The image.
        var randomNumberStream = res.push('/js/randomNumber.js', {
          req: {
            'accept': '**/*'
          },
          res: {
            'content-type': 'application/javascript'
          }
        });

        randomNumberStream.on('error', err => {
          console.log(err);
        });

        randomNumberStream.end(files[2]);
    }

    res.writeHead(200);
    res.end(files[0]);
  }).catch(err => {
    res.status(500).send(err.toString());
  });
});

spdy.createServer({
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.crt')
}, app)
.listen(8000, err => {
  if (err) {
    throw new Error(err);
  }
  console.log('Listening on port 8000');
});
