# Connect from Claude Code

```bash
claude mcp add --transport http presentationsai https://api.presentations.ai/mcp
```

Then run `/mcp` in Claude Code, pick `presentationsai`, and sign in to Presentations.AI in
the browser. To sign in from your shell instead, run `claude mcp login presentationsai`.

## With an API key

Set `PRESENTATIONSAI_API_KEY` in your environment, then run:

```bash
claude mcp add --transport http presentationsai https://api.presentations.ai/mcp \
  --header 'Authorization: Bearer ${PRESENTATIONSAI_API_KEY}'
```

The single quotes keep the reference as written. Claude Code reads the variable when it
loads the server, so the key isn't stored in its config.

The tools are listed in the [README](../../README.md#tools).

## Reference

- Claude Code MCP docs: https://code.claude.com/docs/en/mcp
