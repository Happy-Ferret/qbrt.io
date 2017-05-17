#!/usr/bin/env node

const crypto = require('crypto');
const http = require('http');
const path = require('path');
const exec = require('child_process').exec;
const urlParse = require('url').parse;

const fetchManifest = require('fetch-manifest');
const fs = require('fs-extra');
const merge = require('lodash.merge');
const static = require('node-static');

const rootDir = path.join(__dirname, 'public');

const host = process.env.QBRT_HOST || process.env.HOST || '0.0.0.0';
const port = process.env.QBRT_PORT || process.env.PORT || 8000;
const releasesDir = path.join(rootDir, '.releases');
const releasesTempDir = path.join(__dirname, '.tmp-releases');
const templatesDir = path.join(__dirname, 'templates');

try {
  fs.mkdirSync(releasesDir);
} catch (e) {
}
try {
  fs.mkdirSync(releasesTempDir);
} catch (e) {
}

const staticServer = new static.Server(rootDir, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
});

const server = http.createServer((req, res) => {
  const reqPathname = urlParse(req.url).pathname;

  // Example URL formats:
  // - http://example.com/
  // - https://aframe.io/
  // - https://aframe.io/aframe/examples/showcase/spheres-and-fog/
  // - webvr.rocks
  // - https://webvr.rocks/firefox
  let appUrl = req.url.substr(req.url.indexOf('?') + 1);

  // Remove leading slashes.
  appUrl = appUrl.replace(/^\/+/g, '');

  if (!appUrl.startsWith('http://') || !appUrl.startsWith('https://')) {
    appUrl = `https://${appUrl}`;
  }

  if (!appUrl || reqPathname.split('/') < 3) {
    staticServer.serve(req, res);
    return;
  }

  const hash = crypto.createHash('sha1').update(appUrl).digest('hex');

  const hashPath = hash;
  const hashUrl = '/.releases/' + hashPath;
  const releaseFn = path.join(releasesDir, hash);
  let releaseServed = false;

  fs.stat(releaseFn, function (err, stats) {
    if (!err && stats.isFile()) {
      releaseServed = true;
      req.url = hashUrl;
      // Read and serve package.
      staticServer.serve(req, res);
    }

    // Build package.
    const releaseTempDir = path.join(releasesTempDir, hash);
    let appManifest = {};
    fetchManifest.fetchManifest(appUrl).then(manifest => {
      return fs.readJson(path.join(templatesDir, 'launch', 'url', 'package.json')).then(packageObj => {
        appManifest = merge(manifest, packageObj, {
          name: (manifest.name || manifest.short_name).replace(/ /g, '').toLowerCase()
        });
      });
    }).then(() => {
      try {
        fs.mkdirSync(releaseTempDir);
      } catch (e) {
      }

      return fs.writeJson(path.join(releaseTempDir, 'package.json'), appManifest, {flags: 'w'});
    }).then(() => {
      return fs.readFile(path.join(templatesDir, 'launch', 'url', 'index.js')).then(indexFileText => {
        indexFileText = indexFileText.toString().replace(/\$?{?{\s*url\s*}}?/gi, appUrl);
        return indexFileText;
      });
    }).then(indexFileText => {
      return fs.writeFile(path.join(releaseTempDir, 'index.js'), indexFileText, {flags: 'w'});
    }).then(new Promise((resolve, reject) => {
      const child = exec(path.join(__dirname, 'node_modules', '.bin', 'pkg') + ' ' + path.join(releaseTempDir, 'index.js'));

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', data => {
        const output = data.toString('utf8');
        stdout += output;
        console.log(output.trim());
      });

      child.stderr.on('data', data => {
        const output = data.toString('utf8');
        stderr += output;
        console.error(ouput.trim());
      });

      child.on('exit', (code, signal) => {
        console.log('exit', code, signal);
      });

      child.on('close', (code, signal) => {
        console.log('close', code, signal);
        if (stderr) {
          reject(new Error(stderr.trim()));
        } else {
          resolve(stdout.trim());
        }
      });
    })).then(pkgStdout => {
      // TODO: Write releases to `releasesDir`.
    }).then(() => {
      releaseServed = true;
      req.url = hashUrl;
      // Serve generated package.
      staticServer.serve(req, res);
    });
  });
}).listen(port, host, function () {
  console.log(`Listening on http://${host}:${port}`);
});
