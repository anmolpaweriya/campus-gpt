"use client";
import { useAxios } from "@/services/axios/axios.hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAdminDashboardData } from "./admin.api";

export type AdminDashboardType = {
  dashboardData: any;
  isLoadingAdminDashboard: boolean;
};

export const adminDashboardContext = React.createContext<
  AdminDashboardType | undefined
>(undefined);

export const useAdminDashboard = () => {
  const context = React.useContext(adminDashboardContext);
  if (context === undefined) {
    throw new Error(
      "useAdminDashboard must be used within a AdminDashboardProvider",
    );
  }
  return context;
};

export const AdminDashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { axios } = useAxios();
  const { data: dashboardData, isLoading: isLoadingAdminDashboard } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      return await getAdminDashboardData(axios);
    },
  });

  return (
    <adminDashboardContext.Provider
      value={{ dashboardData, isLoadingAdminDashboard }}
    >
      {children}
    </adminDashboardContext.Provider>
  );
};
