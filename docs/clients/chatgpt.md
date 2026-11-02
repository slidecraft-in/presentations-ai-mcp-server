# Connect from ChatGPT

1. Open [ChatGPT Plugins](https://chatgpt.com/plugins).
2. Select **+**, then **Add custom MCP server**.
3. Enter a name (`Presentations.AI`) and a short description.
4. Under **Connection**, choose **Public endpoint** and enter:
   ```
   https://api.presentations.ai/mcp
   ```
5. Configure authentication, review the risk warning, and select
   **I understand and want to continue**.
6. Select **Create as a plugin**, review the tools, and sign in to Presentations.AI when
   asked.

Account and workspace policies apply; a workspace admin may need to allow custom MCP
servers. The tools are listed in the [README](../../README.md#tools).

## Reference

- OpenAI docs: https://developers.openai.com/plugins/deploy/connect-chatgpt
