// src/services/Client/clientService.ts
import { Client, NewClient } from "../../types";
import api from "../api";

/** Helper to map backend fields to frontend Client */
const mapClient = (c: any): Client => ({
  client_id: c.client_id,
  client_name: c.client_name,
  db_name: c.db_name,
  owner: c.Owner || "",
  address: c.Address || "",
  primary_phone: c.Primary_phone || "",
  secondary_phone: c.Secondary_phone || "",
  primary_email: c.Primary_email || "",
  secondary_email: c.Secondary_email || "",
  sms_service: c.SMS_service || false,
  approval_system: c.ApprovalSystem || false,
  collection_app: c.CollectionApp || false,
  created_by: c.created_by,
  modified_by: c.modified_by,
  created_date: c.created_date,
  modified_date: c.modified_date,
  logo: c.Logo || "",
});


const clientService = { 
  getAll: async (): Promise<Client[]> => {
    const res = await api.get<any[]>("/api/ClientDetail");
    return res.data.map(mapClient);
  },

  getById: async (id: number): Promise<Client> => {
    const res = await api.get<any>(`/api/ClientDetail/${id}`);
    return mapClient(res.data);
  },

  create: async (data: NewClient): Promise<Client> => {
    const res = await api.post<any>("/api/ClientDetail", data);
    return mapClient(res.data);
  },

  update: async (id: number, data: NewClient): Promise<Client> => {
    const res = await api.put<any>(`/api/ClientDetail/update/${id}`, data);
    return mapClient(res.data);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/api/ClientDetail/delete/${id}`);
  },
};

export default clientService;
