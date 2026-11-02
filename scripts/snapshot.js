import { writeFileSync } from "node:fs";
import { API_KEY, REMOTE_URL, connectRemote } from "../src/remote.js";

if (!API_KEY) {
  console.error("Set PRESENTATIONSAI_API_KEY to read the live tool list.");
  process.exit(1);
}

const client = await connectRemote().catch((error) => {
  console.error(`Could not connect to ${REMOTE_URL}: ${error.message}`);
  process.exit(1);
});

async function all(list, key) {
  const items = [];
  let cursor;
  do {
    const page = await list(cursor ? { cursor } : undefined);
    items.push(...page[key]);
    cursor = page.nextCursor;
  } while (cursor);
  return items;
}

const snapshot = {
  instructions: client.getInstructions() ?? "",
  tools: await all((p) => client.listTools(p), "tools"),
  prompts: await all((p) => client.listPrompts(p), "prompts"),
  resources: await all((p) => client.listResources(p), "resources"),
  resourceTemplates: await all((p) => client.listResourceTemplates(p), "resourceTemplates"),
};
await client.close();

writeFileSync(
  new URL("../src/snapshot.json", import.meta.url),
  `${JSON.stringify(snapshot, null, 2)}\n`,
);
const counts = Object.entries(snapshot)
  .filter(([, value]) => Array.isArray(value))
  .map(([key, value]) => `${key} ${value.length}`);
console.error(`Wrote src/snapshot.json from ${REMOTE_URL} (${counts.join(", ")}).`);
