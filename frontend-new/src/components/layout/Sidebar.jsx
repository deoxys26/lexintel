import {
  Activity,
  Bot,
  FileSearch,
  Files,
  HelpCircle,
  LayoutDashboard,
  Scale,
  Settings,
  ShieldAlert,
  X,
} from "lucide-react";

const primaryNavigation = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: Files },
  { id: "analysis", label: "Analysis", icon: FileSearch },
  { id: "ask", label: "Ask LexIntel", icon: Bot },
  { id: "risks", label: "Risk Review", icon: ShieldAlert },
  { id: "activity", label: "Activity", icon: Activity },
];

const secondaryNavigation = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help & Documentation", icon: HelpCircle },
];

function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }) {
  const renderItem = ({ id, label, icon: Icon }) => (
    <button
      key={id}
      type="button"
      className={`sidebar-nav__item ${activePage === id ? "is-active" : ""}`}
      onClick={() => {
        onNavigate(id);
        onCloseMobile();
      }}
    >
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
    </button>
  );

  return (
    <aside className={`sidebar ${mobileOpen ? "is-mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand__mark" aria-hidden="true">
          <Scale size={20} strokeWidth={1.8} />
        </div>
        <div>
          <strong>LEXINTEL</strong>
          <span>Legal Intelligence</span>
        </div>
        <button
          type="button"
          className="sidebar-mobile-close"
          aria-label="Close navigation"
          onClick={onCloseMobile}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Primary navigation">
        {primaryNavigation.map(renderItem)}
      </nav>

      <div className="sidebar-spacer" />

      <nav className="sidebar-nav sidebar-nav--secondary" aria-label="Support navigation">
        {secondaryNavigation.map(renderItem)}
      </nav>

      <div className="sidebar-profile">
        <div className="sidebar-profile__avatar">PM</div>
        <div>
          <strong>Phani M</strong>
          <span>LexIntel Workspace</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
