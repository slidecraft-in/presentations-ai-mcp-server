import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as types from "@modelcontextprotocol/sdk/types.js";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const GOOD_KEY = "pai_test_good";

export const readJson = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
export const readText = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

export const MOCK_TOOLS = [
  {
    name: "echo",
    title: "Echo",
    description: "Echo the arguments.",
    inputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    outputSchema: { type: "object", properties: { text: { type: "string" } }, required: ["text"] },
    annotations: { readOnlyHint: true, destructiveHint: false },
    _meta: { fastmcp: { tags: ["x"] } },
  },
  { name: "fails", description: "A tool error.", inputSchema: { type: "object" } },
  { name: "slow", description: "Answers after 65 s.", inputSchema: { type: "object" } },
];

function mockMcpServer() {
  const server = new Server(
    { name: "mock", version: "0" },
    { capabilities: { tools: {}, prompts: {}, resources: {} }, instructions: "MOCK INSTRUCTIONS" },
  );
  server.setRequestHandler(types.ListToolsRequestSchema, async () => ({ tools: MOCK_TOOLS }));
  server.setRequestHandler(types.CallToolRequestSchema, async ({ params }) => {
    if (params.name === "echo") {
      const { text } = params.arguments;
      return { content: [{ type: "text", text }], structuredContent: { text } };
    }
    if (params.name === "fails") return { content: [{ type: "text", text: "deck not found" }], isError: true };
    if (params.name === "slow") {
      await new Promise((resolve) => setTimeout(resolve, 65_000));
      return { content: [{ type: "text", text: "slow done" }] };
    }
    throw new types.McpError(types.ErrorCode.InvalidParams, `Unknown tool: ${params.name}`);
  });
  server.setRequestHandler(types.ListPromptsRequestSchema, async () => ({
    prompts: [{ name: "p1", arguments: [{ name: "topic", required: true }] }],
  }));
  server.setRequestHandler(types.GetPromptRequestSchema, async ({ params }) => ({
    messages: [{ role: "user", content: { type: "text", text: `topic=${params.arguments.topic}` } }],
  }));
  server.setRequestHandler(types.ListResourcesRequestSchema, async () => ({
    resources: [{ uri: "skill://a/SKILL.md", name: "a", mimeType: "text/markdown" }],
  }));
  server.setRequestHandler(types.ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [{ uriTemplate: "presentation://decks/{deck_id}", name: "deck" }],
  }));
  server.setRequestHandler(types.ReadResourceRequestSchema, async ({ params }) => ({
    contents: [{ uri: params.uri, mimeType: "text/markdown", text: "# skill a" }],
  }));
  return server;
}

const STATUS_BY_KEY = { "Bearer pai_test_403": 403, "Bearer pai_test_429": 429 };

// A stateless Streamable HTTP server on a free port that accepts only GOOD_KEY.
export async function startMock() {
  const requests = [];
  const http = createServer(async (req, res) => {
    requests.push({ method: req.method, headers: req.headers });
    const status = STATUS_BY_KEY[req.headers.authorization];
    if (status) {
      res.writeHead(status, { "content-type": "application/json" }).end('{"error":"x"}');
      return;
    }
    if (req.headers.authorization !== `Bearer ${GOOD_KEY}`) {
      res.writeHead(401, { "content-type": "application/json", "www-authenticate": 'Bearer error="invalid_token"' });
      res.end('{"error":"invalid_token"}');
      return;
    }
    if (req.method !== "POST") {
      res.writeHead(405).end();
      return;
    }
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    const server = mockMcpServer();
    res.on("close", () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res);
  });
  await new Promise((resolve) => http.listen(0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${http.address().port}/mcp`,
    requests,
    close: () => new Promise((resolve) => http.close(resolve)),
  };
}

// Runs the wrapper over stdio with only the given environment.
export async function connectWrapper(env, command = [process.execPath, `${ROOT}/src/index.js`]) {
  const transport = new StdioClientTransport({
    command: command[0],
    args: command.slice(1),
    env: { PATH: process.env.PATH, ...env },
    stderr: "pipe",
  });
  let stderr = "";
  transport.stderr.on("data", (chunk) => (stderr += chunk));
  const client = new Client({ name: "test", version: "0" });
  await client.connect(transport);
  return { client, stderr: () => stderr };
}

export const resultText = (result) => result.content.map((item) => item.text).join(" ");
