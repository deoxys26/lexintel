import { Bot, Database } from "lucide-react";
import AssistantResponse from "./AssistantResponse";
import QuestionInput from "./QuestionInput";
import SuggestedQuestions from "./SuggestedQuestions";
import LoadingState from "../ui/LoadingState";

function LexIntelPanel({
  messages,
  onAnalyze,
  loading,
  indexedPages,
  onSelectSource,
  embedded = false,
}) {
  const latestAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "ai" && message.content);

  const runSuggestedQuestion = (question) => {
    if (!loading) onAnalyze(question);
  };

  return (
    <aside className={`lexintel-panel ${embedded ? "lexintel-panel--embedded" : ""}`}>
      <header className="lexintel-panel__header">
        <div className="lexintel-panel__icon">
          <Bot size={18} strokeWidth={1.7} />
        </div>
        <div>
          <h3>Ask LexIntel</h3>
          <p>Answers are grounded in indexed document sources.</p>
        </div>
      </header>

      <div className="lexintel-panel__body">
        {messages.length <= 1 ? (
          <SuggestedQuestions onSelect={runSuggestedQuestion} />
        ) : null}

        {latestAssistant ? (
          <AssistantResponse
            content={latestAssistant.content}
            sources={latestAssistant.sources}
            onSelectSource={onSelectSource}
          />
        ) : null}

        {loading ? <LoadingState /> : null}
      </div>

      <footer className="lexintel-panel__footer">
        <QuestionInput onSubmit={onAnalyze} disabled={loading} compact />
        <div className="indexed-pages-label">
          <Database size={13} />
          {indexedPages > 0
            ? `Responses generated from ${indexedPages} indexed pages in this session`
            : "Upload a PDF to build indexed document context"}
        </div>
      </footer>
    </aside>
  );
}

export default LexIntelPanel;
