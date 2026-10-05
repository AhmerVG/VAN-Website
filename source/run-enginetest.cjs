/**
 * Runner for the headless engine tests. `tsc -p tsconfig.enginetest.json` emits CommonJS into
 * enginetest-out/ with the "@/..." import specifiers intact, so they are mapped back here.
 * Usage: node run-enginetest.cjs [__enginetest|__derivecheck]
 */
const path = require('path')
const fs = require('fs')
const Module = require('module')
const OUT = path.join(__dirname, 'enginetest-out')
fs.writeFileSync(path.join(OUT, 'package.json'), '{"type":"commonjs"}')
const orig = Module._resolveFilename
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) request = path.join(OUT, request.slice(2))
  return orig.call(this, request, ...rest)
}
require(path.join(OUT, (process.argv[2] || '__enginetest') + '.js'))
