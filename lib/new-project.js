const os = require('os');
const path = require('path');
const fs = require('fs-promise');
const request = require('request-promise');
const AdmZip = require('adm-zip');
const mergedirs = require('merge-dirs');

const ng = require('../helpers/ng');
const spawnPromise = require('../helpers/spawn-promise');

function newProject(project) {
  _scaffoldNg(project)
    .then(_mergeMean2)
    .then(_updatePackageJson)
    .then(_runNpmInstall)
    .catch(_onError);
}

function _scaffoldNg(project) {
  return new Promise((resolve, reject) => {
    ng([ 'new', project, '--skip-npm', '--style=sass' ], 'Scaffolding Angular 2 app...')
      .then(() => resolve(project), reject);
  });
}

function _mergeMean2(project) {
  return new Promise((resolve, reject) => {
    let tmpFolder = os.tmpdir(),
        tempZipFilePath = path.join(tmpFolder, 'mean2-' + new Date().getTime() + '.zip'),
        requestOptions, topLevelDir, entries, zip;

    console.log('Merging API...');

    // set request options
    requestOptions = {
      url: 'https://github.com/MEAN2/seed/archive/master.zip', 
      rejectUnauthorized: false, 
      encoding: null
    };

    // cd to project folder
    process.chdir(project);

    request(requestOptions)
      .then(archive => {
        try {
          fs.writeFileSync(tempZipFilePath, archive);

          zip = new AdmZip(tempZipFilePath);
          zip.extractAllTo(tmpFolder);

          entries = zip.getEntries();

          for (let e in entries) {
            if (entries[e].isDirectory) {
              topLevelDir = entries[e].entryName;
              break;
            }
          }

          mergedirs.default(path.join(tmpFolder, topLevelDir), process.cwd());

          resolve(project);
        } catch (e) {
          reject(e);
        }
      }, reject);
  });
}

function _updatePackageJson(project) {
  let pathToPackageJson = process.cwd() + '/package.json',
      package = require(pathToPackageJson);

  console.log('Updating package.json...');

  // update scripts
  package.scripts['serve:ng'] = 'mean2 serve';
  package.scripts['serve:express'] = 'node server.js';
  package.scripts['start'] = 'npm-run-all --parallel serve:*';

  // add extra packages
  package.devDependencies['npm-run-all'] = '^3.1.2';

  return fs.writeFile(pathToPackageJson, JSON.stringify(package, null, 2));
}

function _runNpmInstall() {
  return spawnPromise('npm', [ 'install' ], 'Installing NPM Packages...');
}

function _onError(err) {
  console.log(err);
}
 
module.exports = newProject;
