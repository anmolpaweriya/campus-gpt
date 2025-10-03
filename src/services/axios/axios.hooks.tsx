import React from "react";
import { AxiosContext } from "./axios.context";

export const useAxios = () => {
  const axiosInstance = React.useContext(AxiosContext);
  if (!axiosInstance)
    throw new Error("useAxios must be used within an AxiosProvider");
  return axiosInstance;
};
