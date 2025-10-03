import { AxiosInstance } from "axios";
import { CourseForm } from "./page";

export async function getAllSubjects(axios: AxiosInstance, courseId?: string) {
  const res = await axios.get(`education/subjects`);

  return res?.data?.data ?? [];
}

export async function createSubjects(axios: AxiosInstance, data: any) {
  const res = await axios.post(`education/subjects`, data);

  return res?.data?.data ?? [];
}
