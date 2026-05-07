#!/usr/bin/env bash
# Sync top-level <skill>/SKILL.md folders into Copilot adapters under
# .github/skills/<skill>/SKILL.md.
#
# - Creates a stub adapter only if one does not already exist.
# - Never overwrites a hand-tuned adapter.
# - Skips folders that are not skills (no SKILL.md at the top level).
#
# Usage: bash .github/scripts/sync-skills.sh [--dry-run]

set -euo pipefail

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
ADAPTERS_DIR="$REPO_ROOT/.github/skills"
mkdir -p "$ADAPTERS_DIR"

created=0
skipped=0

for src in "$REPO_ROOT"/*/SKILL.md; do
  [[ -f "$src" ]] || continue
  folder="$(basename "$(dirname "$src")")"

  # Skip the .github folder itself and anything obviously not a skill.
  case "$folder" in
    .github|.git|telemetry|security|eval|node_modules) continue ;;
  esac

  adapter="$ADAPTERS_DIR/$folder/SKILL.md"
  if [[ -f "$adapter" ]]; then
    skipped=$((skipped + 1))
    continue
  fi

  echo "+ $adapter"
  if [[ $DRY_RUN -eq 1 ]]; then
    continue
  fi

  mkdir -p "$(dirname "$adapter")"
  cat > "$adapter" <<EOF
---
name: $folder
description: "TODO: 1-2 sentence description with trigger phrases. See ../../../$folder/SKILL.md for the source."
argument-hint: "TODO"
---

# $folder (adapter)

Source skill: [\`$folder/\`](../../../$folder/) — see
[\`$folder/SKILL.md\`](../../../$folder/SKILL.md).

## When to use

TODO

## Procedure

\`\`\`bash
cd $folder && pip install -r requirements.txt
# python3 <entry-point>.py --help
\`\`\`
EOF
  created=$((created + 1))
done

echo
echo "Created: $created"
echo "Skipped (already exists): $skipped"
if [[ $created -gt 0 ]]; then
  echo
  echo "Next: open the new adapters and tighten the description with trigger phrases."
fi
