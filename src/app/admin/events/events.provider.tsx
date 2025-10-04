"use client";
import { useAxios } from "@/services/axios/axios.hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { createNewEvent, getEventsData, removeEvent } from "./events.api";
import { EventFormData } from "./events.types";

export type EventType = {
  events: any[];
  isLoadingEvents: boolean;
  handleCreateEvent: (data: EventFormData) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;
};

export const EventContext = React.createContext<EventType | undefined>(
  undefined,
);

export const useEventContext = () => {
  const context = React.useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within a EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { axios } = useAxios();
  const {
    data: events,
    isLoading: isLoadingEvents,
    refetch: refetchEvents,
  } = useQuery({
    queryKey: ["Events"],
    queryFn: async () => {
      return await getEventsData(axios);
    },
  });

  async function handleCreateEvent(data: EventFormData) {
    await createNewEvent(axios, data);
    refetchEvents();
  }
  async function handleDeleteEvent(id: string) {
    await removeEvent(axios, id);
    refetchEvents();
  }

  return (
    <EventContext.Provider
      value={{
        events: events ?? [],
        isLoadingEvents,
        handleCreateEvent,
        handleDeleteEvent,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
