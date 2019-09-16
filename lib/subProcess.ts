import { spawn } from 'child_process';
import * as fs from 'fs';

export function clone(path: string, url: string): Promise<string> {
    return new Promise((resolve): void => {
        const child = spawn('git', ['clone', url, path]);
        child.on('exit', resolve);
    });
}

export async function sed(path: string, from: string | RegExp, to: string): Promise<number> {
    if (fs.existsSync(path) && fs.statSync(path).isFile()) {
        const d = fs.readFileSync(path).toString();
        fs.writeFileSync(path, d.replace(from, to));
        return 0;
    } else {
        return 1;
    }
}

export function cli(cwd: string, cmd: string): Promise<string> {
    const args = cmd.split(' ');
    const f = args.shift();
    return new Promise((resolve): void => {
        const child = spawn(f, args, { cwd });
        child.on('exit', resolve);
    });
}