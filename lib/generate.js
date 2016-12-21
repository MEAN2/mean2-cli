const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const ng = require('../helpers/ng');

const templateFolder = path.resolve(__dirname, '../templates');

function generate(type, name, value) {
  switch(type.toLowerCase()) {
    case 'api':
      generateApiAsset(arguments);
      break;

    default:
      generateClientAsset(type, name);
  }
}

function generateApiAsset(params) {
  let { 1: type, 2: name } = params;

  if (!name) {
    name = type;
    type = 'api';
  }

  switch (type) {
    case 'controller':
      _generateApiController(name);
      break;

    case 'model':
      _generateApiModel(name);
      break;

    case 'api':
      _generateApiController(name);
      _generateApiModel(name);
      break;

    default:
      throw new Error(type + ' not a valid api generator type');
  }
} 

function generateClientAsset(type, name) {
  return ng([ 'generate', type, name ]);
}

function _generateApiController(name) {
  let data = {
    filename: ucfirst(name) + 'Controller',
    name: ucfirst(name)
  };

  _generate('controller', data);
}

function _generateApiModel(name) {
  let data = {
    filename: ucfirst(name),
    name: ucfirst(name)
  };

  _generate('model', data);
}

function _generate(type, data) {
  let templateFile = path.resolve(templateFolder, 'api', `${type}.ejs`),
      outputFile = path.resolve(process.cwd(), 'api', `${type}s`, `${data.filename}.js`);

  ejs.renderFile(templateFile, data, (err, str) => {
    if (err) {
      throw new Error(err);
    }

    fs.writeFile(outputFile, str, 'utf8', err => {
      if (err) {
        throw new Error(err);
      }

      console.log(`${outputFile} generated!`);
    });
  });
}

function ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = generate;
