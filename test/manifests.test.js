import { test } from "node:test";
import assert from "node:assert/strict";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readJson } from "./helpers.js";

// Network checks: the published schemas and the registry's version list.
const server = readJson("server.json");
const glama = readJson("glama.json");

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 200, `GET ${url}`);
  return response.json();
}

async function assertValid(document) {
  const ajv = new Ajv({ strict: false, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(await fetchJson(document.$schema));
  assert.ok(validate(document), JSON.stringify(validate.errors, null, 2));
}

test("server.json matches the MCP Registry schema", () => assertValid(server));

test("glama.json matches Glama's schema", () => assertValid(glama));

test("server.json uses a version the registry doesn't have yet, or matches the published one", async () => {
  const name = encodeURIComponent(server.name);
  const { servers } = await fetchJson(`https://registry.modelcontextprotocol.io/v0.1/servers/${name}/versions`);
  const published = servers.find((entry) => entry.server.version === server.version);
  if (published) {
    assert.deepEqual(published.server, server, `version ${server.version} is already published with different content; bump it`);
  }
});
