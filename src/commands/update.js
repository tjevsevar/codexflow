import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { buildManifest } from '../manifest.js';
import { readConfig } from '../config.js';
import { writeRenderedFiles } from '../write.js';

export async function update(options) {
  const projectDir = process.cwd();
  const config = readConfig(projectDir);

  if (!config) {
    console.log(chalk.red('CodexFlow config not found. Run `codexflow init` first.'));
    process.exitCode = 1;
    return;
  }

  const manifest = buildManifest(config).filter((entry) => entry.generated);

  console.log('');
  console.log(chalk.bold('CodexFlow Update'));
  console.log(chalk.dim('Refresh generated skills and optional hooks. Docs are not overwritten.'));
  console.log(`Files to update: ${manifest.length}`);
  console.log('');

  if (!options.force) {
    const proceed = await confirm({
      message: 'Overwrite generated skills/hooks?',
      default: true
    });
    if (!proceed) {
      console.log(chalk.dim('Cancelled.'));
      return;
    }
  }

  writeRenderedFiles(projectDir, manifest, config, { overwrite: true });
  console.log('');
  console.log(chalk.bold.green('Update complete.'));
}
