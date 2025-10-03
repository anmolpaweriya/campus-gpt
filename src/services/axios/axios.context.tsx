"use client";
import React from "react";
import { AxiosInstance } from "axios";

export const AxiosContext = React.createContext<{
  axios: AxiosInstance;
}>({
  axios: {} as AxiosInstance,
});
