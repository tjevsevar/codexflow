import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const packageRoot = resolve(__dirname, '..');
export const templatesRoot = resolve(packageRoot, 'templates');
