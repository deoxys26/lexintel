import { useDropzone } from "react-dropzone";

function UploadCard({ onFileSelect, selectedFile, onUpload, uploadStatus }) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      onFileSelect(acceptedFiles[0]);
    },
  });

  return (
    <div className="card">
      <h3>Upload Contract</h3>

      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag & drop PDF here, or click to browse</p>
      </div>

      {selectedFile && <p className="file-name">{selectedFile.name}</p>}

      <button onClick={onUpload}>Upload & Index</button>

      {uploadStatus && <p className="status">{uploadStatus}</p>}
    </div>
  );
}

export default UploadCard;