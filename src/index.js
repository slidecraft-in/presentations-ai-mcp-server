import { readFileSync } from "node:fs";
import { StreamableHTTPError } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  CallToolResultSchema,
  ErrorCode,
  GetPromptRequestSchema,
  GetPromptResultSchema,
  ListPromptsRequestSchema,
  ListPromptsResultSchema,
  ListResourcesRequestSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesRequestSchema,
  ListResourceTemplatesResultSchema,
  ListToolsRequestSchema,
  ListToolsResultSchema,
  McpError,
  ReadResourceRequestSchema,
  ReadResourceResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { API_KEY, KEYS_URL, connectRemote, pkg } from "./remote.js";

// get_task waits up to 60 s per call and create_outline can take about 3 minutes.
const CALL_TIMEOUT_MS = 300_000;

const NO_KEY = `Set PRESENTATIONSAI_API_KEY to a Presentations.AI API key to use this server. Create one at ${KEYS_URL}.`;

const snapshot = JSON.parse(
  readFileSync(new URL("./snapshot.json", import.meta.url), "utf8"),
);

const LISTS = [
  [ListToolsRequestSchema, ListToolsResultSchema, "tools"],
  [ListPromptsRequestSchema, ListPromptsResultSchema, "prompts"],
  [ListResourcesRequestSchema, ListResourcesResultSchema, "resources"],
  [ListResourceTemplatesRequestSchema, ListResourceTemplatesResultSchema, "resourceTemplates"],
];

const CALLS = [
  [CallToolRequestSchema, CallToolResultSchema],
  [GetPromptRequestSchema, GetPromptResultSchema],
  [ReadResourceRequestSchema, ReadResourceResultSchema],
];

let upstream;

function remote() {
  upstream ??= connectRemote().catch((error) => {
    upstream = undefined;
    throw error;
  });
  return upstream;
}

const HTTP_MESSAGES = {
  401: `Presentations.AI rejected the API key (HTTP 401). Check PRESENTATIONSAI_API_KEY, or create a key at ${KEYS_URL}.`,
  403: "Presentations.AI refused the request (HTTP 403): the API key doesn't allow this action.",
  429: "Presentations.AI is limiting requests right now (HTTP 429). Wait a moment, then try again.",
};

function describe(error) {
  if (error instanceof StreamableHTTPError && HTTP_MESSAGES[error.code]) {
    return HTTP_MESSAGES[error.code];
  }
  const cause = error?.cause?.message ? ` (${error.cause.message})` : "";
  return `Presentations.AI request failed: ${error?.message ?? error}${cause}`;
}

function failure(method, text) {
  if (method === "tools/call") {
    return { content: [{ type: "text", text }], isError: true };
  }
  throw new McpError(ErrorCode.InternalError, text);
}

async function main() {
  let instructions = snapshot.instructions;
  if (API_KEY) {
    try {
      instructions = (await remote()).getInstructions() ?? instructions;
    } catch (error) {
      console.error(`${describe(error)} Serving the bundled tool list.`);
    }
  }

  const server = new Server(
    {
      name: "ai.presentations/presentations-ai",
      title: "Presentations.AI",
      version: pkg.version,
      websiteUrl: "https://www.presentations.ai",
    },
    { capabilities: { tools: {}, prompts: {}, resources: {} }, instructions },
  );

  for (const [requestSchema, resultSchema, key] of LISTS) {
    server.setRequestHandler(requestSchema, async (request, extra) => {
      if (API_KEY) {
        try {
          return await (await remote()).request(request, resultSchema, { signal: extra.signal });
        } catch (error) {
          if (error instanceof McpError) throw error;
          console.error(`${describe(error)} Serving the bundled ${key}.`);
        }
      }
      return { [key]: snapshot[key] };
    });
  }

  for (const [requestSchema, resultSchema] of CALLS) {
    server.setRequestHandler(requestSchema, async (request, extra) => {
      if (!API_KEY) return failure(request.method, NO_KEY);
      try {
        return await (await remote()).request(request, resultSchema, {
          signal: extra.signal,
          timeout: CALL_TIMEOUT_MS,
        });
      } catch (error) {
        if (error instanceof McpError) throw error;
        return failure(request.method, describe(error));
      }
    });
  }

  await server.connect(new StdioServerTransport());
}

// As PID 1 in a container, Node ignores SIGTERM unless it is handled.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => process.exit(0));
}

main().catch((error) => {
  console.error("Fatal MCP server error:", error);
  process.exit(1);
});
