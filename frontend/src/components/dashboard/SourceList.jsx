function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="card">
      <h3>Retrieved Sources</h3>

      {sources.map((source, index) => (
        <div className="source-box" key={index}>
          <strong>{source.filename}</strong>
          <p>Score: {source.score?.toFixed(3)}</p>
          <p>{source.text?.slice(0, 300)}...</p>
        </div>
      ))}
    </div>
  );
}

export default SourceList;