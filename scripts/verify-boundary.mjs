import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const boundary = JSON.parse(read('BOUNDARY.json'));
const pkg = JSON.parse(read('package.json'));

assert.equal(boundary.schemaVersion, 2);
assert.equal(boundary.classification, 'retain-internal-quarantine');
assert.equal(boundary.deployable, false);
assert.equal(boundary.publicPublishingAllowed, false);
assert.equal(boundary.networkExecutionAllowed, false);
assert.equal(boundary.walletAccessAllowed, false);
assert.equal(boundary.transactionExecutionAllowed, false);
assert.deepEqual(new Set(boundary.unresolved), new Set([
  'accountable-owner', 'primary-provenance', 'license-and-notices',
  'historical-credential-revocation', 'supported-dependencies-and-networks', 'security-review',
]));
for (const value of Object.values(boundary.applicationControls)) assert.equal(value, 'not-applicable');

const cwd = new URL('.', root).pathname;
const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const baseline = boundary.custodyBaseline;
assert.equal(git('rev-parse', `${baseline.commit}^{tree}`), baseline.tree);
const records = git('ls-tree', '-r', '-l', baseline.commit).split('\n').filter(Boolean);
assert.equal(records.length, baseline.trackedFiles);
assert.equal(records.reduce((sum, row) => sum + Number(row.match(/^\S+\s+\S+\s+\S+\s+(\d+)\s/)[1]), 0), baseline.trackedBytes);
assert.equal(git('rev-list', '--count', baseline.commit), String(baseline.commitCount));

assert.equal(pkg.private, true);
assert.equal(pkg.license, 'UNLICENSED');
assert.equal(pkg.bin, undefined);
for (const name of ['dev', 'getEth', 'testAave', 'pub', 'prepublishOnly']) {
  assert.match(pkg.scripts[name], /blocked-live-operation/);
}

const config = read('src/config/index.ts');
assert.doesNotMatch(config, /0x[a-fA-F0-9]{64}/);
assert.doesNotMatch(config, /https:\/\/[^"']*(?:infura|alchemy)/i);
assert.match(config, /process\.env\.WALLET_PRIVATE_KEY/);
assert.match(config, /process\.env\.RPC_URL/);

for (const path of ['src/index.ts', 'src/getSomeEth.ts', 'src/example/index.ts', 'src/example/aave.ts', 'src/example/main.ts']) {
  const source = read(path);
  assert.match(source, /Blocked:/);
}
assert.doesNotMatch(read('src/example/main.ts'), /JsonRpcProvider|new ethers\.Wallet|createNewFund|borrow\(|deposit\(/);

const launcher = read('start.sh');
for (const action of ['npm ci', 'npm install', 'npm run build', 'npm run clean', 'rm -rf', 'kill -9', 'pkill']) {
  assert.equal(launcher.includes(action), false, `launcher contains mutating action: ${action}`);
}
assert.match(launcher, /npm run typecheck/);

const review = read('_COMPLETENESS_REVIEW.md');
assert.equal(review.match(/^## Implementation progress \(2026-07-20\)$/gm)?.length, 1);
for (const path of ['README.md', 'PROVENANCE.md', 'SECURITY.md']) {
  assert.match(read(path), /quarantin/i);
}

console.log(`Quarantine boundary verified: ${baseline.trackedFiles} baseline files; all application controls remain not applicable.`);
