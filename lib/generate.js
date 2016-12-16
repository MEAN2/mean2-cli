const ng = require('../helpers/ng');

function generate(type, name) {
  return ng([ 'generate', type, name ]);
}

module.exports = generate;
