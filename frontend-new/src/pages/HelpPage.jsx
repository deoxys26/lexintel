import { BookOpen, FileSearch, HelpCircle, ShieldCheck } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";

function HelpPage() {
  const items = [
    {
      icon: BookOpen,
      title: "Upload and indexing",
      text: "Upload a PDF. The backend extracts pages, creates parent-child sliding-window chunks, embeds child chunks, and stores source metadata in Qdrant.",
    },
    {
      icon: FileSearch,
      title: "Grounded analysis",
      text: "Questions are embedded, matched against the indexed corpus, deduplicated by parent chunk, reranked with a cross-encoder, and answered from the selected source context.",
    },
    {
      icon: ShieldCheck,
      title: "Citations and legal review",
      text: "Use page citations and source previews to inspect the retrieved text. LexIntel explains document content; it does not provide final legal advice.",
    },
  ];

  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Help & Documentation</h2>
          <p>Understand how the current LexIntel retrieval and review workflow operates.</p>
        </div>
      </section>

      <section className="panel help-panel">
        <div className="help-panel__intro">
          <HelpCircle size={22} />
          <div>
            <h3>LexIntel document intelligence workflow</h3>
            <p>Designed for source-grounded legal document research and review.</p>
          </div>
        </div>
        <div className="help-grid">
          {items.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={18} strokeWidth={1.7} />
              <h4>{title}</h4>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

export default HelpPage;
