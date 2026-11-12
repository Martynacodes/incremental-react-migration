import type { ComponentType } from "react";

import { ViewGroups } from "./Groups";

// Every migrated page is registered here and picked with <next-app view="...">.
export const views: Record<string, ComponentType> = {
  Groups: ViewGroups,
};
