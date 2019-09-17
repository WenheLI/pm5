import { prompt as inquierPrompt } from 'inquirer';
import * as args from 'args';

args.option('name', 'Your Project Name', '')
    .option('target',
        'Which project are you going to initialize. (p5, ml5)', '')
    .option('manager',
        'Which package manager are you going to use. (yarn, npm)', '')
    .option('yes', 'Skip interaction.', false)

const f = args.parse(process.argv),
      y = f.yes;

export async function textPrompt(name: string, defaultValue: string, validation?: RegExp): Promise<string> {
    if (y || f[name]) {
        return f[name] || defaultValue;
    }
    const result = await inquierPrompt([{
        type: 'input',
        name,
        message: `Please input the ${name}`,
        default: defaultValue,
        validate: ans => {
            if (!validation) {
                return true;
            } else {
                if (ans.match(validation)) {
                    return true;
                } else {
                    return 'Input is not valid.';
                }
            }
        }
    }]);
    return `${result[name]}`;
}

export async function selectPrompt(name: string, choices: string[]): Promise<string> {
    if (y || f[name]) {
        return f[name] || choices[0];
    }
    const result = await inquierPrompt([{
        type: 'list',
        name,
        message: `Please select the ${name}`,
        choices
    }]);
    return `${result[name]}`;
}