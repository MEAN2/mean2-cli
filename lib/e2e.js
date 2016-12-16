const ng = require('../helpers/ng');

function e2e() {
  return ng([ 'e2e' ], 'Running end to end tests...');
}

module.exports = e2e;
