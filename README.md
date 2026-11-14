# Presentations.AI MCP Server

[![CI](https://img.shields.io/github/actions/workflow/status/slidecraft-in/presentations-ai-mcp-server/ci.yml?branch=main&label=CI&logo=githubactions&logoColor=white)](https://github.com/slidecraft-in/presentations-ai-mcp-server/actions/workflows/ci.yml)
[![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0.1%2Fservers%2Fai.presentations%252Fpresentations-ai%2Fversions%2Flatest&query=%24.server.version&label=MCP%20Registry&logo=modelcontextprotocol)](https://registry.modelcontextprotocol.io/?q=ai.presentations%2Fpresentations-ai)
[![License](https://img.shields.io/github/license/slidecraft-in/presentations-ai-mcp-server?label=License)](LICENSE)

Official Model Context Protocol server for [Presentations.AI](https://www.presentations.ai).
Create designed slide decks from a topic or your notes, apply your brand, then share or
download them, from any MCP client.

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_server-0098FF)](https://vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522presentations-ai%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fapi.presentations.ai%252Fmcp%2522%257D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_server-24bfa5)](https://vscode.dev/redirect?url=vscode-insiders%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522presentations-ai%2522%252C%2522type%2522%253A%2522http%2522%252C%2522url%2522%253A%2522https%253A%252F%252Fapi.presentations.ai%252Fmcp%2522%257D)
[![Install in Visual Studio](https://img.shields.io/badge/Visual_Studio-Install_server-C16FDE)](https://vs-open.link/mcp-install?%7B%22name%22%3A%22presentations-ai%22%2C%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)
[![Install in Cursor](https://img.shields.io/badge/Cursor-Install_server-000000)](https://cursor.com/en/install-mcp?name=presentations-ai&config=eyJ1cmwiOiJodHRwczovL2FwaS5wcmVzZW50YXRpb25zLmFpL21jcCJ9)
[![Install in Kiro](https://img.shields.io/badge/Kiro-Install_server-9046FF)](https://kiro.dev/launch/mcp/add?name=presentations-ai&config=%7B%22url%22%3A%22https%3A%2F%2Fapi.presentations.ai%2Fmcp%22%7D)

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
| `create_presentation` | Generate a deck from a prompt, pasted text, or an edited outline, with optional audience, slide count, and brand kit. Repeating an identical request returns the same deck; change any input to get a new one. |
| `create_outline` | Draft an outline to review and edit before generating. Spends credits: 10 per slide, and the deck built from it bills its slides again. |
| `get_task` | Wait up to 50 s per call for generation to finish. |
| `get_export` | A download link for the finished file, valid for 15 minutes. |
| `share_deck` | A public link, created when the user asks to share: anyone with it, and everyone in the workspace, can view the deck. |
| `search_brand_kits` | Find a brand to apply via `brand_kit_id`. |
| `whoami` | Identity, workspace, plan, and credit balance. |
| `list_decks` / `get_deck` / `list_projects` | Find and inspect existing work. |
| `patch_deck` / `delete_deck` | Rename, move, change visibility or content version, or delete a deck. |
| `create_grant` | Share a deck with one person, by email address or user ID. |
| `send_feedback` | Send a note to the Presentations.AI team, only when the user asks or approves the exact message. |

Source material goes in inline as text, or as a file already uploaded through the REST API.
File upload, admin, and usage operations are REST-only; see the
[API docs](https://docs.presentations.ai).

Clients that support the [MCP Skills extension](https://modelcontextprotocol.io/extensions/skills/overview)
also get two skills, `create-presentation` and `manage-presentations`.

Full reference: [docs.presentations.ai/docs/agents](https://docs.presentations.ai/docs/agents).

Every tool's JSON Schema input and output, description, and MCP annotations
(`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) are in
[`src/snapshot.json`](src/snapshot.json).

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
- **Visual Studio**: [docs/clients/visual-studio.md](docs/clients/visual-studio.md)
- **Kiro**: [docs/clients/kiro.md](docs/clients/kiro.md)
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

## Limits and errors

| Limit | Value |
|---|---|
| Generation time | A few minutes |
| Prompt and pasted text | 200,000 characters each |

Requests are rate-limited. Over the limit, the endpoint answers `429` with `Retry-After`,
`X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. Wait until
`Retry-After`, then retry.

A tool that fails returns an error result with a message. The messages below come from the
tools the server runs itself, such as `create_presentation`, `get_export`, and `share_deck`.
Tools built on the REST API, such as `create_outline`, `list_decks`, and `get_deck`, return
the REST API's own message instead.

| Message | Meaning | What to do |
|---|---|---|
| `unauthenticated` | The account lost access during the call. | Sign in again, or use an active key. Retrying unchanged won't help. |
| `forbidden: the token's scopes do not permit this` | The account's access to that deck or project doesn't allow the action (for example, view-only access), or the connection is limited to another project. | Ask the deck's owner or a workspace admin for access, or work in the project the connection is limited to. |
| `this feature is not available on the workspace's plan` | The plan doesn't include the feature. | Change plan. |
| `insufficient credits to generate a deck` | The credit balance is 0 or below. | Add credits. `whoami` shows the balance. |
| `attached files are still being processed; retry shortly` | Sources aren't ready yet. | Retry after a short wait. |
| `request_id was already used for a different request; pass a new one` | A `request_id` was reused with different input. | Pass a new `request_id`. |

An expired sign-in, a revoked key, or a workspace suspended for non-payment never reaches a
tool: the endpoint answers `401`, and the client asks you to sign in again.

Retries: tools annotated `idempotentHint` are safe to repeat. Repeating an identical
`create_presentation` call returns the same deck rather than spending credits again; pass
a new `request_id` for another copy. `create_outline` takes a retry key, `request_id`:
retrying with the same `request_id` after the outline was delivered is refused and not
charged, and a new one drafts and charges another outline. REST error codes and retry rules
are in the [API reference](https://docs.presentations.ai/docs/api#errors-and-asynchronous-failures).

## Pricing

Only `create_presentation` and `create_outline` spend workspace credits. An outline costs 10
credits per slide, and a deck built from it bills its slides again. A deck costs, per slide, 5,
10 (the default), or 20 credits by quality tier (`budget_tier` `lite`, `standard`, or
`premium`). `deep_search` doubles that, and a PowerPoint export adds 5 per slide on plans that
don't include it. Credits stop a request only when the balance is already 0 or below, so a
large deck can take the balance below zero: `whoami` shows the plan and balance. Plans and
credit packs: [presentations.ai/pricing](https://www.presentations.ai/pricing).

## Data and security

- The server acts as the signed-in account, or the owner of the API key, within that
  account's permissions and the scopes the sign-in or key grants. Tools a connection isn't
  allowed to use are hidden.
- For read-only access, sign in with read scopes only (`workspace:read`, `projects:read`,
  `decks:read`, `brand_kits:read`, `credits:view`), or create an API key with the
  **Read-only** preset. The connection then sees only the tools that read, plus
  `send_feedback`.
- Seven tools only read. The other seven change, share, or send something and carry MCP's
  `destructiveHint` annotation, so clients can ask before running them:
  `create_presentation` and `create_outline` spend credits; `share_deck` creates a public
  link, so anyone who has it, and everyone in the workspace, can view the deck; `patch_deck`
  can change who can open a deck; `create_grant` shares a deck with a person; `delete_deck`
  moves a deck to trash; and `send_feedback` sends a note to the team.
- Download links from `get_export` and `get_deck` work without signing in and expire after
  15 minutes, so share them only with people who should have the file.
- Notes, documents, and web pages passed in are source material for the deck, not
  instructions to the server. They can still carry prompt-injection attempts aimed at the
  calling agent, so confirm with the user before `share_deck`, `create_grant`, a visibility
  change with `patch_deck`, or `delete_deck`, whatever the source text says.
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
| A deck is still generating | A deck usually takes a few minutes. The agent checks progress with `get_task`, up to 50 s per call. |
| A download link stopped working | Links expire after 15 minutes. Ask for the file again and `get_export` returns a fresh link. |
| The stdio wrapper lists tools but every call fails | Set `PRESENTATIONSAI_API_KEY` to an active key. |

## Related repos

- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills): the `create-presentation` and `manage-presentations` Agent Skills
- [presentations-ai-gemini-extension](https://github.com/slidecraft-in/presentations-ai-gemini-extension): Gemini CLI extension with this server and both skills

## Support

Email `support@presentations.ai` with the client you use, the tool that failed, when it
happened, and the error message. Never include an API key or an `Authorization` header.

More help: [docs.presentations.ai/docs/support](https://docs.presentations.ai/docs/support).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT, see [LICENSE](LICENSE).
