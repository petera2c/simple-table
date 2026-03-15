#!/usr/bin/env bash
# Build Storybook, serve it, and run the full test suite. Re-run after fixes until all pass.
# Usage: ./scripts/run-failing-tests-one-by-one.sh

set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"
URL="${STORYBOOK_URL:-http://localhost:6006}"
OUT_DIR="${REPO_ROOT}/.cursor"

echo "Building Storybook..."
npm run build-storybook --silent 2>&1 | tail -5

# Free port 6006 if in use
if command -v lsof >/dev/null 2>&1; then
  (lsof -ti:6006 | xargs kill -9 2>/dev/null) || true
  sleep 2
fi

echo "Starting http-server on 6006..."
npx http-server storybook-static -p 6006 -s --cors -c-1 &>/dev/null &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

echo "Waiting for Storybook..."
npx wait-on --timeout 60000 "$URL" || { echo "Storybook did not become ready."; exit 1; }

mkdir -p "$OUT_DIR"
echo "Running full test suite..."
npx test-storybook --url "$URL" 2>&1 | tee "${OUT_DIR}/full-suite-output.txt"
ret=${PIPESTATUS[0]}
if [[ $ret -eq 0 ]]; then
  echo "All tests passed."
  exit 0
else
  echo "Some tests failed. See ${OUT_DIR}/full-suite-output.txt"
  exit 1
fi
