# Domain docs

This repository uses a single domain context.

## Layout

- `CONTEXT.md` at the repository root contains the shared domain vocabulary.
- `docs/adr/` contains repository-wide architecture decision records.
- `CONTEXT-MAP.md` is not used because this is not a multi-context repository.

## Consumer rules

Before substantial exploration, read `CONTEXT.md` and any ADRs relevant to the area being changed. If a file or relevant ADR does not exist, continue without creating speculative content.

Use established glossary terms in code, tests, issues, and documentation. If terminology is missing or ambiguous, invoke `domain-modeling` when its model-invoked criteria apply or explicitly use `grill-with-docs` for a user-controlled discovery workflow.

If proposed work contradicts an ADR, surface the conflict instead of silently overriding the recorded decision.
