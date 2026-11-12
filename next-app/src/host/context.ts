import { createContext, useContext } from "react";

import type { HostContextValue } from "./types";

export const HostContext = createContext<HostContextValue | null>(null);

export const useHost = (): HostContextValue => {
  const value = useContext(HostContext);

  if (!value) {
    throw new Error("useHost must be used inside <next-app>");
  }

  return value;
};
