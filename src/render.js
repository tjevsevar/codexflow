import { readFileSync } from 'node:fs';

export function renderString(source, context) {
  return source.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_match, key) => {
    const value = context[key];
    return value == null ? '' : String(value);
  });
}

export function renderFile(filePath, context) {
  return renderString(readFileSync(filePath, 'utf8'), context);
}
