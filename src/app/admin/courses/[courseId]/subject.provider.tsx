"use client";

import { useAxios } from "@/services/axios/axios.hooks";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState, useEffect } from "react";
import { createSubjects, getAllSubjects } from "./subject.api";
import { CourseForm } from "./page";

interface SubjectContextType {
  subjects: any[];
  createSubject: (data: any) => Promise<void>;
  isLoadingCourses: boolean;
  refetchCourses: () => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const useSubjects = () => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error("useSubjects must be used within a SubjectProvider");
  }
  return context;
};

export const SubjectProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { axios } = useAxios();
  const {
    data: subjects = [],
    isLoading: isLoadingCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      return await getAllSubjects(axios);
    },
  });

  async function createSubject(data: any) {
    try {
      const res = await createSubjects(axios, data);
    } catch (err: any) {
    } finally {
      refetchCourses();
    }
  }

  return (
    <SubjectContext.Provider
      value={{ subjects, isLoadingCourses, refetchCourses, createSubject }}
    >
      {children}
    </SubjectContext.Provider>
  );
};
