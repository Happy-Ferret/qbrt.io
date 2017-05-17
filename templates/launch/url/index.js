'use strict';

const path = require('path');

const spawn = require('child_process').spawn;

const child = spawn(path.join(__dirname, 'node_modules', '.bin', 'qbrt'), `run ${url}`.split(' '));
