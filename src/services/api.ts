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
  if (envUrl) {
    console.debug('[API] Using environment API URL:', envUrl);
    return envUrl;
  }
  
  // Fallback URLs for development
  const fallbackUrls = [
    "https://localhost:7001",
    "http://localhost:7001", 
    "https://localhost:5114",
    "http://localhost:5114"
  ];
  
  console.debug('[API] No environment URL found, using fallback:', fallbackUrls[0]);
  return fallbackUrls[0];
};

/* ------------------ Axios Instance ------------------ */
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  // Do not set a global Content-Type; let Axios infer per request.
});

/* ------------------ Interceptors ------------------ */
// Request → attach token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Debug: Log request details for troubleshooting
    console.debug('[API Request]', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      headers: config.headers
    });

    // If sending FormData, remove Content-Type so browser sets multipart boundary
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers && 'Content-Type' in config.headers) {
        delete (config.headers as any)['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response → handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      status: error.response?.status || 0,
    };

    // Auto-logout on 401
    if (apiError.status === 401) {
      tokenStorage.clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // SSL or connection errors
    if (error.code === "ERR_SSL_PROTOCOL_ERROR" || error.message?.includes("SSL")) {
      apiError.message = "SSL connection error. Check API server or use HTTP for dev.";
      apiError.status = 0;
    }

    return Promise.reject(apiError);
  }
);

/* ------------------ Auth API ------------------ */
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Use the same Axios instance for consistency
      const response = await api.post<any>(
        "/api/Login/userauthentication",
        credentials
      );

      // Debug: Log the response to see what we're getting
      console.log('Login response:', response.data);

      // Handle new backend format with IsSuccess and Message
      if (response.data.IsSuccess !== undefined) {
        // New format: { IsSuccess: boolean, Message: string, UserDetail?: User, Token?: string }
        console.log('Using new format, IsSuccess:', response.data.IsSuccess);
        
        if (!response.data.IsSuccess) {
          console.log('Login failed, message:', response.data.Message);
          throw new Error(response.data.Message || 'Login failed');
        }
        
        if (!response.data.Token || !response.data.UserDetail) {
          console.log('Missing Token or UserDetail');
          throw new Error('Invalid response from server');
        }
        
        console.log('Login successful, returning data');
        // Return in the expected format
        return {
          UserDetail: response.data.UserDetail,
          Token: response.data.Token
        };
      } else {
        // Old format: { UserDetail: User, Token: string }
        console.log('Using old format');
        return response.data;
      }
    } catch (error: any) {
      // Handle HTTP errors (network issues, server errors, etc.)
      if (error.response?.data?.Message) {
        // If backend provides a message, use it
        throw new Error(error.response.data.Message);
      } else if (error.response?.data?.message) {
        // Alternative message field
        throw new Error(error.response.data.message);
      } else if (error.message) {
        // Use the error message from the HTTP client
        throw new Error(error.message);
      } else {
        // Fallback message
        throw new Error("Login failed. Please check your credentials and try again.");
      }
    }
  },
};


/* ------------------ Client API ------------------ */
export const clientApi = {
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get<Client[]>("/api/Client");
      return response.data;
    } catch (error: any) {
      console.error('[clientApi.getClients] Error:', error);
      throw error;
    }
  },
  
  createClient: async (payload: NewClient): Promise<Client> => {
    const response = await api.post<Client>("/api/Client", payload);
    return response.data;
  },
  
  updateClient: async (id: number | string, payload: Partial<NewClient>): Promise<Client> => {
    const response = await api.put<Client>(`/api/Client/${encodeURIComponent(String(id))}`, payload);
    return response.data;
  },
  
  deleteClient: async (id: number | string): Promise<void> => {
    await api.delete(`/api/Client/${encodeURIComponent(String(id))}`);
  },
};

/* ------------------ Database API ------------------ */
export const databaseApi = {
  getDatabases: async (): Promise<Database[]> => {
    try {
      const response = await api.get<Database[]>("/api/Database");
      return response.data;
    } catch (error: any) {
      console.error('[databaseApi.getDatabases] Error:', error);
      throw error;
    }
  },
  
  createDatabase: async (payload: NewDatabase): Promise<Database> => {
    const response = await api.post<Database>("/api/Database", payload);
    return response.data;
  },
  
  updateDatabase: async (id: number | string, payload: Partial<NewDatabase>): Promise<Database> => {
    const response = await api.put<Database>(`/api/Database/${encodeURIComponent(String(id))}`, payload);
    return response.data;
  },
  
  deleteDatabase: async (id: number | string): Promise<void> => {
    await api.delete(`/api/Database/${encodeURIComponent(String(id))}`);
  },
  
  testConnection: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/api/Database/${encodeURIComponent(String(id))}/test`);
    return response.data;
  },
  
  backupDatabase: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post(`/api/Database/${encodeURIComponent(String(id))}/backup`);
    return response.data;
  },
};

/* ------------------ User Management API ------------------ */
export const userApi = {
  getUsers: async (): Promise<UserManagement[]> => {
    try {
      const response = await api.get<UserManagement[]>("/api/User");
      return response.data;
    } catch (error: any) {
      console.error('[userApi.getUsers] Error:', error);
      throw error;
    }
  },
  
  createUser: async (payload: NewUser): Promise<UserManagement> => {
    const response = await api.post<UserManagement>("/api/User", payload);
    return response.data;
  },
  
  updateUser: async (id: number | string, payload: Partial<NewUser>): Promise<UserManagement> => {
    const response = await api.put<UserManagement>(`/api/User/${encodeURIComponent(String(id))}`, payload);
    return response.data;
  },
  
  deleteUser: async (id: number | string): Promise<void> => {
    await api.delete(`/api/User/${encodeURIComponent(String(id))}`);
  },
  
  toggleUserStatus: async (id: number | string): Promise<UserManagement> => {
    const response = await api.patch<UserManagement>(`/api/User/${encodeURIComponent(String(id))}/toggle-status`);
    return response.data;
  },
};

/* ------------------ Dashboard API ------------------ */
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/api/dashboard/stats");
    return response.data;
  },
};

/* ------------------ Health Check API ------------------ */
export const healthApi = {
  checkConnection: async (): Promise<{ status: string; message: string }> => {
    try {
      const response = await api.get("/api/health");
      return response.data;
    } catch (error: any) {
      // Try alternative health endpoints
      const healthEndpoints = ["/health", "/api/Health", "/"];
      for (const endpoint of healthEndpoints) {
        try {
          await api.get(endpoint);
          return { status: "ok", message: "API is reachable" };
        } catch (e: any) {
          console.debug(`Health check failed for ${endpoint}:`, e.status);
        }
      }
      throw error;
    }
  },
};

export default api;
