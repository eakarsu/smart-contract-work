import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const boundary = JSON.parse(readFileSync(new URL('../BOUNDARY.json', import.meta.url), 'utf8'));
const result = spawnSync('npm', ['audit', '--json'], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
assert.equal(result.status, 1, 'obsolete dependency audit must remain a failing quarantine gate');
const report = JSON.parse(result.stdout);
const actual = report.metadata?.vulnerabilities;
assert.ok(actual, 'npm audit metadata missing');
for (const [severity, expected] of Object.entries(boundary.dependencyQuarantine)) {
  assert.equal(actual[severity], expected, `dependency quarantine count changed for ${severity}; review is required`);
}
console.log(`Dependency quarantine verified: ${actual.total} findings (${actual.critical} critical, ${actual.high} high).`);
