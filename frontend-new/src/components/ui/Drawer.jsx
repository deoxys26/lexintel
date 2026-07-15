import { X } from "lucide-react";

function Drawer({ open, onClose, title, eyebrow, children, width = "440px" }) {
  if (!open) return null;

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <aside
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h2>{title}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close panel"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </header>
        <div className="drawer-content">{children}</div>
      </aside>
    </div>
  );
}

export default Drawer;
