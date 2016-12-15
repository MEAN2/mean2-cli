const path = require('path');
const fs = require('fs-promise');

const spawnPromise = require('../helpers/spawn-promise');

const ng = path.resolve(__dirname + '/../node_modules/angular-cli/bin/ng');

function newProject(project) {
  _scaffoldNg(project)
    .then(_mergeMean2)
    .then(_updatePackageJson)
    // .then(_runNpmInstall)
    .catch(_onError);
}

function _scaffoldNg(project) {
  return new Promise((resolve, reject) => {
    spawnPromise(ng, [ 'new', project, '--skip-npm' ], 'Scaffolding Angular 2 app...')
      .then(() => resolve(project), reject);
  });
}

function _mergeMean2(project) {
  return Promise.resolve(project);
}

function _updatePackageJson(project) {
  process.chdir(project);

  let pathToPackageJson = process.cwd() + '/package.json',
      package = require(pathToPackageJson);

  package.scripts['serve:ng'] = 'ng serve';
  package.scripts['serve:express'] = 'node server.js';
  package.scripts['start'] = 'npm-run-all --parallel serve:*';

  return fs.writeFile(pathToPackageJson, JSON.stringify(package, null, 2));
}

function _runNpmInstall() {
  return spawnPromise('npm', [ 'install' ], '')
  return Promise.resolve();
}

function _onError(err) {
  console.log(err);
}
 
module.exports = newProject;
