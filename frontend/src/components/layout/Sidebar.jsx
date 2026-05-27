function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">⚖</div>
        <div>
          <h2>LexIntel</h2>
          <p>Legal AI Platform</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a className="active">Dashboard</a>
        <a>Upload Docs</a>
        <a>AI Assistant</a>
        <a>Risk Analysis</a>
        <a>Sources</a>
      </nav>
    </aside>
  );
}

export default Sidebar;