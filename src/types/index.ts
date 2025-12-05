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
  // added later for UserForm
  Role: string | null;
}

export interface LoginCredentials {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  UserDetail: User;
  Token: string;
}


// export interface Client {
//   Id: number;
//   ClientName: string;
//   ClientType: string;
//   OrganizationName: string;
//   Email: string;
//   Country: string;
//   Mobile: string;
//   Gender: string;
//   City: string;
//   Description: string;
//   CreatedDate?: string;
//   IsActive?: boolean;
// }

// types.ts
// export interface Client {
//   client_id: number;
//   client_name: string;
//   db_name: string;
//   created_by: number;
//   modified_by: number;
//   created_date: string;
//   modified_date: string;
//   document: string;
//   owner: string;
//   address: string;
//   primary_phone: string;
//   secondary_phone: string;
//   primary_email: string;
//   secondary_email: string;
//   sms_service: boolean;
//   approval_system: boolean;
//   collection_app: boolean;
// }

// export type NewClient = Omit<Client, "client_id" | "created_by" | "modified_by" | "created_date" | "modified_date" | "logo">;

export interface Client {
  client_id: number;
  client_name: string;
  db_name: string;
  created_by: number;
  modified_by: number;
  created_date: string;
  modified_date: string;
  logo: string; // string from server
  owner: string;
  address: string;
  primary_phone: string;
  secondary_phone: string;
  primary_email: string;
  secondary_email: string;
  sms_service: boolean;
  approval_system: boolean;
  collection_app: boolean;
}

export type NewClient = Omit<
  Client,
  "client_id" | "created_by" | "modified_by" | "created_date" | "modified_date" | "logo"
> & { logo?: File }; // frontend can provide a File


// export interface Client {
//   client_id: number;
//   client_name: string;
//   db_name: string;
//   created_by: number;
//   modified_by: number;
//   created_date: string;
//   modified_date: string;
//   logo: string; // previously logo
//   owner: string;
//   address: string;
//   primary_phone: string;
//   secondary_phone: string;
//   primary_email: string;
//   secondary_email: string;
//   sms_service: boolean;
//   approval_system: boolean;
//   collection_app: boolean;
// }

// // NewClient for frontend create/edit
// export type NewClient = Omit<Client, "client_id" | "created_by" | "modified_by" | "created_date" | "modified_date" | "document"> & {
//   document?: File; // optional file upload
// };


// src/types.ts
export interface Database {
  Id: number;
  Project_name: string;
  Db_name: string;
  isActive: boolean;
}

export interface NewDatabase {
  Project_name: string;
  Db_name: string;
  isActive: boolean;
}



export interface UserManagement {
  Id: number;
  Username: string;
  FullName: string;
  Email: string;
  Role: string;
  IsActive: boolean;
  CreatedDate?: string;
  LastLoginDate?: string;
}

export interface NewUser {
  Username: string;
  Password: string;
  ConfirmPassword: string;
  FullName: string;
  Email: string;
  Phone: string;
  Gender: string;
  Remarks: string;
  IsActive: boolean;
}


export interface DashboardStats {
  totalClients: number;
  totalUsers: number;
  totalDatabases: number;
  activeClients: number;
  activeUsers: number;
  activeDatabases: number;
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