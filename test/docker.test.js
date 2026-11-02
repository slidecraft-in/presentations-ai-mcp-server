import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { connectWrapper, readJson, resultText } from "./helpers.js";

// Runs only when CI (or you) sets DOCKER_IMAGE to an image built from this repo.
const image = process.env.DOCKER_IMAGE;
const snapshot = readJson("src/snapshot.json");

test("the image lists the tools without a key", { skip: !image }, async () => {
  const { client } = await connectWrapper({}, ["docker", "run", "-i", "--rm", image]);
  try {
    assert.equal((await client.listTools()).tools.length, snapshot.tools.length);
    const result = await client.callTool({ name: "whoami", arguments: {} });
    assert.match(resultText(result), /Set PRESENTATIONSAI_API_KEY/);
  } finally {
    await client.close();
  }
});

test("the image writes nothing but MCP messages to stdout", { skip: !image }, () => {
  const run = spawnSync("docker", ["run", "-i", "--rm", image], { input: "", encoding: "utf8", timeout: 60_000 });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(run.stdout, "");
});
