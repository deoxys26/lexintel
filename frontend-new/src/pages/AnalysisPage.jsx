import {
  CalendarDays,
  Download,
  FileText,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import AnalysisSummary from "../components/analysis/AnalysisSummary";
import ClauseFinding from "../components/analysis/ClauseFinding";
import LexIntelPanel from "../components/assistant/LexIntelPanel";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

const workspaceSections = [
  "Summary",
  "Key Clauses",
  "Risks",
  "Obligations",
  "Dates & Deadlines",
  "Ask Questions",
  "Sources",
];

const tabs = ["Overview", "Clauses", "Risks", "Timeline"];

function AnalysisPage({
  activeDocument,
  latestAnalysis,
  messages,
  loading,
  onAnalyze,
  onOpenUpload,
  onSelectSource,
  risks,
}) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [activeSection, setActiveSection] = useState("Summary");

  const riskPages = useMemo(
    () =>
      new Set(
        risks
          .filter((risk) => !activeDocument || risk.document === activeDocument.name)
          .map((risk) => String(risk.page)),
      ),
    [activeDocument, risks],
  );

  if (!activeDocument) {
    return (
      <PageContainer className="page-container--centered">
        <EmptyState
          icon={FileText}
          title="No document selected"
          description="Upload a PDF to create a parent-child document index and open the legal analysis workspace."
          action={<Button onClick={onOpenUpload}>Upload Document</Button>}
        />
      </PageContainer>
    );
  }

  const pageCount = Math.max(Number(activeDocument.pages) || 0, 0);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const sources = latestAnalysis?.sources || [];
  const sections = latestAnalysis?.sections;

  const renderTab = () => {
    if (!latestAnalysis) {
      return (
        <EmptyState
          icon={FileText}
          title="Document indexed and ready"
          description="Ask LexIntel a focused question to retrieve the most relevant child chunks, rerank them, and generate a source-grounded analysis."
          action={
            <Button onClick={() => onAnalyze("Summarise this document and identify important risks or concerns.")} disabled={loading}>
              Run initial analysis
            </Button>
          }
        />
      );
    }

    if (activeTab === "Overview") {
      return <AnalysisSummary analysisEntry={latestAnalysis} onSelectSource={onSelectSource} />;
    }

    if (activeTab === "Clauses") {
      const points = sections?.importantPoints || [];
      return (
        <section className="analysis-section analysis-tab-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">KEY CLAUSES & POINTS</span>
              <h3>Grounded document findings</h3>
            </div>
            <span className="section-count">{points.length} findings</span>
          </div>
          <div className="finding-list">
            {points.map((point, index) => (
              <ClauseFinding
                key={`${point}-${index}`}
                title={point}
                source={sources[index] || sources[0]}
                onSelectSource={onSelectSource}
              />
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === "Risks") {
      const riskLines = sections?.risks || [];
      return (
        <section className="analysis-section analysis-tab-section">
          <div className="section-heading-row">
            <div>
              <span className="eyebrow">POTENTIAL CONTRACTUAL EXPOSURE</span>
              <h3>Risks or concerns</h3>
            </div>
            <span className="section-count">{riskLines.length} identified</span>
          </div>
          {riskLines.length > 0 ? (
            <div className="finding-list">
              {riskLines.map((risk, index) => (
                <ClauseFinding
                  key={`${risk}-${index}`}
                  label="Requires legal review"
                  title={risk}
                  description="Review the cited source and the wider agreement context before drawing a legal conclusion."
                  source={sources[index] || sources[0]}
                  onSelectSource={onSelectSource}
                />
              ))}
            </div>
          ) : (
            <p className="section-empty-copy">The latest grounded response did not return a risk or concern item.</p>
          )}
        </section>
      );
    }

    return (
      <EmptyState
        icon={CalendarDays}
        title="No structured timeline extracted yet"
        description="The current backend returns grounded analysis text and sources, not a dedicated deadline schema. Ask LexIntel about dates or deadlines to review them from retrieved pages."
        action={
          <Button variant="secondary" onClick={() => onAnalyze("What important dates, deadlines, notice periods, or renewal windows are stated in the document?")} disabled={loading}>
            Ask about deadlines
          </Button>
        }
      />
    );
  };

  return (
    <PageContainer className="analysis-workspace-page">
      <div className="analysis-workspace">
        <aside className="document-navigator">
          <div className="document-navigator__file">
            <div className="document-navigator__icon">
              <FileText size={19} strokeWidth={1.7} />
            </div>
            <div>
              <strong>{activeDocument.name}</strong>
              <span>{activeDocument.pages || "—"} pages · PDF</span>
            </div>
          </div>

          <div className="document-navigator__status">
            <span className="status-dot" />
            {activeDocument.status}
          </div>

          <nav className="document-section-nav" aria-label="Document workspace sections">
            {workspaceSections.map((section) => (
              <button
                type="button"
                key={section}
                className={activeSection === section ? "is-active" : ""}
                onClick={() => {
                  setActiveSection(section);
                  if (section === "Risks") setActiveTab("Risks");
                  if (section === "Key Clauses" || section === "Obligations") setActiveTab("Clauses");
                  if (section === "Dates & Deadlines") setActiveTab("Timeline");
                  if (section === "Summary") setActiveTab("Overview");
                  if (section === "Ask Questions") document.querySelector(".question-input textarea")?.focus();
                }}
              >
                {section}
              </button>
            ))}
          </nav>

          <div className="document-pages-header">
            <span>DOCUMENT PAGES</span>
            <span>{pageCount}</span>
          </div>
          <div className="document-pages-list">
            {pages.length > 0 ? (
              pages.map((page) => (
                <button type="button" key={page} onClick={() => {
                  const source = sources.find((item) => Number(item.page) === page);
                  if (source) onSelectSource(source);
                }}>
                  <span>Page {page}</span>
                  {riskPages.has(String(page)) ? <i className="page-risk-indicator" title="Risk finding references this page" /> : null}
                </button>
              ))
            ) : (
              <p>Page metadata unavailable.</p>
            )}
          </div>
        </aside>

        <section className="analysis-center-panel">
          <header className="document-review-header">
            <div>
              <h2>{activeDocument.name.replace(/\.pdf$/i, "")}</h2>
              <p>
                {activeDocument.pages || "—"} pages <span>·</span> Indexed {activeDocument.uploadedLabel} <span>·</span> PDF
              </p>
            </div>
            <div className="document-review-actions">
              <Button variant="secondary" size="sm" disabled title="Original files are stored by the backend; no download endpoint currently exists">
                <Download size={15} /> Download
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onAnalyze("Reanalyse the indexed document and provide a concise summary, important points, risks or concerns, and recommendations.")}
                disabled={loading}
              >
                <RefreshCw size={15} /> Reanalyse
              </Button>
              <button type="button" className="icon-button" aria-label="More document actions" disabled title="Additional document actions require backend support">
                <MoreHorizontal size={17} />
              </button>
            </div>
          </header>

          <div className="analysis-tabs" role="tablist" aria-label="Analysis views">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                className={activeTab === tab ? "is-active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="analysis-center-scroll">{renderTab()}</div>
        </section>

        <LexIntelPanel
          messages={messages}
          onAnalyze={onAnalyze}
          loading={loading}
          indexedPages={activeDocument.pages || 0}
          onSelectSource={onSelectSource}
        />
      </div>
    </PageContainer>
  );
}

export default AnalysisPage;
