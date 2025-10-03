"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import { createCourse, getAllCourses } from "./courses.api";
import { useAxios } from "@/services/axios/axios.hooks";
import { CourseFormValues } from "./courses.schema";

// const {
//   data: rooms = [],
//   isLoading: isLoadingRooms,
//   refetch: refetchRooms,
// } = useQuery({
//   queryKey: ["chat-rooms"],
//   queryFn: async () => await getAllChatRoom(axios),
// });

export type coursesContextType = {
  courses: any[];
  isLoadingCourses: boolean;
  refetchCourses: () => void;
  createnewCourse: (data: CourseFormValues) => Promise<void>;
};

export const coursesContext = React.createContext<
  coursesContextType | undefined
>(undefined);

export function useCourses() {
  const context = React.useContext(coursesContext);
  if (!context) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
}

export const CoursesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { axios } = useAxios();

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      return await getAllCourses(axios);
    },
  });

  async function createnewCourse(data: CourseFormValues) {
    try {
      const res = await createCourse(axios, data);

      // if(res.data) toast.success("Course created successfully")
    } catch (error: any) {}
  }

  return (
    <coursesContext.Provider
      value={{
        courses,
        isLoadingCourses,
        refetchCourses,
        createnewCourse,
      }}
    >
      {children}
    </coursesContext.Provider>
  );
};
//         isLoadingMessages,
//         isFetchingResponse,
//         handleSendMessage,
//         handleDeleteChat,
//       }}
//     >
//       {children}
//     </ChatbotContext.Provider>
//   );
// };
