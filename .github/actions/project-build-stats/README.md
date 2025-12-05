# Project Build Stats Action

A GitHub Action that analyzes project build stats and comments on pull requests with stats changes.

## Usage

```yaml
- name: Analyze project build stats
  uses: ./.github/actions/project-build-stats
  with:
    directories: app,api
```

## Inputs

- `directories` (required): Comma-separated list of directories to analyze (relative to workspace root)
- `cache-path` (optional): Path to cache directory. Default: `.github/cache/build-stats`
- `cache-key` (optional): Cache key to use for restore/save. Default: `build-stats-main`
- `show-total` (optional): Show total row in the table. Default: `true`
- `comment-on-pr` (optional): Whether to comment on PRs with build stats changes. Default: `true`
- `github-token` (optional): GitHub token for API calls. Defaults to `${{ github.token }}` which respects the job's permissions

## Outputs

- `has-changes`: Whether any build stats changes were detected
