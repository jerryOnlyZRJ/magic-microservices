# Runtime Boundary Threat Model

This threat model covers the maintained `jerryOnlyZRJ/magic-microservices`
fork at repository scope, with extra detail for the Web Components runtime,
portal, puzzle, HTML-entry, and cross-context communication surfaces tracked in
issue #3.

The goal is to guide future security reviews. This document describes assets,
trust boundaries, attacker-controlled inputs, realistic attacker stories, and
severity calibration. It does not claim that every risky pattern listed here is
currently exploitable.

## Overview

`magic-microservices` is a TypeScript monorepo for building micro-frontend
components on top of Web Components. The core package registers custom elements
and maps element attributes into component props:

- `packages/core/magic/src/index.ts` exposes `magic()`, `useProps()`, and
  `isModuleRegistered()`.
- `packages/core/magic/src/lib/LifeCycle/index.ts` builds custom elements,
  attaches a shadow root when configured, renders configured tags, and invokes
  module lifecycle hooks.
- `packages/core/magic/src/lib/Heap/index.ts` stores non-string props in a
  window-global heap and resolves attribute values back to objects or
  functions.
- `packages/core/magic/src/utils/htmlTag.ts` turns tag definitions into DOM
  elements and may assign `innerHTML`.

The repository also contains portal and puzzle examples/packages that extend
the core runtime into higher-risk integration patterns:

- `examples/magic-puzzle/packages/portal-html-entry-plugin/src/index.ts`
  fetches an HTML entry and converts it into a manifest.
- `examples/magic-puzzle/packages/portal-utils/src/portalHtmlParser.ts`
  extracts script and style tags from HTML into runtime tag objects.
- `examples/magic-puzzle/packages/portal/src/portalRegister.ts` fetches
  manifests or scripts, writes SSR content into the render container, and
  executes scripts through `@byted/garfish-sandbox`.
- `examples/magic-puzzle/packages/puzzle/src/puzzle/iframeCreator.ts` creates
  iframe fallback services.
- `examples/magic-puzzle/packages/puzzle/src/puzzle/puzzleBridge.ts` bridges
  host and client messages through `postMessage` or portal event emitters.

The primary assets are:

- the host page DOM, JavaScript execution context, and same-origin browser
  storage;
- trusted component modules registered through `magic()`;
- portal manifest and HTML-entry integrity;
- parent/child communication channels between host pages, Web Components,
  sandboxed portal code, and iframe fallback code;
- build and release integrity for packages, examples, docs, and generated
  templates.

## Threat Model, Trust Boundaries, and Assumptions

### Actors

- **Application developer or operator:** owns the host app, chooses which
  components, manifests, HTML entries, scripts, styles, props, and plugins are
  loaded.
- **Component author:** provides module lifecycle implementations such as
  `mount`, `updated`, and `unmount`.
- **End user:** interacts with a host application that uses the library. End
  users may control ordinary application data, URL fragments, or form fields,
  but should not control runtime manifests, scripts, or raw HTML entries unless
  the embedding application adds a separate sanitizer and policy layer.
- **Third-party or remote micro app:** may provide portal content, iframe
  content, or script bundles. Treat it as untrusted unless the host application
  has an explicit trust relationship and isolation policy.
- **Maintainer or release actor:** controls package publication, dependency
  upgrades, documentation examples, and generated project templates.

### Trust Boundaries

- **Host application to Magic runtime:** The host app passes `module`,
  `MagicOptions`, `htmlTags`, alias `scripts` and `styles`, `plugins`, and
  `propTypes` into `magic()`. These inputs are privileged configuration.
- **DOM attributes to component props:** Custom element attributes are parsed in
  `attributeChangedCallback` and resolved through `Heap.getPropsValue()`. A
  string attribute may become a Boolean, Number, raw string, object, array, or
  function if it matches a heap key.
- **Window-global heap:** `useProps()` stores arbitrary values under
  `window.__MAGIC_HEAP__`. That heap is same-window shared state; it is not a
  security boundary.
- **HTML tag rendering:** `HtmlTagObject` values become DOM nodes and can set
  attributes or `innerHTML`. Any caller that lets untrusted users shape tag
  names, attributes, URLs, or `innerHTML` crosses into XSS-sensitive territory.
- **Remote manifest and HTML entry:** Portal code can fetch a manifest or HTML
  entry and then render styles, SSR content, and scripts. These inputs must be
  treated as trusted code unless a consumer adds integrity, allowlist, and
  sanitization controls.
- **Sandbox to host page:** `@byted/garfish-sandbox` is defense-in-depth, not
  proof that remote code is harmless. Overridden modules intentionally expose
  selected host capabilities such as `portalHost`, history, storage, and event
  APIs.
- **Iframe to parent:** `puzzleBridge` supports iframe fallback with
  `postMessage`. Origin and message-shape validation determine whether the
  iframe boundary is meaningful.
- **Repository tooling to published packages:** CLI templates, examples, docs,
  lockfiles, and GitHub Actions affect supply-chain integrity even when they
  are not runtime code.

### Assumptions

- Runtime manifests, script URLs, `renderContent`, `htmlTags`, and HTML-entry
  URLs are operator-controlled by default. If an application gives an end user
  control over those fields, the application must add allowlists,
  sanitization, and CSP.
- The library does not provide authentication, authorization, tenant isolation,
  CSRF protection, or rate limiting. Those remain host-application concerns.
- Shadow DOM can reduce accidental DOM collisions, but it is not an XSS
  sanitizer and does not isolate JavaScript execution.
- Same-origin storage access is intentionally available in some portal paths
  when the portal origin matches the host origin. Same-origin remote code should
  be treated as privileged.
- Documentation and examples may be copied into production applications, so
  insecure examples can become real risk even when example apps are not
  deployed by this repository.

## Attack Surface, Mitigations, and Attacker Stories

### Core Custom Element Runtime

Security-sensitive surfaces:

- Custom element registration and lifecycle execution in
  `packages/core/magic/src/lib/LifeCycle/index.ts`.
- Attribute-to-prop conversion in `attributeChangedCallback`, including
  one-time heap lookup through `Heap.getPropsValue()`.
- Arbitrary module objects or module factories passed into `magic()`.
- Plugins that can hook `beforeOptionsInit`, `alterHTMLTags`, and
  `beforeElementDefinition`.

Existing mitigations and constraints:

- `observedAttributes` is derived from explicit `propTypes`, limiting which
  attributes trigger updates.
- Non-string props placed in the heap are deleted after lookup, reducing stale
  reference lifetime.
- `shadow: true` attaches a shadow root and scopes rendered content to the
  component tree.

Relevant attacker stories:

- If a hostile user can set arbitrary custom element attributes and the host
  maps those attributes to privileged behavior, they may trigger unsafe
  lifecycle updates or pass unexpected values into component code.
- If a hostile script in the same window can read or write `window.__MAGIC_HEAP__`,
  it may race or confuse prop resolution. This is same-origin script execution,
  so it should usually be modeled as already-high-impact XSS in the host page.
- If a plugin can be supplied by an untrusted party, it can mutate lifecycle
  behavior and should be considered equivalent to trusted code execution.

### HTML Tag and HTML Entry Rendering

Security-sensitive surfaces:

- `renderHtmlTagObjectToHtmlElement()` sets arbitrary attributes and may assign
  `innerHTML` for non-void tags.
- `portalHtmlParser()` extracts scripts and styles from fetched HTML and
  preserves HTML content in tag objects.
- Portal registration writes `renderContent` into `renderContainer.innerHTML`.
- HTML-entry plugin code can fetch a URL, parse it, and convert it into portal
  runtime input.

Existing mitigations and constraints:

- Void tags are tracked so unsupported `innerHTML` is not assigned to void
  elements.
- HTML-entry loading is opt-in plugin behavior rather than the base `magic()`
  path.

Relevant attacker stories:

- If an attacker controls `renderContent`, `HtmlTagObject.innerHTML`, or an
  HTML entry parsed by the plugin, they may inject DOM, event handlers, or
  script-bearing content depending on how the host renders and executes it.
- If an attacker controls script or style tag attributes, they may point the
  runtime at a hostile JavaScript or CSS asset.
- If an application uses a remote HTML entry from a mutable third-party origin,
  compromise of that origin can become compromise of the host integration.

### Portal Manifest, Sandbox, and Remote Scripts

Security-sensitive surfaces:

- `portalRegister.ts` accepts object manifests or string manifest URLs.
- Script tags are loaded in order; inline script content and fetched script
  content are passed to `sandbox.execScript()`.
- Same-origin portal content can receive direct `localStorage` and
  `sessionStorage` overrides.
- `portalHost` exposes event and message operations into the sandbox context.
- `overrides` can write arbitrary keys into `sandbox.context`.

Existing mitigations and constraints:

- Remote script execution is routed through `@byted/garfish-sandbox`.
- History can be isolated through `history-isolation`.
- Same-origin storage override is conditional on the portal initial origin
  matching the host page origin.
- Sandbox effects are cleared on remount and unmount.

Relevant attacker stories:

- If an attacker controls the manifest, they control script execution inputs.
  The sandbox reduces accidental global pollution but should not be treated as
  permission to load untrusted code without a host policy.
- If an attacker controls `initial-url`, a bypass in origin calculation or URL
  normalization could lead to the wrong namespace or storage policy.
- If a host exposes powerful `overrides`, remote portal code may gain direct
  access to privileged host functions.

### Iframe Fallback and Message Bridge

Security-sensitive surfaces:

- `iframeCreator()` sets `src` from `fallbackHTMLURL` and allows fullscreen.
- `puzzleBridge` uses `postMessage` with a default `targetOrigin = '*'`.
- Message handlers accept messages that carry `_isPuzzle` and a matching
  `type`, but the shown bridge does not validate `event.origin` against an
  allowlist.
- The message payload `data` is opaque and may be forwarded to application
  callbacks.

Existing mitigations and constraints:

- Messages are marked with `_isPuzzle` and type-matched before callbacks run.
- Web Components mode is preferred when supported unless `serviceMode` forces
  iframe behavior.

Relevant attacker stories:

- If a hostile frame can send messages to the host window, and the host
  registers sensitive callbacks, missing origin validation can let the hostile
  frame trigger host actions.
- If `fallbackHTMLURL` is user-controlled, the host may embed an attacker page
  and create an unintended communication relationship.
- If callbacks treat message payloads as trusted HTML, URLs, or commands, the
  bridge can become an injection path.

### Build, Templates, and Documentation

Security-sensitive surfaces:

- `packages/create/magic` copies templates, runs package install flows, and
  emits starter projects.
- Example projects include legacy dependencies and patterns that users may copy
  into production.
- GitHub Actions, Dependabot, CodeQL, lockfiles, and release metadata affect
  the supply-chain baseline for this maintained fork.

Existing mitigations and constraints:

- Dependabot is configured for npm and GitHub Actions maintenance.
- CodeQL is configured for JavaScript and TypeScript.
- `SECURITY.md` documents private vulnerability reporting.
- `docs/security/dependency-audit-2026-05-31.md` starts the dependency triage
  trail.

Relevant attacker stories:

- If a template includes unsafe defaults, downstream users may reproduce them
  in production.
- If a dependency update changes bundler, parser, or sandbox behavior, a
  security fix may introduce a runtime regression unless tested against portal
  and puzzle flows.

## Severity Calibration

### Critical

Treat an issue as critical when it enables remote code execution or full host
application compromise in a realistic production integration.

Examples:

- An untrusted user can control a portal manifest or HTML entry that leads to
  script execution in the host origin or a sandbox escape with host DOM/storage
  access.
- Iframe or portal messages from an attacker-controlled origin can trigger
  privileged host operations without origin or capability checks.
- A supply-chain compromise affects a published package, template, or GitHub
  release path used by downstream applications.

### High

Treat an issue as high when it enables XSS, sensitive state access, trusted
message forgery, or significant privilege confusion, but requires a meaningful
precondition such as operator-controlled configuration becoming attacker
controlled.

Examples:

- `renderContent`, `HtmlTagObject.innerHTML`, script URLs, or style URLs can be
  shaped by attacker-controlled application data.
- `postMessage` handlers accept attacker-origin messages for security-sensitive
  callbacks.
- A sandbox override exposes privileged host functions to remote portal code
  without an allowlist.
- Same-origin storage is exposed to content whose origin was misclassified or
  insufficiently constrained.

### Medium

Treat an issue as medium when it causes contained injection, denial of service,
state confusion, or unsafe defaults that require additional application misuse
before becoming host compromise.

Examples:

- A component can trigger repeated remounts, leaked event listeners, or stale
  sandbox state that degrades host reliability.
- History isolation or routing state can be confused across portals without
  direct data exposure.
- Documentation or templates omit recommended CSP, origin validation, or
  manifest allowlist guidance.
- Dependency vulnerabilities affect developer tooling or examples but are not
  reachable in published runtime bundles.

### Low

Treat an issue as low when it is limited to non-sensitive examples, local
developer workflows, cosmetic DOM changes, or documentation clarity with no
credible production security impact.

Examples:

- A demo page can render unexpected text or styles without script execution or
  data exposure.
- A docs-only issue describes an unsafe pattern but the runtime API remains
  unaffected.
- A lint or test dependency has a known advisory but does not run on untrusted
  input in normal maintainer workflows.

## Review Priorities for Issue #3

Future runtime-boundary review should prioritize:

1. Add explicit origin allowlist guidance and tests around `puzzleBridge`
   message handling.
2. Define the expected trust level for `manifest`, `html-entry`, `renderContent`,
   `scripts`, `styles`, and `HtmlTagObject.innerHTML`.
3. Document safe defaults for consumers: CSP, script/style allowlists,
   integrity checks, and sanitizer requirements when HTML entry input is not
   fully operator-controlled.
4. Audit sandbox `overrides`, `portalHost`, storage override, and history
   isolation behavior for least-privilege defaults.
5. Add regression tests that model hostile HTML entry, hostile iframe origin,
   and hostile message payloads without relying on production secrets.
