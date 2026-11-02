import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { ROOT, readJson, readText } from "./helpers.js";

const snapshot = readJson("src/snapshot.json");
const endpoint = readJson("server.json").remotes[0].url;
const docs = [
  "README.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  ...readdirSync(join(ROOT, "docs/clients")).map((name) => `docs/clients/${name}`),
];
const publicText = [...docs, "server.json", "glama.json", "package.json", "src/index.js", "src/remote.js", "scripts/snapshot.js"];

test("the README tool table lists exactly the tools in the snapshot", () => {
  const section = readText("README.md").split("\n## Tools\n")[1].split("\n## ")[0];
  const documented = section
    .split("\n")
    .filter((line) => line.startsWith("| `"))
    .flatMap((line) => [...line.split("|")[1].matchAll(/`([a-z_]+)`/g)].map((match) => match[1]));
  assert.deepEqual(documented.sort(), snapshot.tools.map((tool) => tool.name).sort());
});

test("every MCP endpoint in the docs is the one in server.json", () => {
  let found = 0;
  for (const path of publicText) {
    for (const [url] of readText(path).matchAll(/https?:\/\/[a-z0-9.-]*presentations\.ai\/mcp[^\s"'`)<>\]]*/g)) {
      assert.equal(url, endpoint, `${path} mentions ${url}`);
      found += 1;
    }
  }
  assert.ok(found > 0);
});

test("VS Code install links point at the endpoint", () => {
  let found = 0;
  for (const path of docs) {
    for (const [link] of readText(path).matchAll(/https:\/\/vscode\.dev\/redirect\/mcp\/install\?[^)\s]+/g)) {
      const config = JSON.parse(new URL(link).searchParams.get("config"));
      assert.deepEqual(config, { type: "http", url: endpoint }, path);
      found += 1;
    }
  }
  assert.ok(found > 0);
});

test("Cursor install links point at the endpoint", () => {
  let found = 0;
  for (const path of docs) {
    for (const [link] of readText(path).matchAll(/https:\/\/cursor\.com\/en\/install-mcp\?[^)\s]+/g)) {
      const params = new URL(link).searchParams;
      assert.equal(params.get("name"), "presentations-ai", path);
      assert.deepEqual(JSON.parse(Buffer.from(params.get("config"), "base64").toString()), { url: endpoint }, path);
      found += 1;
    }
  }
  assert.ok(found > 0);
});

test("every JSON example parses", () => {
  for (const path of docs) {
    for (const [, block] of readText(path).matchAll(/```json\n([\s\S]*?)```/g)) {
      assert.doesNotThrow(() => JSON.parse(block), path);
    }
  }
});

test("examples don't use third-party placeholder company names", () => {
  const names = /\b(acme|contoso|fabrikam|globex|initech|northwind)\b/i;
  for (const path of publicText) assert.doesNotMatch(readText(path), names, path);
});

test("relative links and anchors resolve", () => {
  const anchors = (path) =>
    new Set(
      [...readText(path).matchAll(/^#+ (.+)$/gm)].map(([, heading]) =>
        heading.trim().toLowerCase().replace(/[^\w\- ]/g, "").replace(/ /g, "-"),
      ),
    );
  for (const path of docs) {
    for (const [, target] of readText(path).matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^[a-z]+:/.test(target)) continue;
      const [file, fragment] = target.split("#");
      const resolved = file ? join(dirname(path), file) : path;
      assert.ok(existsSync(join(ROOT, resolved)), `${path} links to missing ${resolved}`);
      if (fragment) assert.ok(anchors(resolved).has(fragment), `${path} links to missing #${fragment}`);
    }
  }
});
