import { spawn } from 'child_process';
import * as fs from 'fs';
import {join} from 'path';
import * as _deepmerge from 'deepmerge';

const deepmerge = _deepmerge;

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

export function createFromTemplate(templatePath: string, projectName: string, language: string): void {
    const files = fs.readdirSync(templatePath);
    //TODO aysnc exec?
    files.forEach(file => {
        const origFilePath = join(templatePath, file);        
        const stats = fs.statSync(origFilePath);
            
        if (stats.isFile() && !(file === 'index.js' && language === 'ts')) {
            const contents = fs.readFileSync(origFilePath, 'utf8');
            const writePath = join(process.cwd(), projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            fs.mkdirSync(join(process.cwd(), projectName, file));
            createFromTemplate(join(templatePath, file), join(projectName, file), language);
        }
    });
}

export function mergeFromTemplate(templatePath: string, projectName: string): void {
    const files = fs.readdirSync(templatePath);
    //TODO aysnc exec?
    files.forEach(file => {
        const origFilePath = join(templatePath, file);        
        const stats = fs.statSync(origFilePath);
        if (stats.isFile()) {
            let contents = fs.readFileSync(origFilePath, 'utf8');
            if (fs.existsSync(join(process.cwd(), projectName, file))) {
                const oriContents = fs.readFileSync(join(process.cwd(), projectName, file), 'utf8');
                const contentsJson = JSON.parse(contents);
                const oriContentsJson = JSON.parse(oriContents);
                contents = JSON.stringify(deepmerge(contentsJson, oriContentsJson), null, 2);
            }
            const writePath = join(process.cwd(), projectName, file);
            fs.writeFileSync(writePath, contents, 'utf8');
        } else if (stats.isDirectory()) {
            if (!fs.existsSync(join(process.cwd(), projectName, file))) {
                fs.mkdirSync(join(process.cwd(), projectName, file));
            }
            mergeFromTemplate(join(templatePath, file), join(projectName, file));
        }
    });
}