"use client";

import { useEffect, useState } from "react";
import { Building } from "../building.types";
import { BuildingForm } from "./building-form";
import { MapSelector } from "./map-selector";
import { BuildingList } from "./building-list";
import {
  createBuilding,
  getAllBuildings,
  removeBuildings,
} from "../buidling.api";
import { useAxios } from "@/services/axios/axios.hooks";

export function LocationManager() {
  const { axios } = useAxios();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
    placeId: string;
  } | null>(null);

  async function fetchAllBuildings() {
    setIsLoadingBuildings(true);
    const data = await getAllBuildings(axios);
    setBuildings(data);
    setIsLoadingBuildings(false);
  }

  const handleAddBuilding = async (
    building: Omit<Building, "id" | "createdAt">,
  ) => {
    await createBuilding(axios, building);
    setSelectedLocation(null);
    fetchAllBuildings();
  };

  const handleDeleteBuilding = async (id: string) => {
    await removeBuildings(axios, id);
    fetchAllBuildings();
  };

  useEffect(() => {
    fetchAllBuildings();
  }, []);
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <MapSelector
          onLocationSelect={setSelectedLocation}
          selectedLocation={selectedLocation}
          buildings={buildings}
        />
        <BuildingForm
          selectedLocation={selectedLocation}
          onSubmit={handleAddBuilding}
          onCancel={() => setSelectedLocation(null)}
        />
      </div>
      <div>
        {isLoadingBuildings ? (
          <div className="w-full h-full text-2xl text-gray-400 flex justify-center items-center">
            Loading ...
          </div>
        ) : (
          <BuildingList buildings={buildings} onDelete={handleDeleteBuilding} />
        )}
      </div>
    </div>
  );
}
