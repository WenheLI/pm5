const { spawn } = require('child_process'),
      fs = require('fs')

function clone(path, url) {
    return new Promise(resolve => {
        const child = spawn('git', ['clone', url, path])
        child.on('exit', resolve)
    })
}

async function sed(path, from, to) {
    if (fs.existsSync(path) && fs.statSync(path).isFile()) {
        const d = fs.readFileSync(path).toString()
        fs.writeFileSync(path, d.replace(from, to))
        return 0;
    } else {
        return 1;
    }
}

function cli(cwd, cmd) {
    const args = cmd.split(' ')
    const f = args.shift()
    return new Promise(resolve => {
        const child = spawn(f, args, { cwd })
        child.on('exit', resolve)
    })
}

module.exports = {
    clone,
    sed,
    cli
} 