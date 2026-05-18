# Connect from Claude Desktop / Claude.ai

Presentations.AI is available in Claude.ai and Claude Desktop as a Connector.

## Claude.ai (web)

1. Open **Settings → Connectors** at [claude.ai](https://claude.ai).
2. Click **Add custom connector**.
3. Enter the server URL:
   ```
   https://api.presentations.ai/mcp
   ```
4. Click **Connect** — a browser tab opens for Presentations.AI sign-in.
5. After authorization, the 5 tools become available in any chat.

> Presentations.AI is also listed in the official Claude Connectors Directory
> (review pending) so it can be added in one click without entering the URL.

## Claude Desktop

Add the connector via Settings → Connectors → Add custom connector with the
same URL above. OAuth completes in your default browser.

## Tools

| Tool | Purpose |
|---|---|
| `create_presentation_from_topic` | Full deck from a topic |
| `create_single_slide` | One designed slide on a topic |
| `create_presentation_from_content` | Deck from raw text |
| `create_presentation_from_file` | Deck from a source file (≤ 5 MB) |
| `check_job_status` | Poll an async job |

## Related

- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills) — Claude Code skill bundle for richer in-CLI guidance.
