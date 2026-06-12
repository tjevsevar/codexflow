# Installing CodexFlow

## Local Install

From this repository:

```bash
npm install
npm link
```

Then in a target project:

```bash
cd your-project
codexflow init
```

## One-Off Local Run

```bash
cd your-project
node /absolute/path/to/codexflow/bin/codexflow.js init
```

## Recommended Codex Setup

1. Run `codexflow init`.
2. Keep hooks disabled on the first run.
3. Restart Codex or open a new thread from the target repository.
4. Ask Codex to use `$init-codexflow`.
5. Run `codexflow verify` after the docs are populated.

## Enabling Hooks Later

Hooks are optional. To generate them after initial setup, edit `docs_codexflow/.codexflow.json`:

```json
"ENABLE_HOOKS": true
```

Then run:

```bash
codexflow update
```

Then open Codex and review them:

```text
/hooks
```

Do not trust hooks you have not read.

## Uninstall

Remove generated files from the target project:

```bash
rm -rf .agents/skills/init-codexflow \
       .agents/skills/plan-session \
       .agents/skills/start-session \
       .agents/skills/end-session \
       .agents/skills/new-feature \
       .agents/skills/verify-codexflow \
       docs_codexflow
```

If you generated hooks, also remove:

```bash
rm -rf .codex/hooks/protect-docs.js \
       .codex/hooks/session-snapshot.js
```

Edit `AGENTS.md` manually if you want to remove the CodexFlow section.
