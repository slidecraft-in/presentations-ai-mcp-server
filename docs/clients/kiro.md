# Connect from Kiro

[![Install in Kiro](https://img.shields.io/badge/Kiro-Install_server-9046FF)](https://kiro.dev/launch/mcp/add?name=presentations-ai&config=%7B%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)

Kiro asks you to confirm before it changes your configuration.

Or add the server by hand to `~/.kiro/settings/mcp.json` (all workspaces) or
`.kiro/settings/mcp.json` (one workspace):

```json
{
  "mcpServers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp"
    }
  }
}
```

When Kiro connects, it registers itself with the server and opens the Presentations.AI sign-in
page in your browser.

The tools are listed in the [README](../../README.md#tools).

## Reference

- Kiro MCP docs: https://kiro.dev/docs/mcp/configuration/
