"use client";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, ReactNode } from "react";
import { createFaculty, fetchAllFaculty } from "./facutly.api";
import { useAxios } from "@/services/axios/axios.hooks";
import { FacultyFormData } from "./faculty.types";

export type FacultyContextType = {
  faculties: any[];
  isLoadingCourses: boolean;
  refetchCourses: () => void;
  addFaculty: (data: FacultyFormData) => Promise<void>;
  updateFaculty: (id: string, data: any) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
};
const facultyContext = createContext<FacultyContextType | undefined>(undefined);

export const useFaculty = () => {
  const context = React.useContext(facultyContext);
  if (!context) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
};

export const FacultyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { axios } = useAxios();
  const {
    data: faculties = [],
    isLoading: isLoadingCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: async () => {
      return await fetchAllFaculty(axios);
    },
  });

  const addFaculty = async (data: FacultyFormData) => {
    try {
      const res = await createFaculty(axios, data);
      if (res) console.log("created");
    } catch (error: any) {
      console.log(error);
    } finally {
      refetchCourses();
    }
  };

  const updateFaculty = async () => {};

  const deleteFaculty = async () => {};

  return (
    <facultyContext.Provider
      value={{
        faculties,
        addFaculty,
        refetchCourses,
        isLoadingCourses,
        updateFaculty,
        deleteFaculty,
      }}
    >
      {children}
    </facultyContext.Provider>
  );
};
