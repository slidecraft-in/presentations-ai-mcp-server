# Presentations.AI MCP Server

Official Model Context Protocol server for [Presentations.AI](https://presentations.ai).
Create designed slide decks from a topic, text, or document via any MCP-compatible client.

## Endpoint

```
https://api.presentations.ai/mcp
```

| Property | Value |
|---|---|
| Transport | Streamable HTTP |
| Authentication | OAuth 2.0 with PKCE + Dynamic Client Registration |
| Protocol version | 2025-06-18 |

A Presentations.AI account is required. The server opens a browser for sign-in
on first connect; no API key handling on the client side.

## Tools

| Tool | Purpose |
|---|---|
| `create_presentation_from_topic` | Full deck from a topic / brief |
| `create_single_slide` | A single designed slide on a topic (image) |
| `create_presentation_from_content` | Deck from raw text — article, notes, transcript |
| `create_presentation_from_file` | Deck from PDF, DOCX, PPTX, TXT, or MD (≤ 5 MB) |
| `check_job_status` | Poll long-running async jobs |

For exact parameter shapes and exports (`pptx`, `pdf`, `image`, `share`, `render`),
see the [REST + MCP reference](https://console.presentations.ai/apiref/docs/).

## Connect from your MCP client

- **Claude Desktop / Claude.ai** — [docs/clients/claude-desktop.md](docs/clients/claude-desktop.md)
- **Cursor** — [docs/clients/cursor.md](docs/clients/cursor.md)
- **Cline** — [docs/clients/cline.md](docs/clients/cline.md)
- **VS Code** — [docs/clients/vs-code.md](docs/clients/vs-code.md)
- **Gemini CLI** — [docs/clients/gemini-cli.md](docs/clients/gemini-cli.md)

## Related repos

- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills) — Claude Code skill bundle
- [presentations-ai-gemini-extension](https://github.com/slidecraft-in/presentations-ai-gemini-extension) — Gemini CLI extension

## Support

`support@presentations.ai`

## License

MIT — see [LICENSE](LICENSE).
