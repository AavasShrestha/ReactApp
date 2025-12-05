import axios from "axios";

const API_URL = "http://localhost:5114/api/Logo";

export const logoService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("File", file);

    return axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("File", file);

    return axios.put(`${API_URL}/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: async (id: number) => {
    return axios.delete(`${API_URL}/delete/${id}`);
  },

  getAll: async () => {
    return axios.get(API_URL);
  },

  getById: async (id: number) => {
    return axios.get(`${API_URL}/${id}`);
  }
};
