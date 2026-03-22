# Contributing to Magic Microservices

Thank you for your interest in contributing to Magic Microservices!

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Issues

If you discover a potential security issue, please **do not** create a public GitHub issue. Instead, report it via:

- [Bytedance Security Center](https://security.bytedance.com/src)
- Email: [sec@bytedance.com](mailto:sec@bytedance.com)

For non-security issues, please [open a GitHub Issue](https://github.com/bytedance/magic-microservices/issues) with a clear description.

### Development Workflow

We follow the [fork-branch-PR-review-approve](https://github.com/bytedance/magic-microservices) workflow:

1. **Create an Issue** — Track your task with a GitHub Issue before starting work
2. **Fork the repository** — Create a personal fork
3. **Create a branch** — Name it `issue-<number>` (e.g., `issue-123`)
4. **Make your changes** — Keep commits small and focused
5. **Write tests** — Ensure adequate test coverage
6. **Create a Pull Request** — Link it to the Issue and describe: before state, what changed, after state
7. **Pass review** — At least one maintainer approval is required

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>
```

**Types:**

| Prefix | Description | Triggers Release |
|--------|-------------|-----------------|
| `fix:` | Bug fix | PATCH (z++) |
| `feat:` | New feature | MINOR (y++) |
| `docs:` | Documentation | No release |
| `chore:` | Maintenance | No release |
| `test:` | Tests | No release |
| `refactor:` | Code restructure | No release |

**Rules:**
- Use imperative mood in subject line (e.g., "Fix broken link", not "Fixed broken link")
- First letter capitalized, no trailing period
- Subject line ≤ 50 characters
- Leave a blank line before the body

**Examples:**

```
fix: resolve Heap memory leak in disconnectedCallback

When a custom element was removed from the DOM, its Heap entry was
not cleaned up, causing memory accumulation in long-running apps.

Closes #42
```

```
feat(adapters/vue3): add support for Vue 3.4 Composition API

BREAKING CHANGE: Minimum Vue version is now 3.4 due to use of defineModel()
```

### PR Requirements

- One PR per concern (one feature, one fix, etc.)
- All tests must pass
- Code must follow the project's style guidelines
- Update documentation for any user-facing changes
- For performance-sensitive changes, include benchmark results

### License

By submitting a pull request, you agree that your contribution will be licensed under the [Apache License 2.0](./LICENSE).
