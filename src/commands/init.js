import { confirm, input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { existsSync } from 'node:fs';
import { detectProject } from '../detect.js';
import { buildManifest } from '../manifest.js';
import { assertSafeRelativePath } from '../paths.js';
import { writeConfig } from '../config.js';
import { updateGitignore, writeRenderedFiles } from '../write.js';

export async function init(options) {
  const projectDir = process.cwd();
  const docsPath = assertSafeRelativePath(options.docsPath || 'docs_codexflow', 'docs path');
  const detection = detectProject(projectDir);

  console.log('');
  console.log(chalk.bold('CodexFlow Init'));
  console.log(chalk.dim('Codex-native specs, sessions, and Agent Skills'));
  console.log('');

  const config = options.yes
    ? defaults(projectDir, docsPath, detection, options)
    : await askQuestions(projectDir, docsPath, detection, options);

  console.log('');
  console.log(chalk.bold('Configuration'));
  console.log(chalk.dim('─'.repeat(40)));
  console.log(`  Project:       ${config.PROJECT_NAME}`);
  console.log(`  Mode:          ${config.PROJECT_MODE}`);
  console.log(`  Stack:         ${config.TECH_STACK}`);
  console.log(`  Docs path:     ${config.DOCS_PATH}`);
  console.log(`  Docs tracking: ${config.DOCS_GITIGNORED ? 'gitignored' : 'tracked'}`);
  console.log(`  Hooks:         ${config.ENABLE_HOOKS ? 'generated' : 'disabled'}`);
  console.log('');

  if (!options.yes) {
    const proceed = await confirm({ message: 'Create CodexFlow files?', default: true });
    if (!proceed) {
      console.log(chalk.dim('Cancelled.'));
      return;
    }
  }

  console.log('');
  console.log(chalk.bold('Generating files...'));
  console.log('');

  const manifest = buildManifest(config);
  writeRenderedFiles(projectDir, manifest, config, { overwrite: Boolean(options.force) });
  writeConfig(projectDir, config);
  console.log(chalk.green(`  create  ${config.DOCS_PATH}/.codexflow.json`));
  updateGitignore(projectDir, config.DOCS_PATH, config.DOCS_GITIGNORED);

  console.log('');
  console.log(chalk.bold.green('CodexFlow initialized.'));
  console.log('');
  console.log(chalk.bold('Next steps:'));
  console.log(`  1. Restart Codex or open a new thread in this repository.`);
  console.log(`  2. Ask Codex: ${chalk.cyan('Use $init-codexflow to populate the docs.')}`);
  console.log(`  3. Then use ${chalk.cyan('$plan-session')} for focused work planning.`);
  if (config.ENABLE_HOOKS) {
    console.log(`  4. Review hooks with ${chalk.cyan('/hooks')} before trusting them.`);
  }
  console.log('');
}

async function askQuestions(projectDir, docsPath, detection, options) {
  const config = defaults(projectDir, docsPath, detection, options);

  config.PROJECT_MODE = options.mode || await select({
    message: 'What type of project is this?',
    choices: [
      { name: 'Adoption - existing project', value: 'adoption' },
      { name: 'Greenfield - new project', value: 'greenfield' },
      { name: 'Constrained - fixed tech/process constraints', value: 'constrained' }
    ],
    default: config.PROJECT_MODE
  });

  config.PROJECT_NAME = await input({
    message: 'Project name:',
    default: config.PROJECT_NAME
  });

  config.PROJECT_DESCRIPTION = await input({
    message: 'Short project description:',
    default: config.PROJECT_DESCRIPTION
  });

  config.GIT_WORKFLOW = await select({
    message: 'Git workflow:',
    choices: [
      { name: 'Solo - local branches, direct merge', value: 'solo' },
      { name: 'PR review - push branch and open PR', value: 'pr-review' },
      { name: 'CI gated - PR/MR and pipeline owns merge', value: 'ci-gated' }
    ],
    default: config.GIT_WORKFLOW
  });

  config.DEFAULT_BRANCH = await input({
    message: 'Default branch:',
    default: config.DEFAULT_BRANCH
  });

  config.BRANCH_CONVENTION = await input({
    message: 'Branch convention:',
    default: config.BRANCH_CONVENTION
  });

  config.DOCS_GITIGNORED = !await confirm({
    message: 'Track CodexFlow docs in git?',
    default: !config.DOCS_GITIGNORED
  });

  const hooksDefault = Boolean(options.hooks);
  config.ENABLE_HOOKS = await confirm({
    message: 'Generate optional Codex hooks? Hooks are off by default and must be trusted in Codex.',
    default: hooksDefault
  });

  return config;
}

function defaults(projectDir, docsPath, detection, options) {
  const date = new Date().toISOString().slice(0, 10);
  const projectName = projectDir.split('/').filter(Boolean).pop() || 'project';
  const hooks = options.hooks === true ? true : false;
  const mode = options.mode || 'adoption';

  if (!['adoption', 'greenfield', 'constrained'].includes(mode)) {
    throw new Error(`Invalid mode "${mode}". Expected adoption, greenfield, or constrained.`);
  }

  return {
    CODEXFLOW_VERSION: '0.1.0',
    PROJECT_NAME: projectName,
    PROJECT_DESCRIPTION: '',
    PROJECT_MODE: mode,
    DATE: date,
    DOCS_PATH: docsPath,
    DOCS_GITIGNORED: !options.trackedDocs,
    ENABLE_HOOKS: hooks,
    TECH_STACK: detection.stack,
    TEST_COMMAND: detection.commands.test,
    BUILD_COMMAND: detection.commands.build,
    LINT_COMMAND: detection.commands.lint,
    TYPECHECK_COMMAND: detection.commands.typecheck,
    GIT_WORKFLOW: 'solo',
    DEFAULT_BRANCH: existsSync(`${projectDir}/.git`) ? 'main' : 'main',
    BRANCH_CONVENTION: 'codex/feature-name'
  };
}
