# Connect from Claude (claude.ai and Claude Desktop)

## Free, Pro, Max, and Ultra plans

1. In [claude.ai](https://claude.ai) or Claude Desktop, go to **Customize → Connectors**.
2. Click **+ Add**, then **Add custom connector**.
3. Enter a name (`Presentations.AI`) and the server URL:
   ```
   https://api.presentations.ai/mcp
   ```
4. Click **Continue**, review the detected sign-in settings, and click **Add**.
5. Click **Connect** and sign in to Presentations.AI.

Free plans can add one custom connector.

## Team and Enterprise plans

An Owner adds the connector once under **Organization settings → Connectors**: click
**Add**, choose **Custom → Web**, and enter the name and URL above. Each member then goes to
**Customize → Connectors**, finds Presentations.AI, and clicks **Connect**.

Turn the connector on in a chat from the **+** button, under **Connectors**. The tools are
listed in the [README](../../README.md#tools).

## Reference

- Claude Help Center: https://support.claude.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp

## Related

- [Claude Code](claude-code.md)
- [presentations-ai-skills](https://github.com/slidecraft-in/presentations-ai-skills): the `create-presentation` and `manage-presentations` Agent Skills
