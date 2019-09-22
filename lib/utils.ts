import * as fs from 'fs';

export function createProject(projectPath: string): boolean {
    if (fs.existsSync(projectPath)) {
        return false;
    }
    fs.mkdirSync(projectPath);
    
    return true;
}