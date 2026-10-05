#!/bin/bash
# The shared bundle-artifact.sh fails on `pnpm add` against the symlinked node_modules; these are its two real steps.
set -e
cd "$(dirname "$0")"
rm -rf dist .parcel-cache
npx parcel build index.html --dist-dir dist --no-source-maps
npx html-inline dist/index.html > bundle.html
ls -la bundle.html
