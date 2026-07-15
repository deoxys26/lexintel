import {
  Bell,
  Command,
  HelpCircle,
  Menu,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

function Header({
  title,
  breadcrumb,
  documents,
  analysisHistory,
  onNavigate,
  onOpenMobileNav,
}) {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return [];

    const documentResults = documents
      .filter((document) => document.name.toLowerCase().includes(normalized))
      .slice(0, 3)
      .map((document) => ({
        id: document.id,
        label: document.name,
        meta: "Document",
        target: "documents",
      }));

    const analysisResults = analysisHistory
      .filter((entry) => entry.query.toLowerCase().includes(normalized))
      .slice(0, 3)
      .map((entry) => ({
        id: entry.id,
        label: entry.query,
        meta: "Analysis question",
        target: "analysis",
      }));

    return [...documentResults, ...analysisResults];
  }, [analysisHistory, documents, search]);

  return (
    <header className="top-header">
      <div className="top-header__left">
        <button
          type="button"
          className="icon-button top-header__menu"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
        >
          <Menu size={19} />
        </button>
        <div>
          {breadcrumb ? <span className="top-header__breadcrumb">{breadcrumb}</span> : null}
          <h1>{title}</h1>
        </div>
      </div>

      <div className="top-header__actions">
        <div className="global-search">
          <Search size={16} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 120)}
            placeholder="Search workspace"
            aria-label="Search workspace"
          />
          <span className="shortcut-hint">
            <Command size={12} /> K
          </span>

          {focused && search.trim() ? (
            <div className="search-results">
              {results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={`${result.meta}-${result.id}`}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onNavigate(result.target);
                      setSearch("");
                    }}
                  >
                    <span>{result.label}</span>
                    <small>{result.meta}</small>
                  </button>
                ))
              ) : (
                <div className="search-results__empty">No matching workspace items</div>
              )}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="icon-button header-desktop-action"
          aria-label="Notifications"
          title="No new notifications"
        >
          <Bell size={17} />
        </button>
        <button
          type="button"
          className="icon-button header-desktop-action"
          aria-label="Help"
          onClick={() => onNavigate("help")}
        >
          <HelpCircle size={17} />
        </button>
        <div className="header-avatar" title="Phani M">
          PM
        </div>
      </div>
    </header>
  );
}

export default Header;
