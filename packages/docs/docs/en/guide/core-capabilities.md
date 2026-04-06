# Core Capabilities

In the documentation structure, the capability layer answers a practical question: **once you accept the design philosophy, what is the smallest complete set of runtime capabilities you actually use in production.**

Magic keeps that layer intentionally small. It focuses on a runtime loop that is easy to learn, easy to reason about, and still powerful enough for real delivery work.

## The minimal loop: register, mount, consume

The first group of capabilities turns module delivery into a browser-native workflow:

- register a module with `magic()`
- adapt existing logic through lifecycle hooks
- consume the result through an HTML tag

That is why Magic feels lighter than application orchestration solutions. You do not need to learn host-child governance first. Getting one reusable module running is already enough to start.

## Lifecycle defines the runtime boundary

Magic does not hide behavior behind framework-specific magic. It keeps boundaries explicit through lifecycle hooks:

- `bootstrap` for preparation before activation
- `mount` for first render
- `updated` for reacting to prop changes
- `unmount` for side-effect cleanup

These boundaries make module behavior easier to reason about and create stable integration points for plugins, adapters, and runtime enhancements.

## Props are a browser-native enhancement

Another key capability is data flow on top of the browser model:

- use `propTypes` to define the module contract
- use `useProps()` to pass objects, functions, and other reference values
- keep the HTML tag contract while avoiding lossy string-only fallbacks

This is one of the clearest differences between Magic and a plain Web Components wrapper. Magic does not replace the browser contract. It upgrades it just enough for real product needs.

## Live Demo: the smallest registration loop

This example shows the minimum Magic runtime loop. Edit the HTML, CSS, and JavaScript and watch how a Custom Element is registered, mounted, and updated in real time.

<MagicPlayground demo="hello-card" locale="en" />

## Live Demo: passing reference values

This example highlights why `useProps()` matters. Change the callback logic and observe how a function reference moves through Magic instead of being degraded into a serialized string.

<MagicPlayground demo="use-props-callback" locale="en" />

## Suggested next steps

If you want to keep learning from the capability angle, continue with:

- [Lifecycle](./lifecycle)
- [Props & Data Flow](./props)
- [Module Registration](./register)
- <a href="/en/ecosystem/">Ecosystem Extensions</a>
