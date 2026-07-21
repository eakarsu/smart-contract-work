# Smart-contract work archive

> **QUARANTINED — DO NOT CONNECT A WALLET, RPC PROVIDER, CHAIN, OR ASSET.**

This is a frozen 2022 TypeScript blockchain-integration reference. It is not a governance/compliance application, deployable library, supported SDK, or licensed distribution. Historical material contained a wallet private key and provider credential; treat both as compromised and complete provider-side revocation. Removing them from the working tree does not remove them from Git history.

## Supported boundary

- Disposition: `retain-internal-quarantine`.
- Allowed actions: inventory, static policy checks, offline type-checking, and owner-approved clean-room analysis.
- Prohibited actions: wallet/RPC/subgraph connection, transaction creation/signing/submission, chain simulation presented as assurance, package publication, deployment, redistribution, or asset use.
- Runtime, authentication, tenancy, persistence, SSO, retention, legal holds, regulatory ingestion, compliance approvals, and audit exports: `NOT_APPLICABLE`. No application or governed decision workflow exists here.
- `./start.sh` runs read-only boundary tests and `tsc --noEmit`. It does not install dependencies, clean/build output, start a server, connect to a network, access a wallet, publish, or terminate processes.

`BOUNDARY.json`, `PROVENANCE.md`, and `SECURITY.md` are authoritative. The pinned custody baseline is commit `5df442a187b4b2fbd6ede5f6b9b940b4104b5009` / tree `1b5188de1d69211add58f0c8b49ac437364648e5` (123 files, 11,246,185 bytes). That baseline is evidence of what arrived, not proof of authorship or permission.

## Verification

After a deliberate isolated `npm ci`, run:

```sh
./start.sh
npm run build
npm run audit:quarantine
gitleaks dir .
gitleaks git . --log-opts=--all
```

The dependency audit is intentionally a quarantine assertion, not a clean bill of health: the obsolete graph currently has 56 known findings, including 2 critical and 8 high. Any count change requires review. One exact historical credential finding is fingerprinted so current and future findings still fail; the fingerprint is not revocation evidence.

## Preconditions for any future work

A future product must be created in a separate clean repository after: primary provenance and complete license/notices approval; named product/security/legal owners; written evidence that the historical credentials were revoked; supported dependency and chain/provider selection; independent smart-contract and economic-security review; and a newly defined user journey with identity, least privilege, segregation of duties, authoritative sources, versioned policy/evidence/approvals, immutable audit, scenario evaluations, recovery, and release controls. Nothing in this archive satisfies those gates.
