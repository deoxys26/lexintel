import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000/api";

export const uploadContract = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/contracts/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,

      // PDF extraction, embedding, and indexing may take some time.
      timeout: 180000,
    },
  );

  return response.data;
};

export const analyzeContract = async (query) => {
  const response = await axios.post(
    `${API_BASE_URL}/analysis/analyze`,
    { query },
    {
      // Allow up to 3 minutes for cold starts, reranking, and Gemini.
      timeout: 180000,
    },
  );

  return response.data;
};