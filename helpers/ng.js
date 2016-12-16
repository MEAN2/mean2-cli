const path = require('path');
const spawnPromise = require('./spawn-promise');

const pathToNg = path.resolve(__dirname + '/../node_modules/angular-cli/bin/ng');

function ng(args, message) {
  return spawnPromise(pathToNg, args, message);
}

module.exports = ng;
