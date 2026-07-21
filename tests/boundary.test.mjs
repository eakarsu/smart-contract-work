import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('repository is non-deployable and live network execution is disabled', () => {
  const boundary = JSON.parse(read('BOUNDARY.json'));
  assert.equal(boundary.classification, 'retain-internal-quarantine');
  assert.equal(boundary.deployable, false);
  assert.equal(boundary.networkExecutionAllowed, false);
  assert.equal(boundary.walletAccessAllowed, false);
  assert.equal(boundary.transactionExecutionAllowed, false);
  assert.equal(boundary.authentication, 'not-applicable');
  assert.ok(Object.values(boundary.applicationControls).every((value) => value === 'not-applicable'));
});

test('custody baseline and unresolved rights are explicit', () => {
  const boundary = JSON.parse(read('BOUNDARY.json'));
  assert.equal(boundary.custodyBaseline.commit, '5df442a187b4b2fbd6ede5f6b9b940b4104b5009');
  assert.equal(boundary.custodyBaseline.tree, '1b5188de1d69211add58f0c8b49ac437364648e5');
  assert.equal(boundary.custodyBaseline.trackedFiles, 123);
  assert.ok(boundary.unresolved.includes('license-and-notices'));
  assert.ok(boundary.unresolved.includes('historical-credential-revocation'));
});

test('current configuration contains no embedded wallet key or provider URL', () => {
  const config = read('src/config/index.ts');
  assert.doesNotMatch(config, /0x[a-fA-F0-9]{64}/);
  assert.doesNotMatch(config, /https:\/\/[^"']*(infura|alchemy)/i);
  assert.match(config, /process\.env\.WALLET_PRIVATE_KEY/);
});

test('financial and publishing scripts fail through the quarantine gate', () => {
  const pkg = JSON.parse(read('package.json'));
  for (const name of ['dev', 'getEth', 'testAave', 'pub', 'prepublishOnly']) {
    assert.match(pkg.scripts[name], /blocked-live-operation/);
  }
  assert.equal(pkg.private, true);
  assert.equal(pkg.license, 'UNLICENSED');
});

test('blocked operation exits before any network or wallet work', () => {
  const result = spawnSync(process.execPath, ['scripts/blocked-live-operation.mjs', 'test'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Live RPC, wallet, transaction, and publishing operations are disabled/);
});

test('directly executable examples contain no transaction invocation', () => {
  for (const path of ['src/index.ts', 'src/getSomeEth.ts', 'src/example/index.ts', 'src/example/aave.ts', 'src/example/main.ts']) {
    const source = read(path);
    assert.match(source, /quarantined/);
    assert.doesNotMatch(source, /sendTransaction|createFundTest\(\)|borrow\(\)|deposit\(\)/);
  }
});

test('default verifier is read-only and cannot build, install, or terminate processes', () => {
  const launcher = read('start.sh');
  assert.match(launcher, /boundary:verify/);
  assert.match(launcher, /typecheck/);
  assert.doesNotMatch(launcher, /npm (?:ci|install)|npm run (?:build|clean)|rm -rf|kill -9|pkill/);
});

test('dependency risks remain an exact failing quarantine assertion', () => {
  const boundary = JSON.parse(read('BOUNDARY.json'));
  assert.deepEqual(boundary.dependencyQuarantine, { total: 56, low: 20, moderate: 26, high: 8, critical: 2 });
  assert.match(JSON.parse(read('package.json')).scripts['audit:quarantine'], /verify-audit-quarantine/);
});

test('CI checks full boundary, offline build, audit quarantine, and history secrets', () => {
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /fetch-depth: 0/);
  assert.match(workflow, /boundary:verify/);
  assert.match(workflow, /audit:quarantine/);
  assert.match(workflow, /gitleaks\/gitleaks-action/);
});
