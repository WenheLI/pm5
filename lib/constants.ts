export type PackageManager = 'yarn' | 'npm' | 'cnpm';
export type AsyncFn = () => Promise<void>;

export const p5Preset = {
    P5REPO: 'https://github.com/DaKoala/p5-TypeScript-boilerplate',
    P5NAME: 'pm5-project',
    SCRIPT: '{{script}}'
};
