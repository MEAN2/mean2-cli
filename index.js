#!/usr/bin/env node

const program = require('commander');
const clear = require('clear');
const figlet = require('figlet');

const packageJson = require('./package.json');

const newProject = require('./lib/new-project');
const e2e = require('./lib/e2e');
const test = require('./lib/test');
const generate = require('./lib/generate');
const serve = require('./lib/serve');

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
    .description('Creates a new Mean 2 project.')
    .command('new <project>')
    .action(newProject);

  program
    .description('Runs all end-to-end tests defined in your application, using protractor.')
    .command('e2e')
    .action(e2e);

  program
    .description('Run unittests, using karma.')
    .command('test')
    .action(test);

  program
    .description('Generate new code inside your project.')
    .command('generate <type> <name>')
    .alias('g')
    .action(generate);

  program
    .description('Run Angular 2 application with development server.')
    .command('serve')
    .action(serve);

  program
    .parse(process.argv);
}
