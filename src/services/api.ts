import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LoginCredentials, LoginResponse, Document, Client, DashboardStats, ApiError } from '../types';
import { tokenStorage } from '../utils/auth';

// Create Axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      tokenStorage.clearAuth();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
    };
    
    return Promise.reject(apiError);
  }
);

// Auth API calls
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Dummy authentication for demo purposes
      // In production, this would make a real API call to your .NET backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check dummy credentials
      const validCredentials = [
        { email: 'admin@example.com', password: 'password123' },
        { email: 'user@demo.com', password: 'demo123' },
        { email: 'test@test.com', password: 'test123' }
      ];
      
      const isValid = validCredentials.some(
        cred => cred.email === credentials.email && cred.password === credentials.password
      );
      
      if (!isValid) {
        throw {
          message: 'Invalid email or password',
          status: 401
        };
      }
      
      // Return dummy successful login response
      const dummyResponse: LoginResponse = {
        token: 'dummy-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0].charAt(0).toUpperCase() + credentials.email.split('@')[0].slice(1)
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
      };
      
      return dummyResponse;
      
      // Uncomment below for real API integration:
      // const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Document API calls
export const documentApi = {
  getDocuments: async (): Promise<Document[]> => {
    try {
      // Dummy documents for demo purposes
      // In production, this would make a real API call to your .NET backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return dummy documents
      const dummyDocuments: Document[] = [
        {
          id: '1',
          fileName: 'project-proposal.pdf',
          documentType: 'PDF',
          uploadedDate: '2024-01-15T10:30:00Z',
          fileSize: 2048576
        },
        {
          id: '2',
          fileName: 'company-logo.png',
          documentType: 'Image',
          uploadedDate: '2024-01-14T14:22:00Z',
          fileSize: 512000
        },
        {
          id: '3',
          fileName: 'financial-report.xlsx',
          documentType: 'Spreadsheet',
          uploadedDate: '2024-01-13T09:15:00Z',
          fileSize: 1024000
        },
        {
          id: '4',
          fileName: 'meeting-notes.docx',
          documentType: 'Document',
          uploadedDate: '2024-01-12T16:45:00Z',
          fileSize: 256000
        },
        {
          id: '5',
          fileName: 'presentation.pptx',
          documentType: 'Presentation',
          uploadedDate: '2024-01-11T11:20:00Z',
          fileSize: 4096000
        }
      ];
      
      return dummyDocuments;
      
      // Uncomment below for real API integration:
      // const response = await api.get<Document[]>('/api/document');
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getDocumentUrl: (fileName: string): string => {
    // For demo purposes, return placeholder URLs
    // In production, this would return the actual file URL from your backend
    
    const fileExt = fileName.split('.').pop()?.toLowerCase();
    
    // Return appropriate placeholder based on file type
    if (fileExt === 'pdf') {
      return 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
      return `https://picsum.photos/800/600?random=${fileName}`;
    } else {
      // For other file types, we'll just return a placeholder
      return '#';
    }
    
    // Uncomment below for real API integration:
    // return `${import.meta.env.VITE_API_BASE_URL}/UploadedFiles/${fileName}`;
  },
};

// Client API calls
export const clientApi = {
  getClients: async (): Promise<Client[]> => {
    try {
      // Dummy clients for demo purposes
      // In production, this would make a real API call to your .NET backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Return dummy clients
      const dummyClients: Client[] = [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@acme.com',
          phone: '+1 (555) 123-4567',
          company: 'Acme Corporation',
          status: 'active',
          createdAt: '2024-01-10T08:00:00Z',
          documentCount: 5
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@techstart.com',
          phone: '+1 (555) 234-5678',
          company: 'TechStart Inc.',
          status: 'active',
          createdAt: '2024-01-12T10:30:00Z',
          documentCount: 3
        },
        {
          id: '3',
          name: 'Michael Brown',
          email: 'michael.brown@globaltech.com',
          phone: '+1 (555) 345-6789',
          company: 'GlobalTech Solutions',
          status: 'inactive',
          createdAt: '2024-01-08T14:15:00Z',
          documentCount: 2
        },
        {
          id: '4',
          name: 'Emily Davis',
          email: 'emily.davis@innovate.com',
          phone: '+1 (555) 456-7890',
          company: 'Innovate Labs',
          status: 'active',
          createdAt: '2024-01-15T09:45:00Z',
          documentCount: 7
        },
        {
          id: '5',
          name: 'David Wilson',
          email: 'david.wilson@megacorp.com',
          phone: '+1 (555) 567-8901',
          company: 'MegaCorp Industries',
          status: 'active',
          createdAt: '2024-01-11T16:20:00Z',
          documentCount: 4
        },
        {
          id: '6',
          name: 'Lisa Anderson',
          email: 'lisa.anderson@startup.com',
          phone: '+1 (555) 678-9012',
          company: 'Startup Ventures',
          status: 'inactive',
          createdAt: '2024-01-09T11:10:00Z',
          documentCount: 1
        }
      ];
      
      return dummyClients;
      
      // Uncomment below for real API integration:
      // const response = await api.get<Client[]>('/api/clients');
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Dashboard API calls
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Dummy stats for demo purposes
      // In production, this would make a real API call to your .NET backend
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return dummy stats
      const dummyStats: DashboardStats = {
        totalClients: 6,
        totalDocuments: 22,
        activeClients: 4,
        recentDocuments: 8
      };
      
      return dummyStats;
      
      // Uncomment below for real API integration:
      // const response = await api.get<DashboardStats>('/api/dashboard/stats');
      // return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;