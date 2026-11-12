// The groups page has been migrated to the new app, which dispatches
// Redux Toolkit actions ("groups/<reducerName>"). The legacy store must
// understand those action types so both apps read the same state.
// This file is the contract between the two apps.

const initialState = { items: [], loading: false, error: null };

export const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "groups/setLoading":
      return { ...state, loading: action.payload, error: null };
    case "groups/setGroups":
      return { ...state, items: action.payload, loading: false };
    case "groups/setError":
      return { ...state, error: action.payload, loading: false };
    case "groups/groupsArchived": {
      const archivedIds = new Set(action.payload);

      return {
        ...state,
        items: state.items.map((group) =>
          archivedIds.has(group.id) ? { ...group, status: "archived" } : group
        ),
      };
    }
    default:
      return state;
  }
};
