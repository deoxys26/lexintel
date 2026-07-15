import { Paperclip, Send } from "lucide-react";
import { useState } from "react";

function QuestionInput({ onSubmit, disabled, compact = false }) {
  const [query, setQuery] = useState("");

  const submit = () => {
    const value = query.trim();
    if (!value || disabled) return;
    onSubmit(value);
    setQuery("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={`question-input ${compact ? "question-input--compact" : ""}`}>
      <textarea
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a question about indexed documents..."
        rows={compact ? 2 : 3}
        disabled={disabled}
      />
      <div className="question-input__actions">
        <button
          type="button"
          className="question-context-button"
          title="Queries use the indexed Qdrant document context"
        >
          <Paperclip size={15} />
          Indexed context
        </button>
        <button
          type="button"
          className="question-send-button"
          aria-label="Send question"
          onClick={submit}
          disabled={disabled || !query.trim()}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

export default QuestionInput;
