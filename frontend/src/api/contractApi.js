import axios from "axios";

// Use 8001 if your backend is currently running on port 8001.
// Change this back to 8000 only after your backend is running correctly on 8000.
const API_BASE_URL = "http://127.0.0.1:8000/api";

export const uploadContract = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/contracts/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const analyzeContract = async (query) => {
  const response = await axios.post(
    `${API_BASE_URL}/analysis/analyze`,
    { query },
    { timeout: 60000 }
  );

  return response.data;
};