import { describe, expect, it } from "vitest";

import { archiveGroups } from "./archiveGroups";

describe("archiveGroups", () => {
  it("reports every success when all requests pass", async () => {
    const result = await archiveGroups(["a", "b"], async () => "ok");

    expect(result).toEqual({ succeeded: ["a", "b"], failed: [] });
  });

  it("keeps successes and reports each failure with its reason", async () => {
    const result = await archiveGroups(["a", "b", "c"], async (id) => {
      if (id === "b") {
        throw new Error("Server error");
      }

      return "ok";
    });

    expect(result.succeeded).toEqual(["a", "c"]);
    expect(result.failed).toEqual([{ id: "b", reason: "Server error" }]);
  });

  it("handles non-Error rejections", async () => {
    const result = await archiveGroups(["a"], () => Promise.reject("timeout"));

    expect(result.failed).toEqual([{ id: "a", reason: "timeout" }]);
  });

  it("returns empty lists for an empty selection", async () => {
    const result = await archiveGroups([], async () => "ok");

    expect(result).toEqual({ succeeded: [], failed: [] });
  });
});
