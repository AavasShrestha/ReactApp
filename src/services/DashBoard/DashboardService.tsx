// src/services/dashboardService.ts

import api from "../api";
import { DashboardStats } from "../../types";

export const DashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardStats>("/Dashboard/stats"); 
      // 👆 adjust endpoint according to your backend (example: /api/dashboard/stats)
      return response.data;
    } catch (error) {
      console.error("Dashboard stats fetch error:", error);
      throw error;
    }
  },
};
