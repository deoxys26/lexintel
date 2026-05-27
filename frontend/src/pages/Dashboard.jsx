import { useState } from "react";
import { uploadContract, analyzeContract } from "../api/contractApi";
import UploadCard from "../components/upload/UploadCard";
import ChatBox from "../components/chat/ChatBox";
import MessageBubble from "../components/chat/MessageBubble";
import SourceList from "../components/dashboard/SourceList";
import RiskCard from "../components/dashboard/RiskCard";

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    documents: 0,
    chunks: 0,
    status: "Ready",
    lastFile: "None",
  });

  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Upload a contract or document, then ask me to summarize, find risks, or explain important clauses.",
    },
  ]);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);
      const data = await uploadContract(selectedFile);

      setUploadStatus(`${data.message}. Chunks created: ${data.chunks_created}`);

      setStats({
        documents: stats.documents + 1,
        chunks: stats.chunks + (data.chunks_created || 0),
        status: "Indexed",
        lastFile: data.filename,
      });
    } catch (error) {
      setUploadStatus("Upload failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (query) => {
    try {
      setLoading(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: query,
        },
      ]);

      const data = await analyzeContract(query);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.analysis,
        },
      ]);

      setSources(data.sources || []);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Analysis failed. Please check backend terminal.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <section className="topbar">
        <div>
          <h1>Contract Intelligence Dashboard</h1>
          <p>Analyze documents using Gemini, Qdrant, and retrieval-augmented generation.</p>
        </div>

        <div className="status-pill">{stats.status}</div>
      </section>

      <section className="stats-grid">
        <RiskCard title="Documents Indexed" value={stats.documents} subtitle="Uploaded PDFs" />
        <RiskCard title="Chunks Stored" value={stats.chunks} subtitle="Vectorized segments" />
        <RiskCard title="AI Pipeline" value="Online" subtitle="Gemini + Qdrant" />
        <RiskCard title="Last Upload" value={stats.lastFile} subtitle="Most recent file" />
      </section>

      <section className="workspace-grid">
        <div>
          <UploadCard
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            onUpload={handleUpload}
            uploadStatus={uploadStatus}
          />

          <SourceList sources={sources} />
        </div>

        <div className="chat-panel">
          <div className="chat-header">
            <h3>AI Legal Assistant</h3>
            <span>Grounded RAG Chat</span>
          </div>

          <div className="chat-history">
            {messages.map((message, index) => (
              <MessageBubble
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}

            {loading && (
              <MessageBubble
                role="ai"
                content="Processing your request..."
              />
            )}
          </div>

          <ChatBox onAnalyze={handleAnalyze} />
        </div>
      </section>
    </main>
  );
}

export default Dashboard;