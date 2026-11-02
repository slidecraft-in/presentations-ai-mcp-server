import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export const REMOTE_URL =
  process.env.PRESENTATIONSAI_MCP_URL ||
  process.env.PAI_MCP_URL ||
  "https://api.presentations.ai/mcp";
export const API_KEY =
  process.env.PRESENTATIONSAI_API_KEY ||
  process.env.PRESENTATIONS_AI_API_KEY ||
  process.env.api_key ||
  "";
export const KEYS_URL = "https://api.presentations.ai/#/apikeys";

export const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

export async function connectRemote() {
  const client = new Client({ name: pkg.name, version: pkg.version });
  const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
    requestInit: { headers: { Authorization: `Bearer ${API_KEY}` } },
  });
  await client.connect(transport, { timeout: 15_000 });
  return client;
}
