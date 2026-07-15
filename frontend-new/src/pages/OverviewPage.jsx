import {
  ArrowRight,
  FileText,
  MessageSquareText,
  SearchCheck,
  ShieldAlert,
  Upload,
} from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import DocumentTable from "../components/documents/DocumentTable";
import SeverityBadge from "../components/risk/SeverityBadge";

function OverviewPage({
  documents,
  analysisHistory,
  risks,
  loading,
  onOpenUpload,
  onNavigate,
  onOpenDocument,
  onOpenRisk,
}) {
  const highRiskCount = risks.filter((risk) =>
    ["Critical", "High"].includes(risk.severity),
  ).length;

  const metrics = [
    {
      label: "Documents Reviewed",
      value: documents.length,
      detail: documents.length ? "Indexed this session" : "No indexed documents",
      icon: FileText,
    },
    {
      label: "Active Analyses",
      value: loading ? 1 : 0,
      detail: loading ? "Grounded retrieval running" : "System ready",
      icon: SearchCheck,
    },
    {
      label: "High-Risk Clauses",
      value: highRiskCount,
      detail: "Explicit high/critical mentions",
      icon: ShieldAlert,
    },
    {
      label: "Questions Asked",
      value: analysisHistory.length,
      detail: "Grounded analysis requests",
      icon: MessageSquareText,
    },
  ];

  const recentDocuments = documents.slice(0, 5);
  const topRisks = risks.slice(0, 4);
  const counts = ["Critical", "High", "Medium", "Low"].map((severity) => ({
    severity,
    count: risks.filter((risk) => risk.severity === severity).length,
  }));
  const maxRiskCount = Math.max(...counts.map((item) => item.count), 1);

  return (
    <PageContainer>
      <section className="page-intro page-intro--overview">
        <div>
          <h2>Good morning, Phani</h2>
          <p>Review recent document activity and legal analysis insights.</p>
        </div>
        <Button onClick={onOpenUpload}>
          <Upload size={16} /> Upload Document
        </Button>
      </section>

      <section className="metric-grid" aria-label="Workspace metrics">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <article className="metric-card" key={label}>
            <div className="metric-card__topline">
              <span>{label}</span>
              <Icon size={16} strokeWidth={1.7} />
            </div>
            <strong>{value}</strong>
            <small>{detail}</small>
          </article>
        ))}
      </section>

      <div className="overview-grid">
        <section className="panel panel--flush">
          <header className="panel-header">
            <div>
              <h3>Recent Documents</h3>
              <p>Documents indexed through the current LexIntel session.</p>
            </div>
            <button type="button" className="text-link" onClick={() => onNavigate("documents")}>
              View all <ArrowRight size={14} />
            </button>
          </header>

          {recentDocuments.length > 0 ? (
            <DocumentTable documents={recentDocuments} onOpenDocument={onOpenDocument} />
          ) : (
            <EmptyState
              icon={FileText}
              title="No documents analysed yet"
              description="Upload a legal document to index its pages, retrieve relevant clauses, and ask source-grounded questions."
              action={<Button onClick={onOpenUpload}>Upload Document</Button>}
            />
          )}
        </section>

        <aside className="overview-side-stack">
          <section className="panel risk-overview-panel">
            <header className="panel-header panel-header--compact">
              <div>
                <h3>Risk Overview</h3>
                <p>AI-identified concerns from grounded responses.</p>
              </div>
            </header>

            <div className="risk-bars">
              {counts.map(({ severity, count }) => (
                <div className="risk-bar-row" key={severity}>
                  <div>
                    <span>{severity}</span>
                    <strong>{count}</strong>
                  </div>
                  <div className="risk-bar-track">
                    <span
                      className={`risk-bar-fill risk-bar-fill--${severity.toLowerCase()}`}
                      style={{ width: `${(count / maxRiskCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <header className="panel-header panel-header--compact">
              <div>
                <h3>Top Identified Risks</h3>
                <p>Review concerns surfaced by LexIntel.</p>
              </div>
            </header>

            {topRisks.length > 0 ? (
              <div className="compact-risk-list">
                {topRisks.map((risk) => (
                  <button key={risk.id} type="button" onClick={() => onOpenRisk(risk)}>
                    <SeverityBadge severity={risk.severity} />
                    <div>
                      <strong>{risk.title}</strong>
                      <span>{risk.document}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="small-empty-state">
                <ShieldAlert size={19} />
                <p>No risk findings yet. Ask LexIntel about liability, termination, obligations, or potential concerns.</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}

export default OverviewPage;
