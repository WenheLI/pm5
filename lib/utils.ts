import * as fs from 'fs';
import { PackageManager } from './constants';

export function createProject(projectPath: string): boolean {
    if (fs.existsSync(projectPath)) {
        return false;
    }
    fs.mkdirSync(projectPath);
    
    return true;
}

export function installDeps(manager: PackageManager): string {
    if (manager === 'yarn') {
        return 'yarn install';
    }
    if (manager === 'npm') {
        return 'npm install';
    }
    if (manager === 'cnpm') {
        return 'cnpm install';
    }
}
