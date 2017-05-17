`'use strict';
const spawn = require('child_process').spawn;
const child = spawn('qbrt', `run ${mainURL}`.split(' '));
`