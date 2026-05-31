# Security Policy

## Supported Repository

This repository is the actively maintained fork of
[bytedance/magic-microservices](https://github.com/bytedance/magic-microservices).
Security fixes and maintenance updates are handled in this fork first, with
notes provided for users of the archived upstream repository when relevant.

## Reporting a Vulnerability

Please do not report vulnerabilities through a public GitHub issue.

For sensitive reports, use GitHub's private vulnerability reporting flow if it
is available on this repository. If it is not available, contact the maintainer
through the public GitHub profile and share only a high-level summary until a
private channel is established.

Please include:

- affected package or module;
- impacted versions or commit range;
- minimal reproduction steps;
- expected impact;
- whether you have a proposed fix or mitigation.

## Maintenance Scope

Security review currently focuses on dependency risk, Web Components runtime
boundaries, sandbox behavior, cross-site scripting vectors, build and release
tooling, and supply-chain issues.

## Disclosure

Security issues are triaged privately first. Public disclosure should wait until
a fix, mitigation, or migration note is available.
