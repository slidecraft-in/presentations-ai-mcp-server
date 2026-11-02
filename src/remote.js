import { readFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export const REMOTE_URL = checkedUrl(
  process.env.PRESENTATIONSAI_MCP_URL ||
    process.env.PAI_MCP_URL ||
    "https://api.presentations.ai/mcp",
);
export const API_KEY =
  process.env.PRESENTATIONSAI_API_KEY ||
  process.env.PRESENTATIONS_AI_API_KEY ||
  process.env.api_key ||
  "";
export const KEYS_URL = "https://api.presentations.ai/#/apikeys";

export const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

// The API key travels with every request, so only local test servers may use plain http.
function checkedUrl(value) {
  const url = new URL(value);
  if (url.protocol === "https:" || (url.protocol === "http:" && LOCAL_HOSTS.has(url.hostname))) {
    return url.href;
  }
  throw new Error(`PRESENTATIONSAI_MCP_URL must be an https URL, got ${url.protocol}//${url.host}`);
}

export async function connectRemote() {
  const client = new Client({ name: pkg.name, version: pkg.version });
  const transport = new StreamableHTTPClientTransport(new URL(REMOTE_URL), {
    requestInit: {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "User-Agent": `${pkg.name}/${pkg.version}`,
      },
    },
  });
  await client.connect(transport, { timeout: 15_000 });
  return client;
}
