# Connect from Cline (VS Code)

Cline supports remote MCP servers via its MCP settings panel.

## Configuration

1. Open the **Cline** sidebar in VS Code.
2. Click the MCP servers icon → **Edit MCP Settings**.
3. Add an entry under `mcpServers`:

```json
{
  "mcpServers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp",
      "type": "streamableHttp"
    }
  }
}
```

4. Save. Cline reconnects and opens a browser for Presentations.AI OAuth on
   first tool call.

## Tools available

- `create_presentation_from_topic`
- `create_single_slide`
- `create_presentation_from_content`
- `create_presentation_from_file` (≤ 5 MB)
- `check_job_status`

## Reference

- Cline MCP docs: https://docs.cline.bot/mcp-servers/configuring-mcp-servers
- Presentations.AI API reference: https://console.presentations.ai/apiref/docs/
