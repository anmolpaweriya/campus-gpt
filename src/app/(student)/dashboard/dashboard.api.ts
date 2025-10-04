import { AxiosInstance } from "axios";

export async function getDashboardData(axios: AxiosInstance) {
  const response = await axios.get("/dashboard/student");
  return response?.data?.data;
}
