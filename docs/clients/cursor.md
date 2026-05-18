# Connect from Cursor

Cursor supports remote MCP servers via `~/.cursor/mcp.json` (or per-workspace
`.cursor/mcp.json`).

## Configuration

```json
{
  "mcpServers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp"
    }
  }
}
```

Save the file and restart Cursor. On first use, Cursor opens a browser for
Presentations.AI OAuth sign-in.

## Tools available

- `create_presentation_from_topic`
- `create_single_slide`
- `create_presentation_from_content`
- `create_presentation_from_file` (≤ 5 MB)
- `check_job_status`

## Reference

- Cursor MCP docs: https://docs.cursor.com/context/model-context-protocol
- Presentations.AI API reference: https://console.presentations.ai/apiref/docs/
