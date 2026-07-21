#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
[ -d "$project_dir/node_modules" ] || { echo 'Dependencies missing; prepare the locked environment before verification' >&2; exit 1; }
cd "$project_dir"
npm run boundary:verify
npm test
npm run typecheck
printf '%s\n' 'Read-only archive verification passed; no build output, server, wallet, RPC, transaction, or publish process was started.'
