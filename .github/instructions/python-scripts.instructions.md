---
description: "Use when editing or creating Python scripts in any skill folder. Covers CLI conventions, dependency hygiene, and entry-point patterns used across the repo."
applyTo: "**/*.py"
---

# Python script conventions

Every skill in this repo ships standalone CLI scripts. Follow the patterns
already in place — don't introduce frameworks.

## CLI shape

- Use `argparse` with subcommands (`create`, `score`, `report`, etc.) that
  mirror the existing tools in `growth-engine/experiment-engine.py` and
  `sales-pipeline/rb2b_instantly_router.py`.
- Support `--json` for machine-readable output where humans might pipe results.
- Default to verbose human output with clear section headers.

## Dependencies

- Add a new package to `requirements.txt` **only** when the script actually
  imports it. Pin to a minor version (`requests>=2.31,<3`) when behaviour
  matters.
- Prefer the standard library for file I/O, CSV, JSON, dates, and
  subprocess. No `pandas` unless the skill is genuinely tabular.

## Entry-point pattern

```python
def main() -> int:
    parser = argparse.ArgumentParser(...)
    # subparsers...
    args = parser.parse_args()
    return args.func(args)

if __name__ == "__main__":
    sys.exit(main())
```

## Don't

- Don't add docstrings, type hints, or refactors to code you weren't asked
  to change.
- Don't introduce async unless the workload is genuinely I/O-bound across many
  hosts.
- Don't print credentials, even in `--debug` mode.
