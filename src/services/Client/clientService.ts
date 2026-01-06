import { Client, NewClient } from "../../types";
import api from "../api";

/** Backend → Frontend mapper */
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
  isLive: !!c.CID,

});

/** Frontend → Backend mapper */
const mapToBackend = (data: NewClient) => ({
  client_name: data.client_name,
  db_name: data.db_name,
  Owner: data.owner,
  Address: data.address,
  Primary_phone: data.primary_phone,
  Secondary_phone: data.secondary_phone,
  Primary_email: data.primary_email,
  Secondary_email: data.secondary_email,
  SMS_service: data.sms_service,
  ApprovalSystem: data.approval_system,
  CollectionApp: data.collection_app,
  CID: data.isLive, //  map frontend isLive to backend CID

});

const clientService = {
  getAll: async (): Promise<Client[]> => {
    const res = await api.get("/api/ClientDetail");
    return res.data.map(mapClient);
  },

  getById: async (id: number): Promise<Client> => {
    const res = await api.get(`/api/ClientDetail/${id}`);
    return mapClient(res.data);
  },

  create: async (data: NewClient & { logo?: File }): Promise<Client> => {
    const formData = new FormData();
    Object.entries(mapToBackend(data)).forEach(([key, value]) => formData.append(key, value as any));

    if (data.logo instanceof File) formData.append("logo", data.logo);

    const res = await api.post("/api/ClientDetail", formData, { headers: { "Content-Type": "multipart/form-data" } });
    return mapClient(res.data);
  },

  // update: async (id: number, data: NewClient & { logo?: File }): Promise<Client> => {
  //   const formData = new FormData();
  //   Object.entries(mapToBackend(data)).forEach(([key, value]) => formData.append(key, value as any));

  //   if (data.logo instanceof File) formData.append("logo", data.logo);

  //   const res = await api.put(`/api/ClientDetail/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
  //   return mapClient(res.data);
  // },
  update: async (id: number, data: NewClient & { logo?: File }): Promise<Client> => {
  const formData = new FormData();

  // Map booleans to "true"/"false" strings
  Object.entries(mapToBackend(data)).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      formData.append(key, value ? "true" : "false");
    } else {
      // Convert everything else to string
      formData.append(key, value !== undefined && value !== null ? String(value) : "");
    }
  });

  // Append logo if provided
  if (data.logo instanceof File) formData.append("logo", data.logo);

  const res = await api.put(`/api/ClientDetail/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return mapClient(res.data);
},


  delete: async (id: number) => {
    await api.delete(`/api/ClientDetail/${id}`);
  },
};

export default clientService;
