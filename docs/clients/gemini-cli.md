# Connect from Gemini CLI

Use the official extension — one command installs the manifest and wires up
the MCP server.

## One-line install

```
gemini extensions install https://github.com/slidecraft-in/presentations-ai-gemini-extension
```

On first connect, Gemini CLI opens a browser for Presentations.AI OAuth
sign-in (PKCE + Dynamic Client Registration; no API key needed).

## Manual configuration

If you prefer to edit `~/.gemini/settings.json` directly:

```json
{
  "mcpServers": {
    "presentations-ai": {
      "httpUrl": "https://api.presentations.ai/mcp",
      "timeout": 120000
    }
  }
}
```

## Tools available

- `create_presentation_from_topic`
- `create_single_slide`
- `create_presentation_from_content`
- `create_presentation_from_file` (≤ 5 MB)
- `check_job_status`

## Reference

- Extension repo: https://github.com/slidecraft-in/presentations-ai-gemini-extension
- Gemini CLI MCP docs: https://geminicli.com/docs/tools/mcp-server/
- Presentations.AI API reference: https://console.presentations.ai/apiref/docs/
