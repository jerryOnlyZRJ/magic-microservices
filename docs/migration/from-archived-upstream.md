# Migration Guide from the Archived Upstream

This guide is for users who previously depended on
[`bytedance/magic-microservices`](https://github.com/bytedance/magic-microservices)
and want to track the actively maintained
[`jerryOnlyZRJ/magic-microservices`](https://github.com/jerryOnlyZRJ/magic-microservices)
fork.

The upstream repository is archived and no longer accepts normal maintenance
changes. This fork is the public location for ongoing issue triage,
documentation updates, security review, and migration notes.

## What Changes

- Source repository: move issue tracking, source links, and maintenance
  references from `bytedance/magic-microservices` to
  `jerryOnlyZRJ/magic-microservices`.
- Security process: report sensitive issues through this fork's
  [`SECURITY.md`](../../SECURITY.md) process instead of public issues.
- Maintenance evidence: follow the active roadmap in issue #1, dependency
  audit work in issue #2, runtime-boundary review in issue #3, and this
  migration work in issue #4.
- Runtime behavior: no intentional breaking runtime change is introduced by the
  migration guide itself.

## Package Consumption

Most public packages keep the existing `@magic-microservices/*` package names,
including:

- `@magic-microservices/magic`
- `@magic-microservices/magic-react`
- `@magic-microservices/magic-react17`
- `@magic-microservices/magic-vue3`
- `@magic-microservices/magic-preact`
- `@magic-microservices/magic-svelte`
- `@magic-microservices/create-magic`
- `@magic-microservices/portal`
- `@magic-microservices/puzzle`

If your application installs packages from npm, keep your existing package
names and pin known-good versions while tracking security and compatibility
notes from this fork. Do not assume that every source commit in this fork has a
matching npm release until a release note explicitly says so.

If your application vendors source, links Git submodules, or points tooling at
the upstream repository, update those references to this fork.

```sh
git remote set-url origin https://github.com/jerryOnlyZRJ/magic-microservices.git
```

For read-only mirroring, add this fork as a second remote instead of replacing
your existing upstream remote.

```sh
git remote add maintained https://github.com/jerryOnlyZRJ/magic-microservices.git
git fetch maintained
```

## Recommended Migration Steps

1. Inventory how your project consumes Magic Microservices:
   - npm package dependency;
   - Git source checkout, fork, or submodule;
   - copied example code or templates;
   - portal, puzzle, iframe, or HTML-entry integration.
2. Update documentation and issue links to this maintained fork.
3. Pin the package versions you currently run in production.
4. Review [`docs/security/dependency-audit-2026-05-31.md`](../security/dependency-audit-2026-05-31.md)
   for inherited dependency risk.
5. Review [`docs/security/runtime-boundary-threat-model.md`](../security/runtime-boundary-threat-model.md)
   if your integration uses Web Components props, portal manifests, HTML
   entries, iframe fallback, sandbox overrides, or `postMessage`.
6. Run your normal unit, integration, and browser regression tests before
   adopting any fork-side fix.
7. Subscribe to this repository's issues or releases for future remediation
   notes.

## Security Checks for Portal and Puzzle Users

Portal and puzzle users should explicitly review these controls during
migration:

- Manifest and HTML-entry URLs are operator-controlled, not end-user
  controlled.
- Script and style URLs are restricted to trusted origins.
- `renderContent` and `HtmlTagObject.innerHTML` are not populated with
  untrusted HTML unless a sanitizer and CSP policy are in place.
- Iframe fallback integrations validate `postMessage` origins and payload
  shapes before triggering privileged host behavior.
- Sandbox `overrides`, `portalHost`, storage access, and history isolation are
  treated as privileged integration points.

These checks are grounded in the runtime-boundary threat model and should be
kept with application-level security review notes.

## Verification Checklist

Before considering a migration complete:

- `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` still pins the intended
  package versions.
- Build and test commands pass in the consuming application.
- Browser smoke tests cover at least one registered custom element.
- Portal or puzzle users test both mount and update paths.
- Any iframe fallback test includes a negative case for messages from an
  unexpected origin.
- Vulnerability reports and issue links point to this maintained fork.

## Rollback

If a fork-side change breaks your application, keep the current production npm
version pinned and report the compatibility problem in this repository. Include:

- package name and version;
- browser and framework versions;
- whether the integration uses core Magic, adapters, portal, puzzle, iframe
  fallback, or HTML-entry loading;
- minimal reproduction steps.

Security-sensitive details should follow the private reporting process in
[`SECURITY.md`](../../SECURITY.md).

## Current Fork Baseline

As of 2026-05-31, this fork has:

- `SECURITY.md` and private vulnerability reporting enabled;
- `MAINTAINERS.md` with maintainer responsibilities;
- Dependabot configuration for npm and GitHub Actions;
- CodeQL configured for JavaScript and TypeScript;
- merged PR #5 for the first dependency-security remediation and audit
  snapshot;
- merged PR #6 for the runtime-boundary threat model.

Use this guide together with the active maintenance roadmap in issue #1.
