import { AxiosInstance } from "axios";
import { EventFormData } from "./events.types";

export async function getEventsData(axios: AxiosInstance) {
  const response = await axios.get("/events");
  return response?.data?.data ?? [];
}
export async function createNewEvent(
  axios: AxiosInstance,
  data: EventFormData,
) {
  const response = await axios.post("/events", data);
  return response?.data?.data;
}
export async function removeEvent(axios: AxiosInstance, id: string) {
  const response = await axios.delete("/events?id=" + id);
  return response?.data?.data;
}
