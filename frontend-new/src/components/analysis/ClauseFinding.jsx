import { ArrowUpRight } from "lucide-react";
import CitationChip from "./CitationChip";

function ClauseFinding({ title, description, source, label = "Key finding", onSelectSource }) {
  return (
    <article className="finding-row">
      <div className="finding-row__content">
        <span className="eyebrow">{label}</span>
        <h4>{title}</h4>
        {description ? <p>{description}</p> : null}
        <div className="finding-row__meta">
          {source ? (
            <>
              <span>{source.filename || "Indexed document"}</span>
              <CitationChip source={source} onSelect={onSelectSource} />
            </>
          ) : (
            <span>Generated from the latest grounded analysis</span>
          )}
        </div>
      </div>
      {source ? (
        <button
          type="button"
          className="icon-button finding-row__open"
          aria-label="View source"
          onClick={() => onSelectSource?.(source)}
        >
          <ArrowUpRight size={17} />
        </button>
      ) : null}
    </article>
  );
}

export default ClauseFinding;
