const ng = require('../helpers/ng');

function test() {
  return ng([ 'test' ], 'Running unit tests...');
}

module.exports = test;
