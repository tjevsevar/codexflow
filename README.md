# CodexFlow

**A Codex-native workflow layer for projects that need memory, plans, and feature specs across coding sessions.**

Codex is strongest when it has the right project context. CodexFlow gives every repository a lightweight operating system for Codex: persistent guidance, reusable Agent Skills, a roadmap, session logs, architecture notes, ADRs, learned patterns, and feature specs.

It is inspired by [Jure's SpecFlow](https://github.com/jurebordon/specflow) and its AI guardrails. Thanks to Jure for the original idea; CodexFlow rebuilds the workflow for Codex surfaces instead of Claude-specific files.

## Why CodexFlow?

Most AI coding sessions start the same way: Codex has to rediscover the project, infer what matters, guess what was done last time, and decide what to do next from the current chat. That works for small edits, but it gets noisy fast on real projects.

CodexFlow turns that implicit context into files Codex can read every time.

| Problem | CodexFlow answer |
| --- | --- |
| "Codex keeps rediscovering my repo." | `AGENTS.md` points Codex at the important project docs and commands. |
| "Every new thread loses what happened last time." | `SESSION_LOG.md` captures completed work, decisions, checks, and next steps. |
| "I don't know what to ask Codex next." | `ROADMAP.md` keeps feature-tagged tasks in Now/Next/Later. |
| "The architecture drifts as Codex builds." | `ADR.md` and `OVERVIEW.md` preserve durable decisions and system reality. |
| "Feature requirements get fuzzy during implementation." | `feature_docs/<feature>/SPEC.md` gives each feature a concrete target. |
| "I repeat the same workflow prompts." | `.agents/skills` gives Codex reusable workflows like `$plan-session` and `$end-session`. |

## What You Get

- **Codex-native**: Generates `AGENTS.md`, `.agents/skills`, and optional `.codex/hooks.json`.
- **Works with existing and fresh projects**: Adoption mode for current repos; greenfield mode for shaping a new app before code exists.
- **Session continuity**: Every session can leave behind useful project memory instead of relying on one long chat.
- **Feature-first workflow**: Tasks are tagged by feature, so Codex can plan and implement one coherent slice at a time.
- **No app runtime dependency**: CodexFlow does not become part of your application.
- **Safer defaults**: Hooks are off by default, no auto-format hook, no postinstall script, no auto commit/push/merge behavior.
- **Small and inspectable**: The generator is a simple Node CLI with templates.

## What Gets Created

```text
your-project/
├── AGENTS.md
├── .agents/
│   └── skills/
│       ├── init-codexflow/
│       ├── plan-session/
│       ├── start-session/
│       ├── end-session/
│       ├── new-feature/
│       └── verify-codexflow/
├── docs_codexflow/
│   ├── .codexflow.json
│   ├── CONFIG.md
│   ├── ROADMAP.md
│   ├── SESSION_LOG.md
│   ├── OVERVIEW.md
│   ├── ADR.md
│   ├── LEARNED_PATTERNS.md
│   ├── CUSTOM.md
│   └── feature_docs/
└── .codex/                 # optional, only if hooks are enabled
    ├── hooks.json
    └── hooks/
```

## How It Works

CodexFlow uses Codex's existing customization surfaces:

- **`AGENTS.md`**: Persistent repository guidance Codex reads at startup.
- **`.agents/skills`**: Repo-scoped Agent Skills Codex can invoke with `$skill-name`.
- **`docs_codexflow/`**: Project memory and planning docs.
- **`.codex/hooks.json`**: Optional lifecycle hooks, generated only when requested.

The typical loop:

```text
1. codexflow init
2. Start Codex in the repo
3. Use $init-codexflow to populate project docs
4. Use $new-feature to define a feature
5. Use $plan-session to plan one focused task
6. Let Codex implement
7. Use $end-session to verify and update project memory
```

## Existing Repo Example

You have a SwiftUI weather app and want to add favorite locations.

Without CodexFlow, you might start every thread by re-explaining the app, the current architecture, what was done yesterday, and which files matter.

With CodexFlow:

1. Run `$new-feature`.
2. Codex creates `docs_codexflow/feature_docs/favorite-locations/SPEC.md`.
3. Codex adds roadmap tasks like:

```markdown
- [ ] Add favorite persistence [feature: favorite-locations]
- [ ] Add favorite toggle UI [feature: favorite-locations]
- [ ] Add tests for favorite locations [feature: favorite-locations]
```

4. In a later thread, run `$plan-session`.
5. Codex reads the roadmap, session log, feature spec, and project context before planning.
6. `$end-session` records what changed, which checks ran, and what remains.

The next thread starts with useful memory instead of a blank slate.

## Fresh Project Example

Start with an empty repository:

```bash
mkdir meal-planner
cd meal-planner
git init
codexflow init --mode greenfield
```

Then ask Codex:

```text
Use $init-codexflow. I want to build a meal-planning iOS app for families.
```

CodexFlow gives Codex a structured place to define:

- product purpose
- first user journeys
- architecture decisions
- MVP feature specs
- first implementation tasks
- verification commands

This reduces early "vibe-coded drift" by making Codex plan from a lightweight product and technical record before generating lots of code.

## Install

Until this package is published to npm, install from source:

```bash
git clone https://github.com/tjevsevar/codexflow.git
cd codexflow
npm install
npm link
```

Then initialize a project:

```bash
cd /path/to/your-project
codexflow init
```

Recommended first-run choices:

- existing repo: `adoption`
- new repo: `greenfield`
- docs: gitignored unless your team wants shared planning docs
- hooks: disabled initially

## CLI

```bash
codexflow init
codexflow init --yes
codexflow init --mode greenfield --no-hooks
codexflow init --hooks
codexflow update
codexflow verify
```

`update` refreshes generated skills and optional hooks only. It does not overwrite your project docs.

## Using It In Codex

After running `codexflow init`, restart Codex or open a new thread in that repository.

Useful prompts:

```text
Use $init-codexflow to populate the project docs.
```

```text
Use $new-feature to define account deletion.
```

```text
Use $plan-session and pick the next task from the roadmap.
```

```text
Use $end-session to verify the work and update the session log.
```

You can also open `/skills` in Codex and select the generated skills.

## Optional Hooks

Hooks are off by default. To generate them:

```bash
codexflow init --hooks
```

or set `"ENABLE_HOOKS": true` in `docs_codexflow/.codexflow.json` and run:

```bash
codexflow update
```

Then review them in Codex:

```text
/hooks
```

Do not trust hooks you have not read. The generated hooks are intentionally narrow:

- protect durable docs from accidental edits
- write a session snapshot on stop

There is no auto-formatter hook and no hook that pushes code.

## Safety Model

CodexFlow intentionally avoids:

- postinstall scripts
- hidden network calls
- auto commit, push, merge, or PR creation
- auto-format hooks that shell-concatenate paths
- modifying your app dependencies
- becoming part of your production runtime

Generated files are plain text and JavaScript templates you can inspect before using.

## Development

```bash
npm install
npm run check
npm run smoke
npm audit --omit=dev
```

## Status

CodexFlow is early. The current goal is a small, safe, inspectable workflow generator for personal and team Codex projects.

Planned improvements:

- better command detection from existing docs
- optional npm publishing
- richer greenfield interview flow
- project-specific custom skill generation

## License

MIT
