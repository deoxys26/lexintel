import { FileText, FolderPlus, Grid2X2, List, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import DocumentTable from "../components/documents/DocumentTable";

const filters = ["All Documents", "Recently Analysed", "High Risk", "Needs Review", "Archived"];

function DocumentsPage({ documents, onOpenUpload, onOpenDocument }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Documents");
  const [viewMode, setViewMode] = useState("table");

  const filteredDocuments = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return documents.filter((document) => {
      const matchesSearch = !normalized || document.name.toLowerCase().includes(normalized);
      const matchesFilter =
        activeFilter === "All Documents" ||
        (activeFilter === "High Risk" && ["High", "Critical"].includes(document.riskLabel)) ||
        (activeFilter === "Needs Review" && document.riskLabel !== "Not assessed") ||
        (activeFilter === "Recently Analysed" && document.status === "Indexed") ||
        (activeFilter === "Archived" && false);
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, documents, search]);

  return (
    <PageContainer>
      <section className="page-intro">
        <div>
          <h2>Documents</h2>
          <p>Upload, review, and analyse your legal documents.</p>
        </div>
        <div className="page-intro__actions">
          <Button variant="secondary" disabled title="Folder persistence requires a backend document registry">
            <FolderPlus size={16} /> New Folder
          </Button>
          <Button onClick={onOpenUpload}>
            <Upload size={16} /> Upload Document
          </Button>
        </div>
      </section>

      <section className="panel panel--flush documents-panel">
        <div className="documents-toolbar">
          <div className="documents-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search documents"
              aria-label="Search documents"
            />
          </div>
          <div className="view-toggle" aria-label="Document view">
            <button
              type="button"
              className={viewMode === "table" ? "is-active" : ""}
              aria-label="Table view"
              onClick={() => setViewMode("table")}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={viewMode === "grid" ? "is-active" : ""}
              aria-label="Grid view"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2 size={15} />
            </button>
          </div>
        </div>

        <div className="filter-tabs" role="tablist" aria-label="Document filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              className={activeFilter === filter ? "is-active" : ""}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredDocuments.length > 0 ? (
          viewMode === "table" ? (
            <DocumentTable documents={filteredDocuments} onOpenDocument={onOpenDocument} />
          ) : (
            <div className="document-grid">
              {filteredDocuments.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  className="document-grid-card"
                  onClick={() => onOpenDocument(document.id)}
                >
                  <FileText size={20} />
                  <strong>{document.name}</strong>
                  <span>{document.pages || "—"} pages · PDF</span>
                  <small>{document.status}</small>
                </button>
              ))}
            </div>
          )
        ) : documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents analysed yet"
            description="Upload a legal document to extract pages, create a searchable index, and ask source-grounded questions."
            action={<Button onClick={onOpenUpload}>Upload Document</Button>}
          />
        ) : (
          <EmptyState
            icon={Search}
            title="No documents match this view"
            description="Adjust the search or document filter to see other indexed files."
          />
        )}
      </section>
    </PageContainer>
  );
}

export default DocumentsPage;
