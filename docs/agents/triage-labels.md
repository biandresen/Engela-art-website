# Triage labels

The engineering workflows use five canonical triage roles. The repository currently maps each role to the same GitHub label name.

| Workflow role     | GitHub label      | Meaning                                           |
| ----------------- | ----------------- | ------------------------------------------------- |
| `needs-triage`    | `needs-triage`    | Maintainer evaluation is required                 |
| `needs-info`      | `needs-info`      | Waiting for information from the reporter         |
| `ready-for-agent` | `ready-for-agent` | Fully specified and ready for an autonomous agent |
| `ready-for-human` | `ready-for-human` | Human implementation or judgment is required      |
| `wontfix`         | `wontfix`         | The issue will not be actioned                    |

## GitHub status

Verified through the public GitHub API on 2026-06-24:

- `wontfix` already exists and is reused.
- `needs-triage`, `needs-info`, `ready-for-agent`, and `ready-for-human` do not yet exist.

Create the four missing labels on GitHub separately when authorized.
