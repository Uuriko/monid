import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const fixturesDir = fromFileUrl(new URL("./fixtures/", import.meta.url));

Deno.test("project-room#public-work/tasks happy (synthetic): free — zero usage, page rides through", async () => {
    const unit = await testSealedUnit("project-room#public-work/tasks");
    const fixture = await loadFixture(`${fixturesDir}synthetic-happy.json`);
    const result = await runEndpoint({
        unit,
        input: { queryParams: { limit: 2 } },
        mode: "replay",
        fixture,
    });

    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    const tasks = output.tasks as Record<string, unknown>[];
    assertEquals(tasks.length, 1);
    assertEquals(tasks[0].schema, "public-work-task/1");
    assertEquals(output.nextCursor, "pwt_01JABC");
});
