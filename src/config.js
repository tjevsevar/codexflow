import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { safeResolve } from './paths.js';

export const configFileName = '.codexflow.json';

export function configPath(projectDir, docsPath) {
  return safeResolve(projectDir, `${docsPath}/${configFileName}`);
}

export function writeConfig(projectDir, config) {
  const target = configPath(projectDir, config.DOCS_PATH);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

export function findConfig(projectDir) {
  const candidates = ['docs_codexflow', 'docs_specflow', 'docs'];
  for (const docs of candidates) {
    const target = configPath(projectDir, docs);
    if (existsSync(target)) return target;
  }
  return null;
}

export function readConfig(projectDir) {
  const target = findConfig(projectDir);
  if (!target) return null;
  return JSON.parse(readFileSync(target, 'utf8'));
}
