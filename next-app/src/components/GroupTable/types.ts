import type { Group } from "../../types";

export interface GroupTableProps {
  groups: Group[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
}
