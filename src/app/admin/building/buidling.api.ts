import { AxiosInstance } from "axios";
import { Building } from "./building.types";

export async function getAllBuildings(axios: AxiosInstance) {
  const res = await axios.get("/building");
  return res?.data?.data ?? [];
}

export async function removeBuildings(axios: AxiosInstance, id: string) {
  const res = await axios.delete("/building?id=" + id);
  return res?.data?.data;
}

export async function createBuilding(
  axios: AxiosInstance,
  data: Omit<Building, "id" | "createdAt">,
) {
  const res = await axios.post("/building", data);
  return res?.data?.data;
}
