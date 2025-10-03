import { AxiosInstance } from "axios";
import { FacultyFormData } from "./faculty.types";

export async function fetchAllFaculty(axios: AxiosInstance) {
  const res = await axios.get("/faculty");
  return res?.data?.data;
}

export async function createFaculty(
  axios: AxiosInstance,
  data: FacultyFormData,
) {
  const res = await axios.post("/faculty", data);
  return res?.data?.data;
}
