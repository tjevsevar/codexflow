import { existsSync, readFileSync } from 'node:fs';
import chalk from 'chalk';
import { buildManifest } from '../manifest.js';
import { readConfig } from '../config.js';
import { safeResolve } from '../paths.js';

export async function verify() {
  const projectDir = process.cwd();
  const config = readConfig(projectDir);

  if (!config) {
    console.log(chalk.red('CodexFlow config not found.'));
    console.log('Run `codexflow init` from the repository root.');
    process.exitCode = 1;
    return;
  }

  const required = buildManifest(config);
  const missing = [];

  for (const entry of required) {
    if (!existsSync(safeResolve(projectDir, entry.output))) {
      missing.push(entry.output);
    }
  }

  const warnings = [];
  const roadmap = safeRead(projectDir, `${config.DOCS_PATH}/ROADMAP.md`);
  if (roadmap && !/\[feature:\s*[-a-z0-9_ ]+\]/i.test(roadmap)) {
    warnings.push('ROADMAP.md has no [feature: name] tags.');
  }

  const agents = safeRead(projectDir, 'AGENTS.md');
  if (agents && !agents.includes(config.DOCS_PATH)) {
    warnings.push(`AGENTS.md does not reference ${config.DOCS_PATH}.`);
  }

  console.log('');
  console.log(chalk.bold('CodexFlow Verification'));
  console.log(chalk.dim('─'.repeat(40)));
  console.log(`Project: ${config.PROJECT_NAME}`);
  console.log(`Docs:    ${config.DOCS_PATH}`);
  console.log(`Hooks:   ${config.ENABLE_HOOKS ? 'enabled' : 'disabled'}`);
  console.log('');

  if (missing.length === 0) {
    console.log(chalk.green('Files:   OK'));
  } else {
    console.log(chalk.red(`Files:   ${missing.length} missing`));
    for (const file of missing) console.log(`  - ${file}`);
  }

  if (warnings.length === 0) {
    console.log(chalk.green('Checks:  OK'));
  } else {
    console.log(chalk.yellow(`Checks:  ${warnings.length} warning(s)`));
    for (const warning of warnings) console.log(`  - ${warning}`);
  }

  console.log('');
  if (missing.length > 0) process.exitCode = 1;
}

function safeRead(projectDir, relativePath) {
  try {
    return readFileSync(safeResolve(projectDir, relativePath), 'utf8');
  } catch {
    return null;
  }
}
