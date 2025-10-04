"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Building } from "../building.types";

interface BuildingFormProps {
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
  } | null;
  onSubmit: (building: Omit<Building, "id" | "createdAt">) => void;
  onCancel: () => void;
}

export function BuildingForm({
  selectedLocation,
  onSubmit,
  onCancel,
}: BuildingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!selectedLocation) {
      setFormData({ name: "", description: "" });
    }
  }, [selectedLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    onSubmit({
      name: formData.name,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      description: formData.description,
    });

    setFormData({ name: "", description: "" });
  };

  if (!selectedLocation) {
    return (
      <Card className="p-8 border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3">
            <Plus className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-1">Select a Location</h3>
          <p className="text-sm text-muted-foreground">
            Click on the map or search for a location to add a new building
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-blue-200 bg-white shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Add Building Details
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Building Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Main Academic Building"
            required
            className="bg-white border-blue-200 focus:border-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="e.g., which types of courses held on this building"
            required
            className="bg-white border-blue-200 focus:border-blue-400"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Building
          </Button>
        </div>
      </form>
    </Card>
  );
}
