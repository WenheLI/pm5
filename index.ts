import chalk from 'chalk';
import ora from 'ora';
import { join } from 'path';
import { textPrompt, selectPrompt } from './lib/prompt';
import { clone, sed, cli } from './lib/subProcess';
import { p5Preset } from './lib/constants';
import * as pack from './package.json';

// function alias
const print = console.info;
const cwd = process.cwd();

async function run(): Promise<void> {
    print('');
    print('> Welcome to use', chalk.green('pm5'), 
        'a scaffold tool for', chalk.blue('p5'), 'and', chalk.blue('ml5'));
    print('');

    print('> Environment Check');
    print('> Version:', chalk.blue(pack.version));

    // TODO: CHECK SCRIPT LATEST VERSION
    print('> Latest:', chalk.blue(pack.version));
    print('');

    const name = await textPrompt('name', 'pm5-template', /^[a-z](-|[0-9]|[a-z])*([0-9]|[a-z])$/);
    const manager = await selectPrompt('manager', ['yarn', 'npm']);
    // const target = await selectPrompt('target', ['p5', 'ml5']);

    const cloneSpinner = ora('Cloning workspace from remote repo.').start();
    const cloneCode = await clone(join(cwd, name), p5Preset.P5REPO);
    if (cloneCode) {
        cloneSpinner.fail();
        throw Error('Fail to clone from remote repo.');
    }
    cloneSpinner.succeed();

    const nameSpinner = ora('Initializing workspace.').start();
    const nameCode = await sed(
        join(cwd, name, 'package.json'), p5Preset.P5NAME, name)
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
