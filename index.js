require('colors')

const ora = require('ora'),
      pack = require('./package.json'),
      { join } = require('path'),
      prompt = require('./lib/prompt'),
      { clone, sed, cli } = require('./lib/sub_process'),
      constants = require('./lib/constants')

const print = console.info
const cwd = process.cwd()

async function run() {
    print("")
    print("> Welcome to use", "pm5".green, "a scaffold tool for", "p5".blue, "and", "ml5".blue);
    print("")

    print("> Environment Check")
    print("> Version:", pack.version.blue)

    // TODO: CHECK SCRIPT LATEST VERSION
    print("> Latest:", pack.version.blue)
    print("")

    // target check
    // const target = await prompt('target', ['p5'])
    const name = await prompt('name', ['pm5-template', '*'])
    const manager = await prompt('manager', ['yarn', 'npm'])
    print('')

    const cloneSpinner = ora('Cloning workspace from remote repo.').start()
    const cloneCode = await clone(join(cwd, name), constants.P5REPO)
    if (cloneCode) {
        cloneSpinner.fail();
        throw Error('Fail to clone from remote repo.')
    }
    cloneSpinner.succeed();

    const nameSpinner = ora('Initializing workspace.').start()
    let nameCode = await sed(join(cwd, name, 'package.json'), constants.P5NAME, name)
        || await cli(join(cwd, name), 'rm -rf .git')
        || await cli(join(cwd, name), 'git init')
    if (nameCode) {
        nameSpinner.fail();
        throw Error('Fail to setup workspace.')
    }
    nameSpinner.succeed();

    const mgrSpinner = ora('Installing dependencies.').start()
    const mgrCode = await cli(join(cwd, name), manager === 'yarn' ? 'yarn install' : 'npm install')
    if (mgrCode) {
        mgrSpinner.fail();
        throw Error('Fail to install dependencies.')
    }
    mgrSpinner.succeed();

    print('\n' + '🎉 ' + 'Done.'.green)
}

run().then(() => {
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
})