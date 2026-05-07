#!/usr/bin/env bash
# .github/hooks/pre-edit-sanitizer.sh
# Called by the PreToolUse hook before any file-write tool.
# Reads the proposed tool input from stdin (JSON), extracts the file path,
# and passes it through security/sanitizer.py.
#
# Exit codes:
#   0  – clean, allow the write
#   2  – findings detected, block with a message
#
# The hook outputs JSON on stdout so Copilot can surface the reason.

set -euo pipefail

# Read stdin into a variable (tool input JSON).
input="$(cat)"

# Extract the file path from common tool parameter shapes.
# Supports: filePath, path, file_path keys.
filepath=$(echo "$input" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for key in ('filePath', 'path', 'file_path', 'target'):
    if key in d and d[key]:
        print(d[key])
        sys.exit(0)
" 2>/dev/null || true)

# If we can't identify a file path, allow the write.
if [[ -z "$filepath" ]]; then
  echo '{"continue": true}'
  exit 0
fi

# Only scan if the file already exists or has a path inside the repo.
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
sanitizer="$REPO_ROOT/security/sanitizer.py"

if [[ ! -f "$sanitizer" ]]; then
  echo '{"continue": true}'
  exit 0
fi

# Run a quick scan on the specific file (or the newString content if it's new).
newstring=$(echo "$input" | python3 -c "
import sys, json
d = json.load(sys.stdin)
for key in ('newString', 'content', 'new_string'):
    if key in d and d[key]:
        print(d[key])
        sys.exit(0)
" 2>/dev/null || true)

if [[ -n "$newstring" ]]; then
  tmpfile=$(mktemp /tmp/copilot-hook-XXXXXX)
  echo "$newstring" > "$tmpfile"
  result=$(python3 "$sanitizer" --scan --dir "$tmpfile" 2>&1 || true)
  rm -f "$tmpfile"
else
  result=$(python3 "$sanitizer" --scan --dir "$filepath" 2>&1 || true)
fi

# Check for findings in the output.
if echo "$result" | grep -qiE '(FOUND|match|violation|secret|api.?key|token|email|phone)'; then
  reason="Sanitizer detected potential PII or secrets in $(basename "$filepath"). Review before writing. Run: python3 security/sanitizer.py --scan --dir . --recursive"
  python3 -c "
import json, sys
print(json.dumps({
  'hookSpecificOutput': {
    'hookEventName': 'PreToolUse',
    'permissionDecision': 'ask',
    'permissionDecisionReason': sys.argv[1]
  }
}))" "$reason"
  exit 0
fi

echo '{"continue": true}'
exit 0
