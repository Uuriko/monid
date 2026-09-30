import { assertEquals } from "@std/assert";
import { fromFileUrl } from "@std/path";
import { loadFixture, runEndpoint, testSealedUnit } from "@shared/testing";

const fixturesDir = fromFileUrl(new URL("./fixtures/", import.meta.url));

Deno.test("project-room#public-work/match happy (synthetic): free — zero usage, recommendations ride through", async () => {
    const unit = await testSealedUnit("project-room#public-work/match");
    const fixture = await loadFixture(`${fixturesDir}synthetic-happy.json`);
    const result = await runEndpoint({
        unit,
        input: { body: { interests: ["documentation"], limit: 1 } },
        mode: "replay",
        fixture,
    });

    assertEquals(result.httpStatus, 200);
    assertEquals(result.isProviderError, false);
    assertEquals(result.usage, { credits: {}, evidence: {} });
    const output = result.output as Record<string, unknown>;
    const recs = output.recommendations as Record<string, unknown>[];
    assertEquals(recs.length, 1);
    assertEquals(output.claim, null);
    assertEquals(output.supportedRewards, ["volunteer"]);
});
