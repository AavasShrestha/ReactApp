import axios, { AxiosInstance, AxiosResponse } from "axios";
import { 
  LoginCredentials, 
  LoginResponse, 
  DashboardStats, 
  ApiError,
  Client,
  NewClient,
  Database,
  NewDatabase,
  UserManagement,
  NewUser
} from "../types";
import { tokenStorage } from "../utils/auth";

/* ------------------ Base URL ------------------ */
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Correct backend base URL
  return envUrl;
};

/* ------------------ Axios Instance ------------------ */
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

/* ------------------ Interceptors ------------------ */
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      config.headers["User-ID"] = user.Id;
    }

    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && "Content-Type" in config.headers) {
        delete (config.headers as any)["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      status: error.response?.status || 0,
    };

    if (apiError.status === 401) {
      tokenStorage.clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.code === "ERR_SSL_PROTOCOL_ERROR" || error.message?.includes("SSL")) {
      apiError.message = "SSL connection error. Use HTTP instead of HTTPS for development.";
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

/* ------------------ Auth API ------------------ */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<any>("/api/Login/userauthentication", credentials);
    if (!response.data.IsSuccess && response.data.Message) throw new Error(response.data.Message);
    return {
      UserDetail: response.data.UserDetail,
      Token: response.data.Token,
    };
  },
};

/* ------------------ Client API ------------------ */
export const clientApi = {
  getClients: async (): Promise<Client[]> => (await api.get("/api/ClientDetail")).data,
  createClient: async (payload: NewClient): Promise<Client> =>
    (await api.post("/api/ClientDetail", payload)).data,
  updateClient: async (id: number | string, payload: Partial<NewClient>): Promise<Client> =>
    (await api.put(`/api/ClientDetail/${id}`, payload)).data,
  deleteClient: async (id: number | string) => await api.delete(`/api/ClientDetail/${id}`),
};

/* ------------------ Database API (FIXED) ------------------ */
export const databaseApi = {
  getDatabases: async (): Promise<Database[]> =>
    (await api.get("/api/RegisterDb")).data,

  createDatabase: async (payload: NewDatabase): Promise<Database> =>
    (await api.post("/api/RegisterDb", payload)).data,

  updateDatabase: async (id: number | string, payload: Partial<NewDatabase>): Promise<Database> =>
    (await api.put(`/api/RegisterDb/${id}`, payload)).data,

  deleteDatabase: async (id: number | string) =>
    await api.delete(`/api/RegisterDb/${id}`),

  testConnection: async (id: number | string): Promise<{ success: boolean; message: string }> =>
    (await api.post(`/api/RegisterDb/${id}/test`)).data,

  backupDatabase: async (id: number | string): Promise<{ success: boolean; message: string }> =>
    (await api.post(`/api/RegisterDb/${id}/backup`)).data,
};

/* ------------------ User Management API ------------------ */
export const userApi = {
  getUsers: async (): Promise<UserManagement[]> => (await api.get("/api/User")).data,
  createUser: async (payload: NewUser): Promise<UserManagement> =>
    (await api.post("/api/User", payload)).data,
  updateUser: async (id: number | string, payload: Partial<NewUser>): Promise<UserManagement> =>
    (await api.put(`/api/User/${id}`, payload)).data,
  deleteUser: async (id: number | string) => await api.delete(`/api/User/${id}`),
  toggleUserStatus: async (id: number | string): Promise<UserManagement> =>
    (await api.patch(`/api/User/${id}/toggle-status`)).data,
};

/* ------------------ Dashboard API ------------------ */
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => (await api.get("/api/dashboard/stats")).data,
};

/* ------------------ Health Check API ------------------ */
export const healthApi = {
  checkConnection: async (): Promise<{ status: string; message: string }> =>
    (await api.get("/api/health")).data,
};

export default api;
