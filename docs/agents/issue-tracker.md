# Issue tracker: GitHub

Issues and PRDs for this repository live as GitHub issues. Use the `gh` CLI for issue-tracker operations and infer the repository from the current Git remote.

## Pull requests as a triage surface

**PRs as a request surface: no.**

External pull requests are not treated as feature requests by the `triage` workflow. Review pull requests through the repository's normal review process.

## Common operations

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --comments`
- List: `gh issue list --state open`
- Comment: `gh issue comment <number> --body "..."`
- Add or remove labels: `gh issue edit <number> --add-label "..."` or `--remove-label "..."`
- Close: `gh issue close <number> --comment "..."`

When a skill says to publish to the issue tracker, create a GitHub issue. Publishing remains an external write and requires the user's authorization.
