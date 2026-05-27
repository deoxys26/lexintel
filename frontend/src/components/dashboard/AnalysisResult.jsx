function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="card result-card">
      <h3>Analysis Result</h3>
      <pre>{analysis}</pre>
    </div>
  );
}

export default AnalysisResult;