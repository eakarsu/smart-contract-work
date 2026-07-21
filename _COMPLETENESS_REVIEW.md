# Completeness Review: smart-contract-work

**Review date:** 2026-07-18

## Assessment basis

Static inspection of project-owned source and configuration only; no dependency installation, build, database migration, external-service call, or runtime launch was performed. The scan considered 73 project files (18 source files), 1 manifest(s), 0 test-like file(s), and 0 CI workflow(s), excluding dependency/generated directories.

## Classification

**Not an app**

This repository should not be treated as a launchable governance/compliance app. Its checked-in state is inert, internally inconsistent, credential/provenance-sensitive, or unsafe to operate; feature work must wait until the blockers below are repaired and verified.

## Why it is not complete

- The supported build/runtime path and a trustworthy end-to-end workflow have not been demonstrated from the checked-in state.

## Needed features

1. Establish provenance/licensing and reproduce a clean build in an isolated environment before adding product surface.
2. Replace advisory-only AI output with versioned policies, evidence links, accountable owners, approvals, and immutable decisions.
3. Add authoritative regulatory/contract ingestion with source provenance, effective dates, jurisdiction, and change detection.
4. Implement SSO, least-privilege RBAC, segregation of duties, retention/legal holds, and exportable audit logs.
5. Build scenario-specific evaluations so citations, obligations, deadlines, and risk ratings are checked before release.

## Risks or launch blockers

- Regression risk is high because no recognizable project-owned automated tests cover the main path.
- No CI evidence prevents broken or insecure changes from reaching a release.

## Evidence inspected

- `README.md`
- `src/abis/MaxConcentration.json:257`
- `src/example/main.ts`
- `package.json`

## Recommended next action

Quarantine execution, repair provenance/secret/startup/build blockers in an isolated branch, and reassess only after a clean reproducible build and smoke test.

## Implementation progress (2026-07-20)

The review's quarantine recommendation has been implemented. The suggested governance/compliance product features do not match this repository: it is an archived TypeScript blockchain integration library, not a web application or policy system. Its durable disposition is `retain-internal-quarantine`, recorded in `BOUNDARY.json`, rather than expansion into an unsupported product.

### Numbered needed-feature disposition

1. **Provenance/licensing and isolated build boundary:** the observed remote, conflicting manifest repository claim, exact one-commit/tree 123-file/11,246,185-byte custody baseline, absent root license, historical README license assertion, and bundled third-party artifact uncertainty are recorded without inferring permission. A locked install, tests, offline typecheck, and deterministic TypeScript build reproduce in isolation, but provenance/license clearance remains a human blocker; the package is private and `UNLICENSED`.
2. **Policy/evidence/approval product behavior:** not applicable to this artifact. It has no AI advisory system or governed-decision application. The package entry point, runnable examples, wallet-transfer commands, and publish lifecycle fail closed. A future compliance product must be separately scoped with versioned policies, evidence links, named owners, independent approvals, and immutable decisions rather than fabricated here.
3. **Authoritative regulatory/contract ingestion:** not applicable and not claimed. No regulatory source, jurisdiction, effective-date store, or change-detection workflow exists. `BOUNDARY.json` prohibits RPC/subgraph/provider access; a future separately owned application requires contracted authoritative sources and source/version/change evidence.
4. **SSO/RBAC/segregation/retention/audit:** authentication and every application control are explicitly `not-applicable` because there is no server, UI, user/data store, or supported runtime. A separate future product must implement those controls before accepting data or decisions; this archive cannot satisfy them by adding placeholder roles or logs.
5. **Scenario-specific evaluations:** not applicable to an intentionally non-executable archive. Offline checks validate quarantine, provenance facts, credential removal, disabled entry points, dependency-risk evidence, and build repeatability only. They make no claim about citations, obligations, deadlines, risk ratings, contracts, or smart-contract/economic correctness.

Completed changes:

- Removed the embedded wallet private key and provider URL from the current source and replaced them with environment lookups. Git-history scanning still reports one historical secret finding, so the exposed wallet/provider credentials must be considered compromised and revoked externally.
- Disabled the directly executable wallet-transfer, fund-creation, Aave, development, and public-publishing paths. Package scripts now fail closed with exit code 2, and the package is both `private` and `UNLICENSED`.
- Added `PROVENANCE.md`, `SECURITY.md`, `BOUNDARY.json`, `.env.example`, repository ignores, and a prominent quarantine notice in the README.
- Removed the conflicting Yarn lockfile; npm's lockfile is now the single reproducible dependency source used by CI.
- Repaired the TypeScript compile error by defining the missing environment-backed subgraph setting.
- Added project-owned tests and CI gates for the quarantine boundary, custody baseline, current-tree credential absence, offline compilation, disabled live operations/import/publication, exact vulnerable-dependency quarantine, and full-history secret scanning.
- Added `start.sh` as a read-only offline verifier. It performs no install, clean/build output mutation, server launch, wallet access, RPC connection, transaction, process termination, or publishing action.

Verification performed:

- `./start.sh`: passed with no error; 9/9 tests and the no-output TypeScript check completed.
- A clean isolated locked install and two TypeScript builds produced the same source/artifact digest; the built package entry point also failed closed on import.
- `npm run getEth`: rejected by the quarantine gate with the expected exit code 2.
- Current project-owned source/config secret scan: passed after credential removal.
- Full Git-history secret scan: one real original-commit credential finding is narrowly fingerprinted so all current/new findings fail; provider-side rotation/revocation remains mandatory and unproven.
- `npm run audit:quarantine`: confirmed the exact intentionally failing 56-finding graph (20 low, 26 moderate, 8 high, 2 critical); any advisory-count change fails for review.
- `git diff --check`: passed.

Authentication/login status: **not applicable**. This is a Node library with no HTTP server, UI, user store, session mechanism, or login workflow. `start.sh` correctly validates the offline library contract and does not invent an account system.

Residual blockers: the archived dependency graph still reports 56 known findings (20 low, 26 moderate, 8 high, 2 critical) after non-breaking remediation. Several are inherited through obsolete Aave/Enzyme/Web3 dependencies and have no compatible fix. Combined with uncertain redistribution provenance, retired Kovan assumptions, unaudited transaction logic, and the historical secret, this repository must remain non-deployable and disconnected from wallets/assets. A future revival requires a clean-room dependency migration, provenance/license clearance, smart-contract and economic-security review, credential revocation evidence, and isolated-chain integration tests.

## Runtime acceptance refresh (2026-07-20)

- The validator recorded `NOT_APPLICABLE` with `not_independent_application` on the archive's distinct assigned PostgreSQL/API/UI triple `55700`/`6200`/`6201`; no listeners were opened and no login flow was invented.
- The read-only offline `start.sh` verifier passed all 9 boundary tests and the no-output TypeScript check. The TypeScript build also passed.
- The classification remains **Not an app**: this quarantined library has no server, UI, datastore, authentication, or supported runtime. All three assigned ports remained free.
