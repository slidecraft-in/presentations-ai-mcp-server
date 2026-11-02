# Security policy

Please report security problems privately, not in a public issue:
[report a vulnerability](https://github.com/slidecraft-in/presentations-ai-mcp-server/security/advisories/new).

This covers the hosted MCP server at `https://api.presentations.ai/mcp`, the stdio wrapper and
Docker image in this repo, and the setup steps in these docs.

Describe what you found, how to reproduce it, and what someone could do with it. Don't include
real API keys or other people's data.

If an API key has been exposed, revoke it in the
[API keys dashboard](https://api.presentations.ai/#/apikeys) or with `DELETE /api-keys/current`,
then create a new one.
