import { useState } from "react";

function ChatBox({ onAnalyze }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) return;
    onAnalyze(query);
  };

  return (
    <div className="card">
      <h3>Ask About Contract</h3>

      <textarea
        placeholder="Example: Identify risky clauses in this contract"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSubmit}>Analyze</button>
    </div>
  );
}

export default ChatBox;