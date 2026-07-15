import { ExternalLink, MessageSquarePlus } from "lucide-react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import SeverityBadge from "./SeverityBadge";
import SourcePreview from "../analysis/SourcePreview";

function RiskDetailsDrawer({ open, onClose, risk, onOpenDocument }) {
  if (!risk) return null;

  return (
    <Drawer open={open} onClose={onClose} title={risk.title} eyebrow="RISK REVIEW">
      <div className="risk-drawer__meta">
        <SeverityBadge severity={risk.severity} />
        <span>{risk.document}</span>
        <span>{risk.page === "—" ? "Page unavailable" : `Page ${risk.page}`}</span>
      </div>

      <section className="drawer-section">
        <span className="eyebrow">WHY IT MATTERS</span>
        <p>
          LexIntel identified this concern in a source-grounded analysis response. It may indicate potential contractual exposure and requires legal review in the wider agreement context.
        </p>
      </section>

      {risk.source ? (
        <section className="drawer-section">
          <span className="eyebrow">SOURCE TEXT</span>
          <SourcePreview source={risk.source} />
        </section>
      ) : null}

      <section className="drawer-section">
        <span className="eyebrow">LEXINTEL ANALYSIS</span>
        <p>{risk.title}</p>
      </section>

      <section className="drawer-section">
        <span className="eyebrow">RECOMMENDED REVIEW</span>
        {risk.recommendations?.length > 0 ? (
          <ul>
            {risk.recommendations.map((recommendation, index) => (
              <li key={`${recommendation}-${index}`}>{recommendation}</li>
            ))}
          </ul>
        ) : (
          <p>Consider reviewing the cited clause, related exceptions, and cross-referenced obligations with qualified legal counsel.</p>
        )}
      </section>

      <div className="legal-disclaimer">
        LexIntel explains retrieved document content and does not provide final legal advice.
      </div>

      <div className="drawer-actions">
        <Button variant="secondary" disabled title="Persistent notes require backend support">
          <MessageSquarePlus size={15} /> Add Note
        </Button>
        <Button onClick={onOpenDocument}>
          <ExternalLink size={15} /> Open Analysis
        </Button>
      </div>
    </Drawer>
  );
}

export default RiskDetailsDrawer;
