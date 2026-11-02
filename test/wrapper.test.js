import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import { GOOD_KEY, MOCK_TOOLS, ROOT, connectWrapper, readJson, resultText, startMock } from "./helpers.js";

const snapshot = readJson("src/snapshot.json");
const pkg = readJson("package.json");

let mock;
before(async () => {
  mock = await startMock();
});
after(() => mock.close());

describe("without an API key", () => {
  test("serves the bundled snapshot and explains how to add a key", async () => {
    const before = mock.requests.length;
    const { client } = await connectWrapper({ PRESENTATIONSAI_MCP_URL: mock.url });
    try {
      assert.deepEqual(client.getServerVersion(), {
        name: "ai.presentations/presentations-ai",
        title: "Presentations.AI",
        version: pkg.version,
        websiteUrl: "https://www.presentations.ai",
      });
      assert.equal(client.getInstructions(), snapshot.instructions);
      assert.deepEqual((await client.listTools()).tools, snapshot.tools);
      assert.deepEqual((await client.listPrompts()).prompts, snapshot.prompts);
      assert.deepEqual((await client.listResources()).resources, snapshot.resources);
      assert.deepEqual((await client.listResourceTemplates()).resourceTemplates, snapshot.resourceTemplates);

      const result = await client.callTool({ name: "whoami", arguments: {} });
      assert.equal(result.isError, true);
      assert.match(resultText(result), /Set PRESENTATIONSAI_API_KEY/);
      await assert.rejects(client.readResource({ uri: "skill://create-presentation/SKILL.md" }), /Set PRESENTATIONSAI_API_KEY/);
      await assert.rejects(client.getPrompt({ name: "new_presentation", arguments: { topic: "x" } }), /Set PRESENTATIONSAI_API_KEY/);
      assert.equal(mock.requests.length, before, "no request may reach the remote");
    } finally {
      await client.close();
    }
  });
});

describe("with an API key", () => {
  test("forwards lists, calls, prompts and resources, and passes errors through", async () => {
    const { client } = await connectWrapper({ PRESENTATIONSAI_MCP_URL: mock.url, PRESENTATIONSAI_API_KEY: GOOD_KEY });
    try {
      assert.equal(client.getInstructions(), "MOCK INSTRUCTIONS");
      assert.deepEqual((await client.listTools()).tools, MOCK_TOOLS);
      const echo = await client.callTool({ name: "echo", arguments: { text: "hi" } });
      assert.deepEqual(echo.structuredContent, { text: "hi" });

      const fails = await client.callTool({ name: "fails", arguments: {} });
      assert.equal(fails.isError, true);
      assert.equal(resultText(fails), "deck not found");
      await assert.rejects(
        client.callTool({ name: "nope", arguments: {} }),
        (error) => error.code === ErrorCode.InvalidParams && /Unknown tool: nope/.test(error.message),
      );

      const prompt = await client.getPrompt({ name: "p1", arguments: { topic: "cats" } });
      assert.equal(prompt.messages[0].content.text, "topic=cats");
      assert.equal((await client.readResource({ uri: "skill://a/SKILL.md" })).contents[0].text, "# skill a");
      assert.equal((await client.listResourceTemplates()).resourceTemplates[0].uriTemplate, "presentation://decks/{deck_id}");
    } finally {
      await client.close();
    }
  });

  test("sends the key only as a Bearer token, with our User-Agent", () => {
    const posts = mock.requests.filter((request) => request.method === "POST");
    assert.ok(posts.length > 0);
    for (const { headers } of posts) {
      assert.equal(headers.authorization, `Bearer ${GOOD_KEY}`);
      assert.equal(headers["api-key"], undefined);
      assert.equal(headers["user-agent"], `${pkg.name}/${pkg.version}`);
    }
  });

  for (const name of ["PRESENTATIONS_AI_API_KEY", "api_key"]) {
    test(`still reads the older ${name} variable`, async () => {
      const { client } = await connectWrapper({ PAI_MCP_URL: mock.url, [name]: GOOD_KEY });
      try {
        const result = await client.callTool({ name: "echo", arguments: { text: name } });
        assert.equal(result.structuredContent.text, name);
      } finally {
        await client.close();
      }
    });
  }

  test("waits longer than the SDK's 60 s default for slow calls", { skip: !process.env.SLOW_TESTS, timeout: 120_000 }, async () => {
    const { client } = await connectWrapper({ PRESENTATIONSAI_MCP_URL: mock.url, PRESENTATIONSAI_API_KEY: GOOD_KEY });
    try {
      const result = await client.callTool({ name: "slow", arguments: {} }, undefined, { timeout: 120_000 });
      assert.equal(resultText(result), "slow done");
    } finally {
      await client.close();
    }
  });
});

describe("errors", () => {
  const cases = [
    ["pai_test_bad", /rejected the API key \(HTTP 401\)/],
    ["pai_test_403", /refused the request \(HTTP 403\)/],
    ["pai_test_429", /limiting requests right now \(HTTP 429\)/],
  ];
  for (const [key, message] of cases) {
    test(`maps ${message.source.match(/HTTP \d+/)[0]} to a clear message and keeps the snapshot listing`, async () => {
      const { client } = await connectWrapper({ PRESENTATIONSAI_MCP_URL: mock.url, PRESENTATIONSAI_API_KEY: key });
      try {
        assert.equal((await client.listTools()).tools.length, snapshot.tools.length);
        const result = await client.callTool({ name: "whoami", arguments: {} });
        assert.equal(result.isError, true);
        assert.match(resultText(result), message);
      } finally {
        await client.close();
      }
    });
  }

  test("reports an unreachable server as a tool error", async () => {
    const { client } = await connectWrapper({ PRESENTATIONSAI_MCP_URL: "http://127.0.0.1:9/mcp", PRESENTATIONSAI_API_KEY: GOOD_KEY });
    try {
      const result = await client.callTool({ name: "whoami", arguments: {} });
      assert.equal(result.isError, true);
      assert.match(resultText(result), /request failed/);
    } finally {
      await client.close();
    }
  });

  test("refuses a plain http URL that isn't local, without printing the key", () => {
    const run = spawnSync(process.execPath, [`${ROOT}/src/index.js`], {
      env: { PATH: process.env.PATH, PRESENTATIONSAI_MCP_URL: "http://example.com/mcp", PRESENTATIONSAI_API_KEY: GOOD_KEY },
      input: "",
      encoding: "utf8",
      timeout: 10_000,
    });
    assert.notEqual(run.status, 0);
    assert.match(run.stderr, /must be an https URL, got http:\/\/example\.com/);
    assert.ok(!`${run.stdout}${run.stderr}`.includes(GOOD_KEY));
  });
});
