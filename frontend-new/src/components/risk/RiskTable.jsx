import { ChevronRight } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

function RiskTable({ risks, onOpenRisk }) {
  return (
    <div className="table-scroll">
      <table className="risk-table">
        <thead>
          <tr>
            <th>Risk</th>
            <th>Severity</th>
            <th>Clause</th>
            <th>Document</th>
            <th>Page</th>
            <th>Status</th>
            <th aria-label="Open" />
          </tr>
        </thead>
        <tbody>
          {risks.map((risk) => (
            <tr key={risk.id} onClick={() => onOpenRisk(risk)}>
              <td>
                <strong className="risk-title-cell">{risk.title}</strong>
              </td>
              <td>
                <SeverityBadge severity={risk.severity} />
              </td>
              <td>{risk.clause}</td>
              <td>{risk.document}</td>
              <td>{risk.page === "—" ? "—" : `Page ${risk.page}`}</td>
              <td>{risk.status}</td>
              <td>
                <ChevronRight size={16} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RiskTable;
