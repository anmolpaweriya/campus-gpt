import { AxiosInstance } from "axios";
import { CourseFormValues } from "./courses.schema";

export async function getAllCourses(axios: AxiosInstance) {
  const res = await axios.get("/education/courses");
  return res?.data?.data ?? [];
}

export async function createCourse(
  axios: AxiosInstance,
  data: CourseFormValues,
) {
  const res = await axios.post("/education/courses", data);
  return res?.data?.data;
}
