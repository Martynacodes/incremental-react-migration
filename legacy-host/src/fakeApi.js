// In-memory backend so the demo runs with no server.
// "Payments Squad" always fails to archive, to show partial-failure handling.

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const db = {
  experiments: [
    { id: "exp-1", name: "Checkout button color", status: "running" },
    { id: "exp-2", name: "Search ranking v2", status: "draft" },
    { id: "exp-3", name: "Onboarding email cadence", status: "completed" },
  ],
  groups: [
    { id: "g1", name: "Growth Team", members: 8, status: "active" },
    { id: "g2", name: "Search Squad", members: 5, status: "active" },
    { id: "g3", name: "Payments Squad", members: 6, status: "active" },
    { id: "g4", name: "Mobile Guild", members: 12, status: "active" },
  ],
};

export const fakeApi = async (method, url) => {
  await wait(300 + Math.random() * 400);

  if (method === "GET" && url === "/experiments") {
    return { status: 200, data: db.experiments };
  }

  if (method === "GET" && url === "/groups") {
    return { status: 200, data: db.groups };
  }

  const archiveMatch = url.match(/^\/groups\/(\w+)\/archive$/);

  if (method === "POST" && archiveMatch) {
    const group = db.groups.find((item) => item.id === archiveMatch[1]);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.id === "g3") {
      throw new Error("Server error: group owns running experiments");
    }

    group.status = "archived";

    return { status: 200, data: group };
  }

  throw new Error(`No route for ${method} ${url}`);
};
