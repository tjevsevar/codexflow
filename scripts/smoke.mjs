import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const bin = join(root, 'bin/codexflow.js');
const dir = mkdtempSync(join(tmpdir(), 'codexflow-smoke-'));

try {
  run('git', ['init'], dir);
  run('node', [bin, 'init', '--yes', '--hooks'], dir);
  run('node', [bin, 'verify'], dir);
  run('node', ['--check', '.codex/hooks/protect-docs.js'], dir);
  run('node', ['--check', '.codex/hooks/session-snapshot.js'], dir);

  const required = [
    'AGENTS.md',
    '.agents/skills/init-codexflow/SKILL.md',
    '.agents/skills/plan-session/SKILL.md',
    'docs_codexflow/.codexflow.json',
    '.codex/hooks.json'
  ];

  for (const file of required) {
    if (!existsSync(join(dir, file))) {
      throw new Error(`Missing expected file: ${file}`);
    }
  }

  console.log('Smoke test passed.');
} finally {
  rmSync(dir, { recursive: true, force: true });
}

function run(cmd, args, cwd) {
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`${cmd} ${args.join(' ')} failed with ${result.status}`);
  }
}
