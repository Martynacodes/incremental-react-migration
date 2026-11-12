export interface Group {
  id: string;
  name: string;
  members: number;
  status: "active" | "archived";
}

export interface GroupsState {
  items: Group[];
  loading: boolean;
  error: string | null;
}

// The slice of the host store this app is allowed to read.
export interface SharedState {
  groups: GroupsState;
}
