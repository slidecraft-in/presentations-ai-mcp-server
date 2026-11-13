# Changelog

Changes to the hosted server's tools and to this repo, newest first.

## Unreleased

- New tool `send_feedback`: sends a note the user approved to the Presentations.AI team.
- Snapshot and README match the current tools: `get_task` waits up to 50 s, `send_feedback`
  carries `destructiveHint`, and `create_outline` retries use `request_id`.
- Credit costs per quality tier and the zero-balance rule are documented. The README no
  longer lists rate-limit numbers.
- The VS Code and VS Code Insiders buttons open VS Code's `mcp/install` link through the
  vscode.dev redirect.

## 1.1.0 - 2026-11-03

- Docs match the hosted server: OAuth 2.1 with PKCE and dynamic client registration, or an
  API key; 13 tools.
- Stdio wrapper and Docker image updated for the current endpoint; tests and CI added.
- Install buttons for VS Code, VS Code Insiders, Visual Studio, Cursor, and Kiro.
- `server.json` matches the published MCP Registry entry.

## 1.0.0 - 2026-05-18

- MCP Registry entry for the hosted server at `https://api.presentations.ai/mcp`.
- Stdio wrapper for local-only clients (2026-06-10).
