export interface User {
  Id: number;
  Username: string;
  FullName: string;
  CompanyName: string | null;
  BranchName: string | null;
  Branchid: number;
  IsActive: boolean;
  Email: string | null;
  Gender: string | null;
  Phone: string | null;
  Remarks: string | null;
}

export interface LoginCredentials {
  UserName: string;
  Password: string;
  companyCode: string;
}

export interface LoginResponse {
  UserDetail: User;
  Token: string;
}

export interface Document {
  id: string;
  fileName: string;
  documentType: string;
  uploadedDate: string;
  fileSize?: number;
}

export interface Client {
  Id: number;
  ClientName: string;
  ClientType: string;
  OrganizationName: string;
  Email: string;
  Country: string;
  Mobile: string;
  Gender: string;
  City: string;
  Description: string;
}

export interface DashboardStats {
  totalClients: number;
  totalDocuments: number;
  activeClients: number;
  recentDocuments: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}