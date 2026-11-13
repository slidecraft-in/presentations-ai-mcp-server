# Connect from VS Code (GitHub Copilot agent mode)

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_server-0098FF)](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522presentations-ai%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fapi.presentations.ai%252Fmcp%2522%257D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_server-24bfa5)](https://vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522presentations-ai%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fapi.presentations.ai%252Fmcp%2522%257D)

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
