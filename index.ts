import chalk from 'chalk';
import ora from 'ora';
import { join } from 'path';
import { textPrompt, selectPrompt } from './lib/prompt';
import { sed, cli, createFromTemplate, mergeFromTemplate } from './lib/subProcess';
import { p5Preset, PackageManager } from './lib/constants';
import * as pack from './package.json';
import { createProject, installDeps } from './lib/utils';

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
    const manager = (await selectPrompt('manager', ['npm', 'yarn', 'cnpm'])) as PackageManager;
    const language = await selectPrompt('programming language', ['js', 'ts']);
    // const target = await selectPrompt('target', ['p5', 'ml5']);

    const createSpinner = ora('Creating Project...').start();

    // TODO: optimizatoin for logic?
    const project = createProject(name);
    if (!project) {
        createSpinner.fail();
        print(chalk.red(`Folder ${name} exists. Delete or use another name.`));
        throw Error('Fail to create Project.');
    }
    createSpinner.succeed();

    const nameSpinner = ora('Initializing workspace.').start();
    
    // template for js
    createFromTemplate(join(`${__dirname}`, 'templates', 'template-base') ,name, language);
    await sed(
        join(cwd, name, 'src/index.html'), p5Preset.SCRIPT, `./index.${language}`
    );
    if (language === 'ts') {
        mergeFromTemplate(join(`${__dirname}`, 'templates', 'template-typescript'), name);
    }
    
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
    const mgrCode = await cli(join(cwd, name), installDeps(manager));
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
