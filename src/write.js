import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import chalk from 'chalk';
import { templatesRoot } from './context.js';
import { renderFile } from './render.js';
import { safeResolve } from './paths.js';

export function writeRenderedFiles(projectDir, manifest, context, options = {}) {
  const created = [];
  const skipped = [];
  const updated = [];

  for (const entry of manifest) {
    const templatePath = resolve(templatesRoot, entry.template);
    const outputPath = safeResolve(projectDir, entry.output);

    if (existsSync(outputPath) && !options.overwrite) {
      skipped.push(entry.output);
      console.log(chalk.yellow(`  skip    ${entry.output}`));
      continue;
    }

    const content = renderFile(templatePath, context);
    const existed = existsSync(outputPath);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, content, 'utf8');

    if (existed) {
      updated.push(entry.output);
      console.log(chalk.blue(`  update  ${entry.output}`));
    } else {
      created.push(entry.output);
      console.log(chalk.green(`  create  ${entry.output}`));
    }
  }

  return { created, skipped, updated };
}

export function updateGitignore(projectDir, docsPath, enabled) {
  if (!enabled) return false;

  const gitignorePath = safeResolve(projectDir, '.gitignore');
  let content = '';
  if (existsSync(gitignorePath)) {
    content = readFileSync(gitignorePath, 'utf8');
  }

  const line = `${docsPath}/`;
  if (content.split(/\r?\n/).includes(line)) return false;

  const addition = `${content.endsWith('\n') || content.length === 0 ? '' : '\n'}\n# CodexFlow personal planning docs\n${line}\n`;
  writeFileSync(gitignorePath, content + addition, 'utf8');
  console.log(chalk.green(`  update  .gitignore (added ${line})`));
  return true;
}
