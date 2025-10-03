import { AxiosInstance } from "axios";

export async function getAllCourses(axios: AxiosInstance) {
  const res = await axios.get("/courses");
  return res?.data?.data ?? [];
}
