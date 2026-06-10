import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const REMOTE_MCP_URL =
  process.env.PAI_MCP_URL || "https://api.presentations.ai/mcp";
const API_KEY =
  process.env.PRESENTATIONS_AI_API_KEY ||
  process.env.api_key ||
  "";

const EXPORT_TYPES = ["ppt", "pptx", "pdf", "image", "render", "share"];
const TARGET_AUDIENCES = [
  "executive-leadership",
  "general-employees",
  "clients-customers",
  "students-trainees",
  "technical-team",
  "general-audience",
];
const TONES = [
  "professional",
  "conversational",
  "authoritative",
  "persuasive",
  "educational",
];
const PRESERVATION_MODES = ["enhance", "preserve", "summarize", "instruction"];
const FILE_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-word",
  "text/plain",
  "text/markdown",
  "application/rtf",
];

function authHeaders() {
  if (!API_KEY) return {};
  return {
    "api-key": API_KEY,
    Authorization: `Bearer ${API_KEY}`,
  };
}

async function callRemoteTool(name, args) {
  const client = new Client(
    { name: "presentations-ai-mcp-wrapper", version: "1.0.0" },
    { capabilities: {} },
  );
  const transport = new StreamableHTTPClientTransport(
    new URL(REMOTE_MCP_URL),
    { requestInit: { headers: authHeaders() } },
  );
  try {
    await client.connect(transport);
    return await client.callTool({ name, arguments: args });
  } finally {
    await transport.close().catch(() => {});
    await client.close().catch(() => {});
  }
}

function errorResult(error) {
  const msg = error instanceof Error ? error.message : "Unknown upstream error";
  const guidance = API_KEY
    ? "If this persists, verify your API key is active at https://presentations.ai/dashboard."
    : "Set PRESENTATIONS_AI_API_KEY (or the api_key config field) to forward tool calls. Tool introspection works without credentials.";
  return {
    content: [
      { type: "text", text: `Presentations.AI upstream call failed: ${msg}` },
      { type: "text", text: guidance },
    ],
    isError: true,
  };
}

function forward(name) {
  return async (args) => {
    try {
      return await callRemoteTool(name, args);
    } catch (e) {
      return errorResult(e);
    }
  };
}

function registerTools(server) {
  server.registerTool(
    "create_presentation_from_topic",
    {
      description:
        "Generate a full AI-powered presentation from a topic or brief. Use when the caller has a subject line, headline, or short brief and wants a complete deck. Returns a job ID for async processing; poll check_job_status until status is completed, then use the returned docurl. For a single hero slide instead of a deck, use create_single_slide.",
      inputSchema: {
        topic: z
          .string()
          .min(1)
          .max(500)
          .describe("Topic, headline, or short brief that drives the deck."),
        slideCount: z
          .number()
          .int()
          .min(1)
          .max(50)
          .describe("Number of slides to generate (1-50)."),
        exportType: z
          .enum(EXPORT_TYPES)
          .describe(
            "Output format. Use 'share' for a viewer URL, 'pptx' for editable PowerPoint, 'pdf' for read-only, 'image' for thumbnails, 'render' for HTML.",
          ),
        language: z
          .string()
          .optional()
          .describe("ISO 639-1 language code (e.g. 'en', 'es'). Defaults to 'en'."),
        domain: z
          .string()
          .optional()
          .describe("Company domain (e.g. 'acme.com') for branding context."),
        target_audience: z
          .enum(TARGET_AUDIENCES)
          .optional()
          .describe("Audience profile that shapes vocabulary and depth."),
        tone: z
          .enum(TONES)
          .optional()
          .describe("Voice and register of the generated copy."),
        callback_url: z
          .string()
          .url()
          .optional()
          .describe(
            "HTTPS webhook the API will POST to when the job finishes. Mutually exclusive with polling.",
          ),
        immediatePollUrl: z
          .boolean()
          .optional()
          .describe(
            "When true, returns a jobId immediately for polling via check_job_status. When false, blocks until generation completes.",
          ),
      },
    },
    forward("create_presentation_from_topic"),
  );

  server.registerTool(
    "create_single_slide",
    {
      description:
        "Generate a single AI-designed slide from a topic. Use for hero slides, social-media graphics, or one-off visuals. For a full multi-slide deck, use create_presentation_from_topic. Returns a job ID; poll check_job_status until status is completed. Faster than full-deck generation (typically 20-40 seconds).",
      inputSchema: {
        topic: z
          .string()
          .min(1)
          .max(500)
          .describe("Subject of the slide."),
        exportType: z
          .enum(EXPORT_TYPES)
          .describe(
            "Output format. 'image' gives a PNG, 'pptx' an editable slide, 'share' a viewer URL.",
          ),
        language: z
          .string()
          .optional()
          .describe("ISO 639-1 language code. Defaults to 'en'."),
        domain: z
          .string()
          .optional()
          .describe("Company domain for branding context."),
        target_audience: z
          .enum(TARGET_AUDIENCES)
          .optional()
          .describe("Audience profile."),
        tone: z.enum(TONES).optional().describe("Voice and register."),
        callback_url: z
          .string()
          .url()
          .optional()
          .describe("HTTPS webhook posted when the job finishes."),
      },
    },
    forward("create_single_slide"),
  );

  server.registerTool(
    "create_presentation_from_content",
    {
      description:
        "Transform raw text (articles, notes, transcripts, reports, outlines) into a polished presentation. Use when the caller has prose or notes already and wants a deck built from that source material. Honor preservationMode: 'preserve' keeps the structure and auto-counts slides, 'enhance' rewrites for clarity, 'summarize' condenses, 'instruction' uses topic as a directive. For file uploads (PDF/DOCX/PPTX) use create_presentation_from_file. Returns a job ID; poll check_job_status.",
      inputSchema: {
        content: z
          .string()
          .min(1)
          .describe(
            "Raw text content (markdown supported). The source material the deck is built from.",
          ),
        exportType: z
          .enum(EXPORT_TYPES)
          .describe("Output format. See create_presentation_from_topic for options."),
        preservationMode: z
          .enum(PRESERVATION_MODES)
          .optional()
          .describe(
            "How to handle the content. 'enhance'/'summarize'/'instruction' require slideCount; 'preserve' auto-determines slide count. Defaults to 'enhance'.",
          ),
        slideCount: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe(
            "Number of slides. Omit when preservationMode is 'preserve' (auto). Required for all other modes.",
          ),
        topic: z
          .string()
          .optional()
          .describe(
            "Title override, or instruction text when preservationMode is 'instruction'.",
          ),
        language: z
          .string()
          .optional()
          .describe("ISO 639-1 language code. Defaults to 'en'."),
        domain: z
          .string()
          .optional()
          .describe("Company domain for branding context."),
        target_audience: z
          .enum(TARGET_AUDIENCES)
          .optional()
          .describe("Audience profile."),
        tone: z.enum(TONES).optional().describe("Voice and register."),
        callback_url: z
          .string()
          .url()
          .optional()
          .describe("HTTPS webhook posted when the job finishes."),
      },
    },
    forward("create_presentation_from_content"),
  );

  server.registerTool(
    "create_presentation_from_file",
    {
      description:
        "Convert an uploaded document (PDF, Word, PowerPoint, plain text, markdown, RTF) into a presentation. Use when the caller already has a source document. Max 5 MB after base64 encoding. Supports the same preservation modes as create_presentation_from_content. For pasted raw text use create_presentation_from_content. Returns a job ID; poll check_job_status.",
      inputSchema: {
        file_data: z
          .string()
          .describe(
            "Base64-encoded file contents. Max 5 MB encoded size.",
          ),
        file_name: z
          .string()
          .describe("Original filename including extension."),
        mime_type: z
          .enum(FILE_MIME_TYPES)
          .describe(
            "MIME type of the source document. Must match the file extension.",
          ),
        exportType: z
          .enum(EXPORT_TYPES)
          .describe("Output format. See create_presentation_from_topic for options."),
        preservationMode: z
          .enum(PRESERVATION_MODES)
          .optional()
          .describe(
            "How to handle the content. 'preserve' auto-counts slides; other modes need slideCount.",
          ),
        slideCount: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Number of slides. Required unless preservationMode is 'preserve'."),
        topic: z
          .string()
          .optional()
          .describe(
            "Title override, or instruction text when preservationMode is 'instruction'.",
          ),
        language: z
          .string()
          .optional()
          .describe("ISO 639-1 language code. Defaults to 'en'."),
        domain: z
          .string()
          .optional()
          .describe("Company domain for branding context."),
        target_audience: z
          .enum(TARGET_AUDIENCES)
          .optional()
          .describe("Audience profile."),
        tone: z.enum(TONES).optional().describe("Voice and register."),
        callback_url: z
          .string()
          .url()
          .optional()
          .describe("HTTPS webhook posted when the job finishes."),
      },
    },
    forward("create_presentation_from_file"),
  );

  server.registerTool(
    "check_job_status",
    {
      description:
        "Poll for the result of an async presentation job. Use after any create_* call that returned a jobId. Safe to call repeatedly; does not consume job state. Recommended cadence: wait 55-60 seconds before the first poll, then every 30-35 seconds. Most jobs complete within 2 minutes. When status is 'completed', the response includes docurl (viewer link), docid (numeric ID), and optionally animated_url and thumbnailUrl. When status is 'failed', the response includes an error field. While 'processing', keep polling.",
      inputSchema: {
        jobId: z
          .string()
          .min(1)
          .describe(
            "The job ID returned from a create_* call when immediatePollUrl=true or when callback_url was omitted.",
          ),
      },
    },
    forward("check_job_status"),
  );
}

async function main() {
  const server = new McpServer(
    { name: "ai.presentations/presentations-ai", version: "1.0.0" },
    { capabilities: { logging: {} } },
  );
  registerTools(server);
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal MCP server error:", err);
  process.exit(1);
});
