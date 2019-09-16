require('colors')

const args = require('args'),
      read = require('readline').createInterface({
          input: process.stdin,
          output: process.stdout
      })

args
  .option('name', 'Your Project Name', '')
  .option('target', 'Which project are you going to initialize. (p5, ml5)', '')
  .option('manager', 'Which package manager are you going to use. (yarn, npm)', '')
  .option('yes', 'Skep all prompts', false)

const f = args.parse(process.argv),
      y = f.yes

function readAsync(text) {
    return new Promise(resolve => {
        read.question(text, ans => {
            resolve(ans);
        });
    });
}

module.exports = async function prompt(name, choices) {
    let result = choices[0];
    const any = choices.indexOf('*') !== -1;
    const choice = !any
        ? choices.map(t => t.green).join('/')
        : '*'.green;
    if (f[name] === '') {
        if (!y) {
            result = (await readAsync(`> Please input the name [${choice}]: ` + `(default: ${choices[0]})`.red + '\n> '))
                     || choices[0];
        }
    } else {
        result = f[name];
    }
    result = result.trim();
    if (!any) {
        if (choices.indexOf(result) === -1) {
            console.error(`\n- Unrecognized choice for ${name}! Please choose from [${choice}].`);
            process.exit(1);
        }
    }
    console.info('✔'.green, 'Your choice is:', result.green);
    return result;
}