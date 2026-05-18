# Connect from VS Code (GitHub Copilot Chat + MCP)

VS Code (1.95+) supports MCP servers through GitHub Copilot Chat's agent mode.

## Configuration

Add to your workspace's `.vscode/mcp.json` or user-level `mcp.json`:

```json
{
  "servers": {
    "presentations-ai": {
      "type": "http",
      "url": "https://api.presentations.ai/mcp"
    }
  }
}
```

Reload VS Code. In agent mode, the 5 Presentations.AI tools appear in the
tool picker. On first invocation, a browser opens for OAuth sign-in.

## Tools available

- `create_presentation_from_topic`
- `create_single_slide`
- `create_presentation_from_content`
- `create_presentation_from_file` (≤ 5 MB)
- `check_job_status`

## Reference

- VS Code MCP docs: https://code.visualstudio.com/docs/copilot/chat/mcp-servers
- Presentations.AI API reference: https://console.presentations.ai/apiref/docs/
