import { Check, FileText, Trash2, UploadCloud } from "lucide-react";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

const formatBytes = (bytes = 0) => {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const processingStages = [
  "Uploading document",
  "Extracting pages",
  "Creating document index",
  "Preparing legal analysis",
];

function DocumentUploadModal({ open, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxSize: 25 * 1024 * 1024,
    disabled: uploading,
    onDropAccepted: ([acceptedFile]) => {
      setFile(acceptedFile);
      setError("");
      setCompleted(false);
      setProgress(0);
    },
    onDropRejected: () => {
      setError("Choose a PDF smaller than 25 MB.");
    },
  });

  const activeStage = useMemo(() => {
    if (completed) return processingStages.length;
    if (!uploading) return -1;
    if (progress < 100) return 0;
    return 1;
  }, [completed, progress, uploading]);

  const resetAndClose = () => {
    if (uploading) return;
    setFile(null);
    setProgress(0);
    setCompleted(false);
    setError("");
    onClose();
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    try {
      setUploading(true);
      setError("");
      setCompleted(false);
      setProgress(0);

      await onUpload(file, (event) => {
        if (!event.total) return;
        setProgress(Math.round((event.loaded * 100) / event.total));
      });

      setProgress(100);
      setCompleted(true);
    } catch (uploadError) {
      const detail = uploadError?.response?.data?.detail;
      setError(detail || "The document could not be uploaded. Check the backend and try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Upload legal document"
      description="Upload a PDF to index its pages and ask source-grounded legal document questions."
    >
      {!completed ? (
        <>
          <div
            {...getRootProps()}
            className={`upload-dropzone ${isDragActive ? "is-active" : ""}`}
          >
            <input {...getInputProps()} />
            <UploadCloud size={25} strokeWidth={1.6} />
            <strong>Drag and drop a PDF here</strong>
            <span>or choose a file from your computer</span>
            <small>PDF · Maximum 25 MB</small>
          </div>

          {file ? (
            <div className="selected-file-row">
              <div className="selected-file-row__icon">
                <FileText size={18} />
              </div>
              <div className="selected-file-row__meta">
                <strong>{file.name}</strong>
                <span>{formatBytes(file.size)}</span>
                {uploading ? (
                  <div className="upload-progress" aria-label={`Upload ${progress}% complete`}>
                    <span style={{ width: `${Math.max(progress, 8)}%` }} />
                  </div>
                ) : null}
              </div>
              {!uploading ? (
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Remove selected file"
                  onClick={() => setFile(null)}
                >
                  <Trash2 size={17} />
                </button>
              ) : null}
            </div>
          ) : null}

          {uploading ? (
            <div className="processing-stages" role="status" aria-live="polite">
              {processingStages.map((stage, index) => (
                <div
                  key={stage}
                  className={`processing-stage ${index < activeStage ? "is-complete" : ""} ${index === activeStage ? "is-active" : ""}`}
                >
                  <span className="processing-stage__marker">
                    {index < activeStage ? <Check size={12} /> : index + 1}
                  </span>
                  <span>{stage}</span>
                </div>
              ))}
              <p>
                The backend completes extraction, parent-child chunking, embeddings, and Qdrant indexing in one request.
              </p>
            </div>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          <div className="modal-actions">
            <Button variant="secondary" onClick={resetAndClose} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? "Processing document" : "Analyse Document"}
            </Button>
          </div>
        </>
      ) : (
        <div className="upload-success-state">
          <span className="upload-success-state__icon">
            <Check size={23} />
          </span>
          <h3>Document indexed successfully</h3>
          <p>{file?.name} is ready for source-grounded questions and analysis.</p>
          <Button onClick={resetAndClose}>Open workspace</Button>
        </div>
      )}
    </Modal>
  );
}

export default DocumentUploadModal;
