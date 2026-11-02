# Presentations.AI MCP Server

Official Model Context Protocol server for [Presentations.AI](https://www.presentations.ai).
Create designed slide decks from a topic or your notes, apply your brand, then share or
download them, from any MCP client.

## Endpoint

```
https://api.presentations.ai/mcp
```

| Property | Value |
|---|---|
| Transport | Streamable HTTP |
| Authentication | OAuth 2.1 with PKCE and dynamic client registration, or an API key |

A Presentations.AI account is required. Most clients open a browser to sign in the first
time they connect. Clients without OAuth support can send an API key instead:

```
Authorization: Bearer pai_live_...
```

Create a key at [api.presentations.ai](https://api.presentations.ai/#/apikeys).

## Tools

| Tool | Use it to |
|---|---|
| `create_presentation` | Generate a deck from a prompt, pasted text, or an edited outline, with optional audience, slide count, and brand kit. |
| `create_outline` | Draft an outline to review and edit before generating. Spends credits: 10 per slide. |
| `get_task` | Wait up to 60 s per call for generation to finish. |
| `get_export` | A download link for the finished file, valid for 15 minutes. |
| `share_deck` | A public link anyone can open, created when the user asks to share. |
| `search_brand_kits` | Find a brand to apply via `brand_kit_id`. |
| `whoami` | Identity, workspace, plan, and credit balance. |
| `list_decks` / `get_deck` / `list_projects` | Find and inspect existing work. |
| `patch_deck` / `delete_deck` | Rename, move, change visibility or content version, or delete a deck. |
| `create_grant` | Share a deck with a person by email. |

Source material goes in inline as text. File upload, admin, and usage operations are
REST-only; see the [API docs](https://docs.presentations.ai).

Clients that support the [MCP Skills extension](https://modelcontextprotocol.io/extensions/skills/overview)
also get two skills, `create-presentation` and `manage-presentations`.

Full reference: [docs.presentations.ai/docs/agents](https://docs.presentations.ai/docs/agents).

## Connect from your MCP client

- **Claude (claude.ai and Claude Desktop)**: [docs/clients/claude-desktop.md](docs/clients/claude-desktop.md)
- **Claude Code**: [docs/clients/claude-code.md](docs/clients/claude-code.md)
- **ChatGPT**: [docs/clients/chatgpt.md](docs/clients/chatgpt.md)
- **Cursor**: [docs/clients/cursor.md](docs/clients/cursor.md)
- **VS Code**: [docs/clients/vs-code.md](docs/clients/vs-code.md)
- **Cline**: [docs/clients/cline.md](docs/clients/cline.md)
- **Gemini CLI**: [docs/clients/gemini-cli.md](docs/clients/gemini-cli.md)

## Stdio wrapper

For clients that only run local servers, `src/index.js` forwards stdio to the hosted
endpoint with an API key. It needs Node.js 22 or later:

```bash
git clone https://github.com/slidecraft-in/presentations-ai-mcp-server
cd presentations-ai-mcp-server && npm ci
```

```json
{
  "mcpServers": {
    "presentations-ai": {
      "command": "node",
      "args": ["/path/to/presentations-ai-mcp-server/src/index.js"],
      "env": { "PRESENTATIONSAI_API_KEY": "pai_live_..." }
    }
  }
}
```

Or with Docker: `docker build -t presentations-ai-mcp .`, then
`docker run -i --rm -e PRESENTATIONSAI_API_KEY presentations-ai-mcp`.

Without a key, the wrapper lists the tools from `src/snapshot.json` and tool calls return
an error asking for one. To refresh the snapshot from the live server, run
`PRESENTATIONSAI_API_KEY=pai_live_... npm run snapshot`. Set `PRESENTATIONSAI_MCP_URL` to
read a different endpoint.

## Related repos

- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills): the `create-presentation` and `manage-presentations` Agent Skills
- [presentations-ai-gemini-extension](https://github.com/slidecraft-in/presentations-ai-gemini-extension): Gemini CLI extension with this server and both skills

## Support

`support@presentations.ai`

## License

MIT, see [LICENSE](LICENSE).
