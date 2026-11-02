# Connect from Cline

## Cline CLI

Run `cline mcp`, choose **Add server**, and enter the URL with the Streamable HTTP transport:

```
https://api.presentations.ai/mcp
```

Then choose **Authorize OAuth** and sign in to Presentations.AI in the browser.

## Cline extension, with an API key

1. In the **Cline** panel, click the **MCP Servers** icon in the top toolbar.
2. Open the **Configure** tab and click **Configure MCP Servers**.
3. Add an entry under `mcpServers`:

```json
{
  "mcpServers": {
    "presentations-ai": {
      "type": "streamableHttp",
      "url": "https://api.presentations.ai/mcp",
      "headers": { "Authorization": "Bearer pai_live_..." }
    }
  }
}
```

Keep `"type": "streamableHttp"`: without it Cline falls back to the legacy SSE transport.
Create the API key at [api.presentations.ai](https://api.presentations.ai/#/apikeys).

The tools are listed in the [README](../../README.md#tools).

## Reference

- Cline MCP docs: https://docs.cline.bot/mcp/mcp-overview
