import { useState, version } from "react";
import { useDispatch } from "react-redux";

import { archiveGroups } from "../../actions/archiveGroups";
import { useHost } from "../../host/context";
import { useGroups } from "../../hooks/useGroups";
import { groupsArchived } from "../../store/groupsSlice";

import { GroupTable } from "../../components/GroupTable";
import { ResultBanner } from "../../components/ResultBanner";

import type { ArchiveResult } from "../../actions/archiveGroups";

// The view is the data layer: it calls hooks and passes plain props down.
export const ViewGroups = () => {
  const dispatch = useDispatch();
  const { bridge, callbacks } = useHost();
  const { groups, loading, error, refresh } = useGroups();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isArchiving, setIsArchiving] = useState(false);
  const [lastResult, setLastResult] = useState<ArchiveResult | null>(null);

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const archiveSelected = async () => {
    setIsArchiving(true);
    const result = await archiveGroups([...selectedIds], (id) => bridge.fetch("POST", `/groups/${id}/archive`));

    // Update the shared store only for what the server actually changed.
    dispatch(groupsArchived(result.succeeded));
    // Keep failures selected so a retry is one click.
    setSelectedIds(new Set(result.failed.map((failure) => failure.id)));
    setLastResult(result);
    setIsArchiving(false);
  };

  const nameFor = (id: string) => groups.find((group) => group.id === id)?.name ?? id;

  return (
    <section className="view">
      <div className="view-header">
        <h2>Groups</h2>
        <span className="tag">rendered by &lt;next-app&gt;: React {version}</span>
      </div>

      {loading && groups.length === 0 && <p className="hint">Loading groups...</p>}
      {error && (
        <div className="banner error">
          {error} <button onClick={refresh}>Retry</button>
        </div>
      )}

      {groups.length > 0 && <GroupTable groups={groups} selectedIds={selectedIds} onToggle={toggle} />}

      <div className="actions">
        <button className="primary" disabled={selectedIds.size === 0 || isArchiving} onClick={archiveSelected}>
          {isArchiving ? "Archiving..." : `Archive selected (${selectedIds.size})`}
        </button>
        <button className="secondary" onClick={() => callbacks.navigate("experiments")}>
          Back to experiments (host router)
        </button>
      </div>

      {lastResult && <ResultBanner result={lastResult} nameFor={nameFor} />}
    </section>
  );
};
