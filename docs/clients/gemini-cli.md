# Connect from Gemini CLI

## Extension

```bash
gemini extensions install https://github.com/slidecraft-in/presentations-ai-gemini-extension
```

The extension adds the server and two skills, `create-presentation` and
`manage-presentations`.

## Manual configuration

```bash
gemini mcp add --transport http presentations-ai https://api.presentations.ai/mcp
```

Or edit `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "presentations-ai": {
      "httpUrl": "https://api.presentations.ai/mcp"
    }
  }
}
```

On first connect, Gemini CLI finds the sign-in endpoints, registers itself, and opens a
browser for Presentations.AI sign-in.

## With an API key

```json
{
  "mcpServers": {
    "presentations-ai": {
      "httpUrl": "https://api.presentations.ai/mcp",
      "headers": { "Authorization": "Bearer pai_live_..." }
    }
  }
}
```

This stores the key in plain text in `settings.json`, so keep the file private and out of
version control. Signing in with a browser avoids storing a key.

The tools are listed in the [README](../../README.md#tools).

## Reference

- Gemini CLI MCP docs: https://geminicli.com/docs/tools/mcp-server/
