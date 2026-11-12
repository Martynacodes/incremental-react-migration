import type { GroupTableProps } from "./types";

// Presentation only: no hooks that fetch, no store access.
export const GroupTable = ({ groups, selectedIds, onToggle }: GroupTableProps) => (
  <table className="table">
    <thead>
      <tr>
        <th aria-label="Select" />
        <th>Group</th>
        <th>Members</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {groups.map((group) => {
        const isArchived = group.status === "archived";

        return (
          <tr key={group.id} className={isArchived ? "muted" : ""}>
            <td>
              <input
                type="checkbox"
                aria-label={`Select ${group.name}`}
                checked={selectedIds.has(group.id)}
                disabled={isArchived}
                onChange={() => onToggle(group.id)}
              />
            </td>
            <td>{group.name}</td>
            <td>{group.members}</td>
            <td>
              <span className={`pill ${group.status}`}>{group.status}</span>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
