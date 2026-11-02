# Contributing

Changes land through pull requests. `main` is protected: each pull request needs one approval,
and CI runs on every pull request.

## Local checks

```bash
npm ci
npm test
```

`npm test` runs the wrapper against a local mock server and checks the snapshot, the docs, and
the listing files. Some checks read public URLs (the registry schemas and version list), so they
need network access. To also run the Docker test and the 65-second long-call test:

```bash
docker build -t presentations-ai-mcp .
DOCKER_IMAGE=presentations-ai-mcp SLOW_TESTS=1 npm test
```

## Guidelines

- Check every claim in the docs against the client's or the server's own documentation.
- Use Presentations.AI or `example.com` in examples, not other companies' names.
- Never commit API keys or tokens. Keep them in environment variables.
- `src/snapshot.json` mirrors the hosted server. Don't edit it by hand; maintainers refresh it
  with `npm run snapshot`.
- Report security problems privately, as described in [SECURITY.md](SECURITY.md).
