# Security status

This code is quarantined and must not be used with a wallet, RPC provider, live chain,
or assets. The historical repository contained a wallet private key and provider token.
They must be treated as compromised and revoked or rotated outside this repository;
removing them from the current tree does not remove them from Git history.

The transaction examples target retired test infrastructure and have not received a
modern smart-contract or economic-security review. Live-operation and publish scripts
therefore fail closed. Dependency findings are recorded as quarantine blockers, not as
accepted production risk.

The locked graph currently reports 56 findings (20 low, 26 moderate, 8 high, and 2 critical). CI asserts the exact quarantine count so additions, removals, or advisory changes require review; this is not permission to execute the graph. One exact original-commit credential finding is fingerprinted only so every new current/history finding fails. The fingerprint is not proof of provider-side revocation.

Do not import the package from another application, run example modules, add a wallet/RPC/subgraph value, use ABIs as deployment authority, publish artifacts, or treat an offline TypeScript compile as contract or economic assurance. Preserve suspected evidence, stop access, and coordinate credential revocation privately.

Report suspected exposure privately to the repository owner. Do not include active
credentials or seed phrases in an issue.
