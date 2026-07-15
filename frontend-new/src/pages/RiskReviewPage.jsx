import { Filter, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import RiskTable from "../components/risk/RiskTable";
import RiskDetailsDrawer from "../components/risk/RiskDetailsDrawer";

const severityFilters = ["All Risks", "Critical", "High", "Medium", "Low"];

function RiskReviewPage({ risks, onNavigate }) {
  const [severity, setSeverity] = useState("All Risks");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [documentFilter, setDocumentFilter] = useState("All documents");
  const [sortBy, setSortBy] = useState("Newest first");

  const documentOptions = useMemo(
    () => ["All documents", ...new Set(risks.map((risk) => risk.document))],
    [risks],
  );

  const filteredRisks = useMemo(() => {
    const result = risks.filter((risk) => {
      const matchesSeverity = severity === "All Risks" || risk.severity === severity;
      const matchesDocument = documentFilter === "All documents" || risk.document === documentFilter;
      return matchesSeverity && matchesDocument;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "Oldest first") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [documentFilter, risks, severity, sortBy]);

  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Risk Review</h2>
          <p>Review AI-identified concerns that may require legal attention.</p>
        </div>
      </section>

      <section className="panel panel--flush">
        <div className="risk-filter-bar">
          <div className="filter-tabs filter-tabs--inline">
            {severityFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={severity === filter ? "is-active" : ""}
                onClick={() => setSeverity(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="risk-filter-controls">
            <label>
              <Filter size={14} />
              <select value={documentFilter} onChange={(event) => setDocumentFilter(event.target.value)}>
                {documentOptions.map((document) => (
                  <option key={document}>{document}</option>
                ))}
              </select>
            </label>
            <label>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
            </label>
          </div>
        </div>

        {filteredRisks.length > 0 ? (
          <RiskTable risks={filteredRisks} onOpenRisk={setSelectedRisk} />
        ) : (
          <EmptyState
            icon={ShieldAlert}
            title="No risk findings in this view"
            description="Risk Review is populated from the Risks or Concerns section of real LexIntel analysis responses. Ask a risk-focused question to surface grounded concerns."
          />
        )}
      </section>

      <RiskDetailsDrawer
        open={Boolean(selectedRisk)}
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onOpenDocument={() => {
          setSelectedRisk(null);
          onNavigate("analysis");
        }}
      />
    </PageContainer>
  );
}

export default RiskReviewPage;
