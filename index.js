#!/usr/bin/env node

const program = require('commander');
const clear = require('clear');
const figlet = require('figlet');

const packageJson = require('./package.json');
const newProject = require('./lib/new-project');

run();

function run() {
  let headerConfig = {
    font: 'small',
    horizontalLayout: 'default',
    certicalLayout: 'default'
  };

  figlet('MEAN 2', headerConfig, _onShowHeader);

  function _onShowHeader(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    clear();

    console.log(`${data}\n`);

    _parseCommands();
  }
}

function _parseCommands() {
  program
    .version(packageJson.version);

  program
    .description('Scaffold new project')
    .command('new <project>')
    .action(newProject);

  program.parse(process.argv);
}
