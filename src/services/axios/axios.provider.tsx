"use client";
import React from "react";
import axios from "axios";
import { AxiosContext } from "./axios.context";
import { useSupabaseContext } from "@/providers/supabse.provider";

export default function AxiosProvider(props: React.PropsWithChildren) {
  const { session } = useSupabaseContext();

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-device-type": "web",
      "x-user-id": session?.user.id,
    },
    // timeout: 10000,
    responseType: "json",
    // withCredentials: true
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // if(error.response?.status == 401)

      // Logger.log(
      //     "AxiosError",
      //     error?.config?.url,
      //     error.constructor.name,
      //     error?.response?.data ?? error.message,
      //     error.stack,
      //     true,
      // );
      return Promise.reject(error);
    },
  );

  return (
    <AxiosContext.Provider
      value={{
        axios: instance,
      }}
    >
      {props.children}
    </AxiosContext.Provider>
  );
}
