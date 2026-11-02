# Connect from Visual Studio (GitHub Copilot agent mode)

Requires Visual Studio 2026, or Visual Studio 2022 version 17.14 or later.

[![Install in Visual Studio](https://img.shields.io/badge/Visual_Studio-Install_server-C16FDE)](https://vs-open.link/mcp-install?%7B%22name%22%3A%22presentations-ai%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)

Or add the server by hand to `<SOLUTIONDIR>\.mcp.json` (one solution) or `%USERPROFILE%\.mcp.json`
(all solutions):

```json
{
  "servers": {
    "presentations-ai": {
      "url": "https://api.presentations.ai/mcp"
    }
  }
}
```

Save the file, select **Authentication Required** in the CodeLens above the server, and sign in
to Presentations.AI.

The tools are listed in the [README](../../README.md#tools).

## Reference

- Visual Studio MCP docs: https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers
