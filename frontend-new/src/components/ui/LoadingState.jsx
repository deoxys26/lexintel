function LoadingState({ label = "Analysing indexed document sources..." }) {
  return (
    <div className="generation-indicator" role="status" aria-live="polite">
      <span className="generation-dot" />
      <span className="generation-dot" />
      <span className="generation-dot" />
      <span>{label}</span>
    </div>
  );
}

export default LoadingState;
