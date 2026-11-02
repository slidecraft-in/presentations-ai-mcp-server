# Presentations.AI MCP Server

Official Model Context Protocol server for [Presentations.AI](https://www.presentations.ai).
Create designed slide decks from a topic or your notes, apply your brand, then share or
download them, from any MCP client.

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_server-0098FF)](https://vscode.dev/redirect/mcp/install?name=presentations-ai&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)

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

## Example prompts

```
Make a 10-slide deck on our product roadmap for the leadership team.
Turn these meeting notes into a short deck: <paste notes>
Show me an outline first, then build the deck with the Presentations.AI brand kit.
Find my onboarding deck and give me a fresh download link.
Share my "Q3 results" deck with teammate@example.com as a viewer.
```

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

The client's config file then holds the key, so keep it private.

Or with Docker: `docker build -t presentations-ai-mcp .`, then
`docker run -i --rm --init -e PRESENTATIONSAI_API_KEY presentations-ai-mcp`, which passes
the key from your environment.

Without a key, the wrapper lists the tools from `src/snapshot.json` and tool calls return
an error asking for one. To refresh the snapshot from the live server, set
`PRESENTATIONSAI_API_KEY` in your environment and run `npm run snapshot`. Set
`PRESENTATIONSAI_MCP_URL` to read a different https endpoint.

## Data and security

- The server acts as the signed-in account, or the owner of the API key, within that
  account's permissions and the scopes the sign-in or key grants. Tools a connection isn't
  allowed to use are hidden.
- Seven tools only read. The other six change or share work and carry MCP's
  `destructiveHint` annotation, so clients can ask before running them:
  `create_presentation` and `create_outline` spend credits, `share_deck` creates a public
  link, `patch_deck` can change who can open a deck, `create_grant` shares a deck by email,
  and `delete_deck` moves a deck to trash.
- Download links from `get_export` and `get_deck` work without signing in and expire after
  15 minutes, so share them only with people who should have the file.
- Treat an API key like a password: keep it out of chats, code, and shared config files. If
  a key is exposed, revoke it in the [API keys dashboard](https://api.presentations.ai/#/apikeys)
  or with `DELETE /api-keys/current`, then create a new one.

See the [privacy policy](https://www.presentations.ai/privacy) and
[terms of service](https://www.presentations.ai/terms).

## Troubleshooting

| Problem | What to do |
|---|---|
| The client asks you to sign in again, or calls fail with 401 | Sign in from the client: `/mcp` in Claude Code, `/mcp auth presentations-ai` in Gemini CLI. With an API key, check that the key is still active in the [API keys dashboard](https://api.presentations.ai/#/apikeys). |
| Claude won't add another custom connector | Free plans allow one custom connector. |
| ChatGPT won't add the server | Workspace policies can restrict custom MCP servers. Ask your workspace admin. |
| A deck is still generating | A deck usually takes a few minutes. The agent checks progress with `get_task`, up to 60 s per call. |
| A download link stopped working | Links expire after 15 minutes. Ask for the file again and `get_export` returns a fresh link. |
| The stdio wrapper lists tools but every call fails | Set `PRESENTATIONSAI_API_KEY` to an active key. |

## Related repos

- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills): the `create-presentation` and `manage-presentations` Agent Skills
- [presentations-ai-gemini-extension](https://github.com/slidecraft-in/presentations-ai-gemini-extension): Gemini CLI extension with this server and both skills

## Support

Email `support@presentations.ai` with the client you use, the tool that failed, when it
happened, and the error message. Never include an API key or an `Authorization` header.

More help: [docs.presentations.ai/docs/support](https://docs.presentations.ai/docs/support).

## License

MIT, see [LICENSE](LICENSE).
