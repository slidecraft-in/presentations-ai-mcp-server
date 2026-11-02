import { test } from "node:test";
import assert from "node:assert/strict";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import {
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesResultSchema,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readText } from "./helpers.js";

const raw = readText("src/snapshot.json");
const snapshot = JSON.parse(raw);

test("matches the MCP result schemas", () => {
  assert.equal(typeof snapshot.instructions, "string");
  assert.ok(snapshot.instructions.length > 0);
  ListToolsResultSchema.parse({ tools: snapshot.tools });
  ListPromptsResultSchema.parse({ prompts: snapshot.prompts });
  ListResourcesResultSchema.parse({ resources: snapshot.resources });
  ListResourceTemplatesResultSchema.parse({ resourceTemplates: snapshot.resourceTemplates });
});

test("every tool has a unique name, a title, safety hints, and valid JSON Schemas", () => {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const names = snapshot.tools.map((tool) => tool.name);
  assert.equal(new Set(names).size, names.length);
  for (const tool of snapshot.tools) {
    assert.ok(tool.title, `${tool.name} has a title`);
    assert.equal(typeof tool.annotations?.readOnlyHint, "boolean", `${tool.name} readOnlyHint`);
    assert.equal(typeof tool.annotations?.destructiveHint, "boolean", `${tool.name} destructiveHint`);
    assert.equal(tool.inputSchema.type, "object", `${tool.name} inputSchema`);
    ajv.compile(tool.inputSchema);
    if (tool.outputSchema) ajv.compile(tool.outputSchema);
  }
});

test("is stored in the format npm run snapshot writes", () => {
  assert.equal(raw, `${JSON.stringify(snapshot, null, 2)}\n`);
});

test("contains no keys, tokens, local hosts, or email addresses", () => {
  const patterns = [
    /pai_(live|test)_[A-Za-z0-9_-]{8,}/,
    /oat_[A-Za-z0-9_-]{8,}/,
    /localhost|127\.0\.0\.1|\.internal\b|\.local\b/,
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
  ];
  for (const pattern of patterns) assert.doesNotMatch(raw, pattern);
});
