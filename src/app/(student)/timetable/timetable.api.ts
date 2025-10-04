import { AxiosInstance } from "axios";

export async function getCourseTimeTable(axios: AxiosInstance) {
  const response = await axios.get(`/education/course-timetable`);

  return response.data?.data ?? [];
}
