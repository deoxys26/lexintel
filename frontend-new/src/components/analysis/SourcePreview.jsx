import { FileText } from "lucide-react";

function SourcePreview({ source, index = 0 }) {
  if (!source) return null;

  const score = Number.isFinite(Number(source.score))
    ? `${Math.round(Number(source.score) * 100)}% similarity`
    : "Similarity unavailable";

  return (
    <article className="source-preview">
      <div className="source-preview__eyebrow">SOURCE {String(index + 1).padStart(2, "0")}</div>
      <div className="source-preview__header">
        <div className="source-preview__file-icon">
          <FileText size={18} strokeWidth={1.7} />
        </div>
        <div>
          <strong>{source.filename || "Unknown document"}</strong>
          <span>
            Page {source.page ?? "—"} · {score}
          </span>
        </div>
      </div>
      <blockquote>
        {source.text || "No extracted source text was returned for this citation."}
      </blockquote>
      <div className="source-preview__meta">
        Chunk {source.chunk_index ?? "—"} · Retrieved from indexed document sources
      </div>
    </article>
  );
}

export default SourcePreview;
