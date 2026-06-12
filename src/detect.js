import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rules = [
  {
    markers: ['package.json'],
    stack: 'Node.js / TypeScript',
    commands: {
      test: 'npm test',
      build: 'npm run build',
      lint: 'npm run lint',
      typecheck: 'npm run typecheck'
    },
    refine(projectDir, result) {
      try {
        const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf8'));
        const scripts = pkg.scripts || {};
        result.commands.test = scripts.test ? 'npm test' : '# No npm test script configured';
        result.commands.build = scripts.build ? 'npm run build' : '# No npm build script configured';
        result.commands.lint = scripts.lint ? 'npm run lint' : '# No npm lint script configured';
        result.commands.typecheck = scripts.typecheck ? 'npm run typecheck' : '# No npm typecheck script configured';
      } catch {
        // Keep default commands.
      }
    }
  },
  {
    markers: ['pyproject.toml', 'requirements.txt', 'setup.py'],
    stack: 'Python',
    commands: {
      test: 'pytest',
      build: 'python -m build',
      lint: 'ruff check .',
      typecheck: 'mypy .'
    }
  },
  {
    markers: ['Package.swift'],
    stack: 'Swift Package',
    commands: {
      test: 'swift test',
      build: 'swift build',
      lint: 'swiftlint',
      typecheck: 'swift build'
    }
  },
  {
    markers: ['go.mod'],
    stack: 'Go',
    commands: {
      test: 'go test ./...',
      build: 'go build ./...',
      lint: 'golangci-lint run',
      typecheck: 'go vet ./...'
    }
  },
  {
    markers: ['Cargo.toml'],
    stack: 'Rust',
    commands: {
      test: 'cargo test',
      build: 'cargo build',
      lint: 'cargo clippy',
      typecheck: 'cargo check'
    }
  }
];

export function detectProject(projectDir) {
  const detected = [];

  for (const rule of rules) {
    if (rule.markers.some((marker) => existsSync(join(projectDir, marker)))) {
      const item = {
        stack: rule.stack,
        commands: { ...rule.commands }
      };
      rule.refine?.(projectDir, item);
      detected.push(item);
    }
  }

  if (detected.length === 0) {
    return {
      stack: 'Unknown',
      commands: {
        test: '# Configure TEST_COMMAND in docs_codexflow/.codexflow.json',
        build: '# Configure BUILD_COMMAND in docs_codexflow/.codexflow.json',
        lint: '# Configure LINT_COMMAND in docs_codexflow/.codexflow.json',
        typecheck: '# Configure TYPECHECK_COMMAND in docs_codexflow/.codexflow.json'
      }
    };
  }

  return {
    stack: detected.map((item) => item.stack).join(', '),
    commands: detected[0].commands
  };
}
