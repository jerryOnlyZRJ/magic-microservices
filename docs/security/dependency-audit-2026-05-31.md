# Dependency Security Triage Snapshot - 2026-05-31

This snapshot records the first public dependency-security triage pass for the
actively maintained `jerryOnlyZRJ/magic-microservices` fork.

## Scope

- `packages/docs/package-lock.json`
- `examples/magic-microservice-web/package-lock.json`
- Direct dependency remediation where the fix is narrow and does not require
  replacing legacy private ByteDance packages.

## Audit Results

`packages/docs` currently has no vulnerabilities reported by `npm audit`.

`examples/magic-microservice-web` still has legacy dependency risk after the
first targeted fix:

| Severity | Count |
| --- | ---: |
| Critical | 3 |
| High | 42 |
| Moderate | 17 |
| Low | 22 |
| Total | 84 |

## Remediation Completed

- Updated the demo application's direct `lodash` dependency from `4.17.4` to
  `4.17.21`.
- Updated the matching top-level `package-lock.json` entry to the npm registry
  artifact and integrity hash for `lodash@4.17.21`.

This removes the repository's explicit direct dependency on a vulnerable lodash
release. `npm audit` still reports transitive lodash exposure through older
tooling packages, especially `commitizen`, so those items remain in the
follow-up queue below.

## Remaining Priority Queue

1. Replace or upgrade `@byted-cg/bcg`, which pulls high-severity risk through
   legacy internal tooling and `serialize-javascript`.
2. Replace or upgrade `@byted-cg/cg-i18n-utils`, which pulls high-severity risk
   through `@ies/starling_client`.
3. Upgrade or isolate `react-markdown`; the safe path requires rendering
   regression tests because current safe versions are a major-version jump.
4. Upgrade `copy-webpack-plugin`; this also needs webpack compatibility checks.
5. Upgrade `commitizen` to remove the remaining transitive lodash audit path.

## Verification

Commands used:

```sh
npm audit --json --package-lock-only
```

The command was run in both `packages/docs` and
`examples/magic-microservice-web`.

`npm install --package-lock-only` was not used for the example app because its
historic lockfile references private ByteDance packages that are not available
from the public npm registry. This triage therefore keeps the first remediation
deliberately narrow and auditable.
