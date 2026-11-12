import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Group, GroupsState } from "../types";

const initialState: GroupsState = { items: [], loading: false, error: null };

// Defines the action creators. The *legacy* store reduces these action types
// (see legacy-host/src/reducers/groups.js), because the host owns the store.
const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
      state.error = null;
    },
    setGroups(state, action: PayloadAction<Group[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    groupsArchived(state, action: PayloadAction<string[]>) {
      const archivedIds = new Set(action.payload);

      state.items.forEach((group) => {
        if (archivedIds.has(group.id)) {
          group.status = "archived";
        }
      });
    },
  },
});

export const { setLoading, setGroups, setError, groupsArchived } = groupsSlice.actions;
export default groupsSlice.reducer;
