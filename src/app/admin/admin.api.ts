import { AxiosInstance } from "axios";

export async function getAdminDashboardData(axios: AxiosInstance) {
  const response = await axios.get("/dashboard/admin");
  return response?.data?.data;
}
