import { Bot, FileText } from "lucide-react";
import PageContainer from "../components/layout/PageContainer";
import AssistantResponse from "../components/assistant/AssistantResponse";
import SuggestedQuestions from "../components/assistant/SuggestedQuestions";
import QuestionInput from "../components/assistant/QuestionInput";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

function AskPage({ documents, messages, loading, onAnalyze, onOpenUpload, onSelectSource }) {
  const hasDocuments = documents.length > 0;

  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Ask LexIntel</h2>
          <p>Research indexed legal documents with source-grounded retrieval and page citations.</p>
        </div>
      </section>

      {!hasDocuments ? (
        <section className="panel">
          <EmptyState
            icon={FileText}
            title="Index a document before asking questions"
            description="LexIntel searches Qdrant for relevant child chunks, reranks the results, and sends grounded parent context to Gemini."
            action={<Button onClick={onOpenUpload}>Upload Document</Button>}
          />
        </section>
      ) : (
        <div className="research-workspace">
          <section className="research-thread">
            <header className="research-thread__header">
              <div className="lexintel-panel__icon">
                <Bot size={18} strokeWidth={1.7} />
              </div>
              <div>
                <h3>Document research session</h3>
                <p>{documents.length} indexed document{documents.length === 1 ? "" : "s"} in this frontend session</p>
              </div>
            </header>

            <div className="research-thread__content">
              {messages.length <= 1 ? <SuggestedQuestions onSelect={onAnalyze} /> : null}
              {messages.slice(1).map((message, index) =>
                message.role === "user" ? (
                  <article className="research-query" key={`${message.content}-${index}`}>
                    <span>QUESTION</span>
                    <p>{message.content}</p>
                  </article>
                ) : (
                  <article className="research-answer" key={`${message.content}-${index}`}>
                    <span>LEXINTEL ANALYSIS</span>
                    <AssistantResponse
                      content={message.content}
                      sources={message.sources}
                      onSelectSource={onSelectSource}
                    />
                  </article>
                ),
              )}
              {loading ? <LoadingState /> : null}
            </div>

            <footer className="research-thread__composer">
              <QuestionInput onSubmit={onAnalyze} disabled={loading} />
              <p>LexIntel explains retrieved document content and does not provide final legal advice.</p>
            </footer>
          </section>
        </div>
      )}
    </PageContainer>
  );
}

export default AskPage;
