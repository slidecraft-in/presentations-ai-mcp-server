# Connect from Cursor

Add the server to `~/.cursor/mcp.json` (all projects) or `.cursor/mcp.json` (one project):

```json
{
  "mcpServers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp"
    }
  }
}
```

Cursor signs in with OAuth and registers itself with the server. Complete the
Presentations.AI sign-in when Cursor asks.

## With an API key

```json
{
  "mcpServers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp",
      "headers": { "Authorization": "Bearer pai_live_..." }
    }
  }
}
```

The tools are listed in the [README](../../README.md#tools).

## Reference

- Cursor MCP docs: https://cursor.com/docs/mcp
