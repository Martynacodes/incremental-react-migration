import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHost } from "../host/context";
import { setError, setGroups, setLoading } from "../store/groupsSlice";

import type { Group, SharedState } from "../types";

export const useGroups = () => {
  const dispatch = useDispatch();
  const { bridge } = useHost();
  const { items, loading, error } = useSelector((state: SharedState) => state.groups);

  const refresh = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const response = await bridge.fetch<Group[]>("GET", "/groups");

      dispatch(setGroups(response.data));
    } catch (caught) {
      dispatch(setError(caught instanceof Error ? caught.message : "Failed to load groups"));
    }
  }, [bridge, dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { groups: items, loading, error, refresh };
};
