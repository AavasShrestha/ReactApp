import axios from "axios";
import { User, NewUser } from "../../types";

// Use VITE_API_BASE_URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/User";

export const userService = {

  // GET all users
  getAll: async (): Promise<User[]> => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },

  // CREATE new user — backend REQUIRES a header User-ID
  create: async (data: NewUser): Promise<User> => {
    const res = await axios.post(API_BASE_URL, data, {
      headers: {
        "User-ID": 1 // required by backend
      }
    });
    return res.data;
  },

  // UPDATE user by ID
  update: async (id: number, data: NewUser): Promise<User> => {
    const res = await axios.put(`${API_BASE_URL}/${id}`, data);
    return res.data;
  },

  // DELETE user by ID
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/${id}`);
  },
};
