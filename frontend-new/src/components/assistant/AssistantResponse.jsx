import CitationChip from "../analysis/CitationChip";
import { parseAnalysisSections } from "../../utils/analysisParser";

const sectionLabels = [
  ["summary", "Short summary"],
  ["importantPoints", "Important points found"],
  ["risks", "Risks or concerns"],
  ["recommendations", "Recommendations"],
];

function AssistantResponse({ content, sources = [], onSelectSource }) {
  const sections = parseAnalysisSections(content || "");
  const hasStructuredContent = sectionLabels.some(
    ([key]) => sections[key]?.length > 0,
  );

  if (!content) return null;

  return (
    <div className="assistant-response">
      {hasStructuredContent ? (
        sectionLabels.map(([key, label]) => {
          const lines = sections[key] || [];
          if (lines.length === 0) return null;

          return (
            <section key={key}>
              <h4>{label}</h4>
              {key === "summary" ? (
                <p>{lines.join(" ")}</p>
              ) : (
                <ul>
                  {lines.map((line, index) => (
                    <li key={`${line}-${index}`}>{line}</li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      ) : (
        <p className="assistant-response__plain">{content}</p>
      )}

      {sources.length > 0 ? (
        <div className="assistant-response__citations">
          <span>Grounded sources</span>
          <div>
            {sources.map((source, index) => (
              <CitationChip
                key={`${source.filename}-${source.page}-${source.chunk_index}-${index}`}
                source={source}
                onSelect={onSelectSource}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default AssistantResponse;
