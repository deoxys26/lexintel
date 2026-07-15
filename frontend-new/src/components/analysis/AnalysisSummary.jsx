import { CalendarDays, FileCheck2, MessageSquareText, ShieldAlert } from "lucide-react";
import ClauseFinding from "./ClauseFinding";
import { getSectionText, uniquePages } from "../../utils/analysisParser";

function AnalysisSummary({ analysisEntry, onSelectSource }) {
  if (!analysisEntry) return null;

  const { sections, sources = [] } = analysisEntry;
  const summary = getSectionText(sections?.summary);
  const importantPoints = sections?.importantPoints || [];
  const risks = sections?.risks || [];
  const pages = uniquePages(sources);

  const metrics = [
    { label: "Grounded sources", value: sources.length, icon: FileCheck2 },
    { label: "Risk findings", value: risks.length, icon: ShieldAlert },
    { label: "Referenced pages", value: pages.length, icon: CalendarDays },
    { label: "Questions in session", value: analysisEntry.sessionQuestionCount || 1, icon: MessageSquareText },
  ];

  return (
    <div className="analysis-summary">
      <section className="analysis-section analysis-section--summary">
        <span className="eyebrow">LEGAL ANALYSIS SUMMARY</span>
        <h3>Executive Summary</h3>
        <p>
          {summary ||
            "The latest grounded analysis is available below. Review the retrieved findings and source citations before reaching a legal conclusion."}
        </p>
      </section>

      <div className="analysis-metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div className="analysis-metric" key={label}>
            <Icon size={16} strokeWidth={1.7} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <section className="analysis-section">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow">KEY FINDINGS</span>
            <h3>Document observations</h3>
          </div>
          <span className="section-count">{importantPoints.length} findings</span>
        </div>

        <div className="finding-list">
          {importantPoints.length > 0 ? (
            importantPoints.map((finding, index) => (
              <ClauseFinding
                key={`${finding}-${index}`}
                title={finding}
                source={sources[index] || sources[0]}
                onSelectSource={onSelectSource}
              />
            ))
          ) : (
            <p className="section-empty-copy">
              Ask a focused contract question to populate grounded findings here.
            </p>
          )}
        </div>
      </section>

      {risks.length > 0 ? (
        <section className="analysis-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">REQUIRES LEGAL REVIEW</span>
              <h3>Potential contractual concerns</h3>
            </div>
            <span className="section-count">{risks.length} identified</span>
          </div>
          <div className="finding-list">
            {risks.map((risk, index) => (
              <ClauseFinding
                key={`${risk}-${index}`}
                label="Potential concern"
                title={risk}
                description="LexIntel surfaced this from the grounded response. Consider reviewing the cited source text and document context."
                source={sources[index] || sources[0]}
                onSelectSource={onSelectSource}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default AnalysisSummary;
