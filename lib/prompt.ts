// @ts-ignore
import chalk from 'chalk';
import * as args from 'args';
import { createInterface } from 'readline';

const read = createInterface({
    input: process.stdin,
    output: process.stdout
});

args.option('name', 'Your Project Name', '')
    .option('target',
        'Which project are you going to initialize. (p5, ml5)', '')
    .option('manager',
        'Which package manager are you going to use. (yarn, npm)', '');

const f = args.parse(process.argv),
      y = f.yes;

function readAsync(text: string): Promise<string> {
    return new Promise(resolve => {
        read.question(text, (ans: string) => {
            resolve(ans);
        });
    });
}

export async function prompt(name: string, choices: string[]) {
    let result = choices[0];
    const anyone = choices.indexOf('*') !== -1;
    const choice = !anyone
        ? choices.map(t => chalk.green(t)).join('/')
        : chalk.green('*');
    if (f[name] === '') {
        if (!y) {
            result = (await readAsync(`> Please input the name [${choice}]: ` 
                    + chalk.red(`(default: ${choices[0]})`) + '\n> '))
                        || choices[0];
        }
    } else {
        result = f[name];
    }
    result = result.trim();
    if (!anyone) {
        if (choices.indexOf(result) === -1) {
            console.error(`\n- Unrecognized choice for ${name}! Please choose from [${choice}].`);
            process.exit(1);
        }
    }
    console.info(chalk.green('✔'), 'Your choice is:', chalk.green(result));
    return result;
}