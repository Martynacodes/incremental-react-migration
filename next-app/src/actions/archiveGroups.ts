export interface ArchiveFailure {
  id: string;
  reason: string;
}

export interface ArchiveResult {
  succeeded: string[];
  failed: ArchiveFailure[];
}

// Runs one request per group and never lets a single failure hide the others.
// Promise.all would reject on the first error and lose the successes that
// already happened on the server; allSettled reports exactly what changed.
export const archiveGroups = async (
  ids: string[],
  archiveOne: (id: string) => Promise<unknown>
): Promise<ArchiveResult> => {
  const results = await Promise.allSettled(ids.map((id) => archiveOne(id)));

  return results.reduce<ArchiveResult>(
    (summary, result, index) => {
      if (result.status === "fulfilled") {
        summary.succeeded.push(ids[index]);
      } else {
        const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);

        summary.failed.push({ id: ids[index], reason });
      }

      return summary;
    },
    { succeeded: [], failed: [] }
  );
};
