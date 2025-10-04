"use client";
import { useAxios } from "@/services/axios/axios.hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getDashboardData } from "./dashboard.api";

export type CreateDashboardType = {
  dashboardData: any;
  refetchCourses: () => void;
  isLoadingCourses: boolean;
};

export const createDashboardContext = React.createContext<
  CreateDashboardType | undefined
>(undefined);

export const useDashboard = () => {
  const context = React.useContext(createDashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { axios } = useAxios();
  const {
    data: dashboardData,
    isLoading: isLoadingCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["stuentDashboard"],
    queryFn: async () => {
      return await getDashboardData(axios);
    },
  });

  return (
    <createDashboardContext.Provider
      value={{ dashboardData, isLoadingCourses, refetchCourses }}
    >
      {children}
    </createDashboardContext.Provider>
  );
};
