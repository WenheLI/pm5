import ora from 'ora';
import { AsyncFn } from './constants';

export async function spinner(message: string, fn: AsyncFn): Promise<void> {
    const currentSpinner = ora(message).start();
    try {
        await fn();
        currentSpinner.succeed();
    } catch(err) {
        currentSpinner.fail();
        throw err;
    }
}