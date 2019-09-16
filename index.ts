// @ts-ignore
import chalk from 'chalk';
// @ts-ignore
import ora from 'ora';
import { join } from 'path';
import prompt from './lib/prompt';
import { clone, sed, cli } from './lib/subProcess';
import constants from './lib/constants';

const pack = require(join(__dirname, '../package.json')),
      print = console.info,
      cwd = process.cwd();

async function run() {
    print("");
    print("> Welcome to use", chalk.green("pm5"), "a scaffold tool for", chalk.blue("p5"), "and", chalk.blue("ml5"));
    print("");

    print("> Environment Check");
    print("> Version:", chalk.blue(pack.version));

    // TODO: CHECK SCRIPT LATEST VERSION
    print("> Latest:", chalk.blue(pack.version));
    print("");

    // target check
    // const target = await prompt('target', ['p5'])
    const name = await prompt('name', ['pm5-template', '*']);
    const manager = await prompt('manager', ['yarn', 'npm']);
    print('');

    const cloneSpinner = ora('Cloning workspace from remote repo.').start();
    const cloneCode = await clone(join(cwd, name), constants.P5REPO);
    if (cloneCode) {
        cloneSpinner.fail();
        throw Error('Fail to clone from remote repo.');
    }
    cloneSpinner.succeed();

    const nameSpinner = ora('Initializing workspace.').start()
    let nameCode = await sed(join(cwd, name, 'package.json'), constants.P5NAME, name)
        || await cli(join(cwd, name), 'rm -rf .git')
        || await cli(join(cwd, name), 'git init');
    if (nameCode) {
        nameSpinner.fail();
        throw Error('Fail to setup workspace.');
    }
    nameSpinner.succeed();

    const mgrSpinner = ora('Installing dependencies.').start();
    const mgrCode = await cli(join(cwd, name), manager === 'yarn' ? 'yarn install' : 'npm install');
    if (mgrCode) {
        mgrSpinner.fail();
        throw Error('Fail to install dependencies.');
    }
    mgrSpinner.succeed();

    print('\n' + '🎉 ' + chalk.green('Done.'));
}

run().then(() => {
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});