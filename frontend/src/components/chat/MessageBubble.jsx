function MessageBubble({ role, content, sources = [] }) {
  const isUser = role === "user";
  const hasSources = !isUser && sources && sources.length > 0;

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        <p>{content}</p>

        {hasSources && (
          <div className="message-sources">
            <h4>Sources Used</h4>

            {sources.map((source, index) => (
              <div key={index} className="message-source-card">
                <div className="source-meta">
                  <strong>{source.filename || "Unknown file"}</strong>
                  <span>Page {source.page || "Unknown"}</span>
                  <span>Score: {source.score}</span>
                </div>

                <p className="source-preview">
                  {source.text
                    ? `${source.text.slice(0, 280)}...`
                    : "No source text available."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;