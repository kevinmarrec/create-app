# CLAUDE.md

## Project Overview

`@kevinmarrec/create-app` — CLI that scaffolds an opinionated Bun & Vue fullstack application.
Invoked via `bun create @kevinmarrec/app` or `bunx @kevinmarrec/create-app`.

## Tech Stack

- **Runtime**: Bun (v1.3.10+)
- **Language**: TypeScript (ES modules)
- **Build**: tsdown → `dist/index.mjs`
- **Test**: Vitest with v8 coverage
- **Lint**: ESLint (@antfu config), Stylelint, Knip (unused exports)
- **Types**: vue-tsc --noEmit

## Key Dependencies

- `@clack/prompts` — CLI prompts (intro, text, confirm, tasks, note, outro)
- `ansis` — Terminal colors
- `pathe` — Cross-platform path utilities
- `tinyexec` — Process execution (git, bun install)

## Project Structure

```txt
src/
├── index.ts          # Entry point (shebang, calls run())
├── run.ts            # CLI orchestration (parseArgs, prompts, scaffold)
├── scaffold.ts       # Template copying logic
└── utils/
    ├── fs.ts         # FS utilities (empty, emptyCheck, exists, ignorePredicate)
    └── template.ts   # URL resolution, git clone for external templates
test/
├── index.test.ts     # Entry point error handling
├── run.test.ts       # Integration tests (mocks prompts + tinyexec)
└── template.test.ts  # Unit tests for URL resolution + clone
template/             # Built-in opinionated template (copied on scaffold)
```

## Commands

- `bun run build` — Build with tsdown
- `bun run test` — Run tests (vitest)
- `bun run test:coverage` — Tests with v8 coverage
- `bun run check` — All checks (eslint + stylelint + knip + types)
- `bun run check:eslint` — ESLint only
- `bun run check:types` — Type checking (vue-tsc)

## Workflow

- Always run `bun run check` before considering work done — all checks (eslint, stylelint, knip, types) must pass
- Run `bun run test:coverage` to verify tests pass with 100% coverage
- Do not add `Co-Authored-By` trailers to commit messages

## Code Conventions

- **Imports**: Use project's `src/utils/fs` wrapper (re-exports `node:fs/promises` + custom utils), never import `node:fs/promises` directly in `src/`
- **Ignored files**: Use `ignorePredicate` from `src/utils/fs.ts` for `.git` filtering — never hardcode `'.git'` string comparisons
- **CLI options**: Keep alphabetically ordered in `parseArgs` and help text
- **Process execution**: Use `tinyexec` (`x()`) for shelling out
- **Error handling**: Preserve error cause with `{ cause: error }` in Error constructors
- **Tests**: Mock `tinyexec` and `@clack/prompts` via `vi.hoisted()` + `vi.mock()`. Use `fs.mkdtemp` for temp dirs, clean up in `afterEach`
- **Coverage**: Maintain 100% coverage across statements, branches, functions, and lines
- **Style**: No emojis in code. ESLint enforces `antfu/consistent-list-newline` and `antfu/consistent-chaining`

## Testing Patterns

- `process.exit` is mocked to throw `Error('process.exit(N)')`, tested via `rejects.toThrowError`
- `process.stdout.write` is spied and mocked to verify CLI output
- `process.cwd` is mocked to return a temp directory
- Only test long option names (e.g. `--force`, `--template`), not short aliases
