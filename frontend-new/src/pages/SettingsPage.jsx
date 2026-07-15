import { Database, Server, Settings } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

function SettingsPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Settings</h2>
          <p>Review the frontend connection and LexIntel workspace configuration.</p>
        </div>
      </section>

      <div className="settings-grid">
        <section className="panel settings-card">
          <Server size={19} />
          <div>
            <span className="eyebrow">API CONNECTION</span>
            <h3>FastAPI backend</h3>
            <p>{apiUrl}</p>
          </div>
        </section>
        <section className="panel settings-card">
          <Database size={19} />
          <div>
            <span className="eyebrow">RETRIEVAL</span>
            <h3>Qdrant parent-child RAG</h3>
            <p>Top-20 vector retrieval, parent deduplication, cross-encoder reranking, top-5 grounded context.</p>
          </div>
        </section>
        <section className="panel settings-card">
          <Settings size={19} />
          <div>
            <span className="eyebrow">FRONTEND SESSION</span>
            <h3>Local UI state</h3>
            <p>Document lists, activity, and risk views reflect uploads and analyses performed in the current browser session.</p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

export default SettingsPage;
