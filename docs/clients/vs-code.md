# Connect from VS Code (GitHub Copilot agent mode)

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_server-0098FF)](https://vscode.dev/redirect/mcp/install?name=presentations-ai&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)

Or add it by hand to your workspace's `.vscode/mcp.json` or your user-level `mcp.json`:

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

When the server asks for sign-in, approve the request and sign in to Presentations.AI in
the browser.

## With an API key

VS Code prompts for the key once and keeps it out of the file:

```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "presentations-ai-key",
      "description": "Presentations.AI API key",
      "password": true
    }
  ],
  "servers": {
    "presentations-ai": {
      "type": "http",
      "url": "https://api.presentations.ai/mcp",
      "headers": { "Authorization": "Bearer ${input:presentations-ai-key}" }
    }
  }
}
```

The tools are listed in the [README](../../README.md#tools).

## Reference

- VS Code MCP docs: https://code.visualstudio.com/docs/agent-customization/mcp-servers
