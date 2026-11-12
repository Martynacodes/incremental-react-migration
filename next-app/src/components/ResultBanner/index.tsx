import type { ResultBannerProps } from "./types";

export const ResultBanner = ({ result, nameFor }: ResultBannerProps) => {
  const total = result.succeeded.length + result.failed.length;
  const tone = result.failed.length === 0 ? "success" : result.succeeded.length === 0 ? "error" : "warning";

  return (
    <div className={`banner ${tone}`} role="status">
      <strong>
        Archived {result.succeeded.length} of {total}.
      </strong>
      {result.failed.length > 0 && (
        <ul>
          {result.failed.map((failure) => (
            <li key={failure.id}>
              {nameFor(failure.id)}: {failure.reason} <em>(still selected, so you can retry)</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
