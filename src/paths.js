import { isAbsolute, resolve } from 'node:path';

export function assertSafeRelativePath(input, label) {
  if (!input || typeof input !== 'string') {
    throw new Error(`${label} is required`);
  }
  if (isAbsolute(input)) {
    throw new Error(`${label} must be relative to the repository root`);
  }
  const parts = input.split(/[\\/]+/).filter(Boolean);
  if (parts.includes('..')) {
    throw new Error(`${label} cannot contain ".."`);
  }
  return parts.join('/');
}

export function safeResolve(root, relativePath) {
  const target = resolve(root, relativePath);
  const rootWithSep = resolve(root) + '/';
  if (target !== resolve(root) && !target.startsWith(rootWithSep)) {
    throw new Error(`Refusing to write outside repository: ${relativePath}`);
  }
  return target;
}
