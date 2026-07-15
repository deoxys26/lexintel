import { useMemo, useState } from "react";
import { uploadContract, analyzeContract } from "./api/contractApi";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import DocumentUploadModal from "./components/documents/DocumentUploadModal";
import SourcePreview from "./components/analysis/SourcePreview";
import Drawer from "./components/ui/Drawer";
import RiskDetailsDrawer from "./components/risk/RiskDetailsDrawer";
import OverviewPage from "./pages/OverviewPage";
import DocumentsPage from "./pages/DocumentsPage";
import AnalysisPage from "./pages/AnalysisPage";
import AskPage from "./pages/AskPage";
import RiskReviewPage from "./pages/RiskReviewPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import {
  buildRiskFindings,
  parseAnalysisSections,
} from "./utils/analysisParser";
import "./App.css";

const pageMeta = {
  overview: { title: "Overview", breadcrumb: "Workspace" },
  documents: { title: "Documents", breadcrumb: "Workspace / Documents" },
  analysis: { title: "Contract Analysis", breadcrumb: "Documents / Contract Analysis" },
  ask: { title: "Ask LexIntel", breadcrumb: "Workspace / Research" },
  risks: { title: "Risk Review", breadcrumb: "Analysis / Risk Review" },
  activity: { title: "Activity", breadcrumb: "Workspace / Activity" },
  settings: { title: "Settings", breadcrumb: "Workspace / Settings" },
  help: { title: "Help & Documentation", breadcrumb: "Workspace / Help" },
};

const formatBytes = (bytes = 0) => {
  if (!bytes) return "PDF document";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const formatActivityTime = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

const severityWeight = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const severityTone = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "low",
};

function App() {
  const [activePage, setActivePage] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [activeDocumentId, setActiveDocumentId] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Upload a legal PDF, then ask a focused question. LexIntel will retrieve, rerank, and cite the indexed document sources used for the answer.",
      sources: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedRisk, setSelectedRisk] = useState(null);

  const risks = useMemo(
    () => buildRiskFindings(analysisHistory),
    [analysisHistory],
  );

  const enrichedDocuments = useMemo(
    () =>
      documents.map((document) => {
        const documentRisks = risks.filter((risk) => risk.document === document.name);
        const highestRisk = documentRisks.reduce((highest, current) => {
          if (!highest) return current.severity;
          return severityWeight[current.severity] > severityWeight[highest]
            ? current.severity
            : highest;
        }, null);

        return {
          ...document,
          riskLabel: highestRisk || "Not assessed",
          riskTone: highestRisk ? severityTone[highestRisk] : "neutral",
        };
      }),
    [documents, risks],
  );

  const activeDocument = useMemo(
    () =>
      enrichedDocuments.find((document) => document.id === activeDocumentId) ||
      enrichedDocuments[0] ||
      null,
    [activeDocumentId, enrichedDocuments],
  );

  const latestAnalysis = useMemo(() => {
    if (analysisHistory.length === 0) return null;
    if (!activeDocument) return analysisHistory[0];

    return (
      analysisHistory.find((entry) =>
        entry.sources?.some((source) => source.filename === activeDocument.name),
      ) || analysisHistory[0]
    );
  }, [activeDocument, analysisHistory]);

  const addActivity = (activity) => {
    const now = new Date();
    setActivities((previous) => [
      {
        id: `${activity.type}-${now.getTime()}-${Math.random().toString(16).slice(2)}`,
        ...activity,
        createdAt: now.toISOString(),
        timeLabel: formatActivityTime(now),
      },
      ...previous,
    ]);
  };

  const handleUpload = async (file, onUploadProgress) => {
    const data = await uploadContract(file, onUploadProgress);
    const now = new Date();
    const childChunks = data.child_chunks_created ?? data.chunks_created ?? 0;
    const documentId = `${data.filename || file.name}-${now.getTime()}`;

    const document = {
      id: documentId,
      name: data.filename || file.name,
      pages: data.pages_extracted ?? 0,
      parentChunks: data.parent_chunks_created ?? 0,
      childChunks,
      status: childChunks > 0 ? "Indexed" : "Needs Review",
      sizeLabel: formatBytes(file.size),
      uploadedAt: now.toISOString(),
      uploadedLabel: "just now",
      backendMessage: data.message,
    };

    setDocuments((previous) => [document, ...previous]);
    setActiveDocumentId(documentId);
    setActivePage("analysis");
    setMessages((previous) => [
      ...previous,
      {
        role: "ai",
        content: `${document.name} was processed by the backend. ${data.message || "The document is ready for grounded analysis."}`,
        sources: [],
      },
    ]);

    addActivity({
      type: "upload",
      title: "Document indexed",
      description: `${document.name} · ${document.pages || 0} pages · ${childChunks} child chunks`,
    });

    return data;
  };

  const handleAnalyze = async (query) => {
    if (!query.trim() || loading) return null;

    setLoading(true);
    setMessages((previous) => [
      ...previous,
      { role: "user", content: query, sources: [] },
    ]);

    try {
      const data = await analyzeContract(query);
      const sources = data.sources || [];
      const sections = parseAnalysisSections(data.analysis || "");
      const now = new Date();
      const firstSourceDocument = sources[0]?.filename;
      const sourceDocument = enrichedDocuments.find(
        (document) => document.name === firstSourceDocument,
      );

      if (sourceDocument) setActiveDocumentId(sourceDocument.id);

      const entry = {
        id: `analysis-${now.getTime()}`,
        query,
        analysis: data.analysis || "No analysis text was returned.",
        sources,
        sections,
        documentName: firstSourceDocument || activeDocument?.name || "Indexed documents",
        createdAt: now.toISOString(),
        sessionQuestionCount: analysisHistory.length + 1,
      };

      setAnalysisHistory((previous) => [entry, ...previous]);
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content: entry.analysis,
          sources,
        },
      ]);

      addActivity({
        type: "analysis",
        title: "Grounded analysis completed",
        description: `${query} · ${sources.length} retrieved source${sources.length === 1 ? "" : "s"}`,
      });

      return data;
    } catch (error) {
      const detail = error?.response?.data?.detail;
      setMessages((previous) => [
        ...previous,
        {
          role: "ai",
          content:
            detail ||
            "Analysis failed. Check the FastAPI backend, Gemini configuration, and Qdrant connection before trying again.",
          sources: [],
        },
      ]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocument = (documentId) => {
    setActiveDocumentId(documentId);
    setActivePage("analysis");
  };

  const commonOverviewProps = {
    documents: enrichedDocuments,
    analysisHistory,
    risks,
    loading,
    onOpenUpload: () => setUploadOpen(true),
    onNavigate: setActivePage,
    onOpenDocument: handleOpenDocument,
    onOpenRisk: setSelectedRisk,
  };

  const renderPage = () => {
    switch (activePage) {
      case "documents":
        return (
          <DocumentsPage
            documents={enrichedDocuments}
            onOpenUpload={() => setUploadOpen(true)}
            onOpenDocument={handleOpenDocument}
          />
        );
      case "analysis":
        return (
          <AnalysisPage
            activeDocument={activeDocument}
            latestAnalysis={latestAnalysis}
            messages={messages}
            loading={loading}
            onAnalyze={handleAnalyze}
            onOpenUpload={() => setUploadOpen(true)}
            onSelectSource={setSelectedSource}
            risks={risks}
          />
        );
      case "ask":
        return (
          <AskPage
            documents={enrichedDocuments}
            messages={messages}
            loading={loading}
            onAnalyze={handleAnalyze}
            onOpenUpload={() => setUploadOpen(true)}
            onSelectSource={setSelectedSource}
          />
        );
      case "risks":
        return <RiskReviewPage risks={risks} onNavigate={setActivePage} />;
      case "activity":
        return <ActivityPage activities={activities} />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPage />;
      case "overview":
      default:
        return <OverviewPage {...commonOverviewProps} />;
    }
  };

  const meta = pageMeta[activePage] || pageMeta.overview;

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />
      {mobileNavOpen ? (
        <button
          type="button"
          className="mobile-nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="app-main">
        <Header
          title={meta.title}
          breadcrumb={meta.breadcrumb}
          documents={enrichedDocuments}
          analysisHistory={analysisHistory}
          onNavigate={setActivePage}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        {renderPage()}
      </div>

      <DocumentUploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

      <Drawer
        open={Boolean(selectedSource)}
        onClose={() => setSelectedSource(null)}
        title={selectedSource?.filename || "Source preview"}
        eyebrow="RETRIEVED SOURCE"
      >
        {selectedSource ? <SourcePreview source={selectedSource} /> : null}
        <div className="legal-disclaimer">
          This preview reflects the text returned by the current analysis API. The backend does not yet expose a PDF viewer URL for direct page scrolling.
        </div>
      </Drawer>

      <RiskDetailsDrawer
        open={Boolean(selectedRisk)}
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onOpenDocument={() => {
          const document = enrichedDocuments.find(
            (item) => item.name === selectedRisk?.document,
          );
          if (document) setActiveDocumentId(document.id);
          setSelectedRisk(null);
          setActivePage("analysis");
        }}
      />
    </div>
  );
}

export default App;
