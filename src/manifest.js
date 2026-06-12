export function buildManifest(config) {
  const docs = config.DOCS_PATH;
  const files = [
    { template: 'AGENTS.md.template', output: 'AGENTS.md', generated: false },
    { template: 'docs/CONFIG.md.template', output: `${docs}/CONFIG.md`, generated: false },
    { template: 'docs/ROADMAP.md.template', output: `${docs}/ROADMAP.md`, generated: false },
    { template: 'docs/SESSION_LOG.md.template', output: `${docs}/SESSION_LOG.md`, generated: false },
    { template: 'docs/OVERVIEW.md.template', output: `${docs}/OVERVIEW.md`, generated: false },
    { template: 'docs/ADR.md.template', output: `${docs}/ADR.md`, generated: false },
    { template: 'docs/LEARNED_PATTERNS.md.template', output: `${docs}/LEARNED_PATTERNS.md`, generated: false },
    { template: 'docs/CUSTOM.md.template', output: `${docs}/CUSTOM.md`, generated: false },
    { template: 'docs/FEATURE_SPEC.md.template', output: `${docs}/feature_docs/example-feature/SPEC.md`, generated: false },
    { template: 'skills/init-codexflow.md.template', output: '.agents/skills/init-codexflow/SKILL.md', generated: true },
    { template: 'skills/plan-session.md.template', output: '.agents/skills/plan-session/SKILL.md', generated: true },
    { template: 'skills/start-session.md.template', output: '.agents/skills/start-session/SKILL.md', generated: true },
    { template: 'skills/checkpoint-session.md.template', output: '.agents/skills/checkpoint-session/SKILL.md', generated: true },
    { template: 'skills/end-session.md.template', output: '.agents/skills/end-session/SKILL.md', generated: true },
    { template: 'skills/new-feature.md.template', output: '.agents/skills/new-feature/SKILL.md', generated: true },
    { template: 'skills/verify-codexflow.md.template', output: '.agents/skills/verify-codexflow/SKILL.md', generated: true }
  ];

  if (config.ENABLE_HOOKS) {
    files.push(
      { template: 'hooks/protect-docs.js.template', output: '.codex/hooks/protect-docs.js', generated: true },
      { template: 'hooks/session-snapshot.js.template', output: '.codex/hooks/session-snapshot.js', generated: true },
      { template: 'config/hooks.json.template', output: '.codex/hooks.json', generated: true }
    );
  }

  return files;
}
