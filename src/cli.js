import { Command } from 'commander';
import { init } from './commands/init.js';
import { update } from './commands/update.js';
import { verify } from './commands/verify.js';

export function runCli() {
  const program = new Command();

  program
    .name('codexflow')
    .description('Codex-native spec and session workflow')
    .version('0.1.0');

  program
    .command('init')
    .description('Initialize CodexFlow in the current repository')
    .option('-y, --yes', 'Accept safe defaults')
    .option('--mode <mode>', 'Project mode: adoption, greenfield, constrained')
    .option('--docs-path <path>', 'Documentation folder', 'docs_codexflow')
    .option('--hooks', 'Generate optional Codex lifecycle hooks')
    .option('--no-hooks', 'Do not generate lifecycle hooks')
    .option('--tracked-docs', 'Do not add docs folder to .gitignore')
    .option('--force', 'Overwrite generated CodexFlow files')
    .action(init);

  program
    .command('update')
    .description('Update generated skills and optional hooks from bundled templates')
    .option('--force', 'Skip confirmation')
    .action(update);

  program
    .command('verify')
    .description('Check CodexFlow files and configuration')
    .action(verify);

  program.parse();
}
