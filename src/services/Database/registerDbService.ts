// src/services/Database/registerDbService.ts
import api from "../api";
import { Database, NewDatabase } from "../../types";

export const databaseService = {
  getAll: async (): Promise<Database[]> => {
    const res = await api.get("/api/RegisterDb");
    return res.data; // already matches backend
  },

  getById: async (id: number): Promise<Database> => {
    const res = await api.get(`/api/RegisterDb/${id}`);
    return res.data;
  },
// src/services/Database/registerDbService.ts
create: async (data: FormData): Promise<any> => {
    const res = await api.post(`/api/RegisterDb?userId=1`, data);
    return res.data;
},


  update: async (id: number, data: Partial<NewDatabase>): Promise<Database> => {
    const res = await api.put(`/api/RegisterDb/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/RegisterDb/${id}?userId=1`); // pass userId here
}

};
