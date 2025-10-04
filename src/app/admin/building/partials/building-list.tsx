"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Building2, Trash2, Calendar } from "lucide-react";
import { Building } from "../building.types";

interface BuildingListProps {
  buildings: Building[];
  onDelete: (id: string) => void;
}

export function BuildingList({ buildings, onDelete }: BuildingListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Buildings</h2>
        <span className="text-sm px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-700 font-medium">
          {buildings.length} locations
        </span>
      </div>

      <div className="space-y-3">
        {buildings.map((building) => (
          <Card
            key={building.id}
            className="p-5 border-2 border-transparent bg-white hover:border-blue-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 text-balance">
                      {building.name}
                    </h3>
                    {/*<span className="inline-block px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 rounded-md">
                      {building.type}
                    </span>*/}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span className="break-words">{building.description}</span>
                  </div>
                  {/*
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>{building.capacity} capacity</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-cyan-500" />
                      <span>{building.floors} floors</span>
                    </div>
                  </div>*/}

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Added {building.createdAt?.split("T")?.[0]}</span>
                  </div>

                  <div className="pt-2 border-t border-gradient-to-r from-blue-200 via-purple-200 to-cyan-200">
                    <p className="text-xs text-muted-foreground font-mono">
                      Coordinates: {building.latitude.toFixed(6)},{" "}
                      {building.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Place ID: {building.id}
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(building.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
