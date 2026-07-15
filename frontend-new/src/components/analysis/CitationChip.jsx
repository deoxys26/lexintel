function CitationChip({ source, onSelect }) {
  if (!source) return null;

  return (
    <button
      type="button"
      className="citation-chip"
      onClick={() => onSelect?.(source)}
      title={`Open source from ${source.filename || "document"}`}
    >
      [Page {source.page ?? "—"}]
    </button>
  );
}

export default CitationChip;
