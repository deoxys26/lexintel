import { FileText, MoreHorizontal } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import Badge from "../ui/Badge";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

function DocumentTable({ documents, onOpenDocument }) {
  return (
    <div className="table-scroll">
      <table className="document-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Document Type</th>
            <th>Uploaded</th>
            <th>Pages</th>
            <th>Analysis</th>
            <th>Risk</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} onClick={() => onOpenDocument(document.id)}>
              <td>
                <div className="document-name-cell">
                  <span className="document-file-icon">
                    <FileText size={17} strokeWidth={1.7} />
                  </span>
                  <div>
                    <strong>{document.name}</strong>
                    <small>{document.sizeLabel || "PDF document"}</small>
                  </div>
                </div>
              </td>
              <td>PDF</td>
              <td>{formatDate(document.uploadedAt)}</td>
              <td>{document.pages || "—"}</td>
              <td>
                <DocumentStatusBadge status={document.status} />
              </td>
              <td>
                <Badge tone={document.riskTone || "neutral"}>
                  {document.riskLabel || "Not assessed"}
                </Badge>
              </td>
              <td>
                <button
                  type="button"
                  className="icon-button table-action"
                  aria-label={`More actions for ${document.name}`}
                  onClick={(event) => event.stopPropagation()}
                  disabled
                  title="Additional document actions require a document registry API"
                >
                  <MoreHorizontal size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentTable;
