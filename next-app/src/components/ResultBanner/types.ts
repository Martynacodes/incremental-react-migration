import type { ArchiveResult } from "../../actions/archiveGroups";

export interface ResultBannerProps {
  result: ArchiveResult;
  nameFor: (id: string) => string;
}
