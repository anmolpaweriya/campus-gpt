"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import type { google } from "google-maps";
import { Building } from "../building.types";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface MapSelectorProps {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
  }) => void;
  selectedLocation: {
    lat: number;
    lng: number;
    address: string;
    placeId: string;
  } | null;
  buildings: Building[];
}

export function MapSelector({
  onLocationSelect,
  selectedLocation,
  buildings,
}: MapSelectorProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchBox, setSearchBox] =
    useState<google.maps.places.SearchBox | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 31.255775, lng: 75.704643 },
        zoom: 17,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE,
      });

      setMap(mapInstance);

      // Add click listener
      mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              onLocationSelect({
                lat: e.latLng!.lat(),
                lng: e.latLng!.lng(),
                address: results[0].formatted_address,
                placeId: results[0].place_id,
              });
            }
          });
        }
      });

      // Setup search box
      if (searchInputRef.current) {
        const searchBoxInstance = new window.google.maps.places.SearchBox(
          searchInputRef.current,
        );
        setSearchBox(searchBoxInstance);

        mapInstance.addListener("bounds_changed", () => {
          searchBoxInstance.setBounds(
            mapInstance.getBounds() as google.maps.LatLngBounds,
          );
        });

        searchBoxInstance.addListener("places_changed", () => {
          const places = searchBoxInstance.getPlaces();
          if (places && places.length > 0) {
            const place = places[0];
            if (place.geometry?.location) {
              mapInstance.setCenter(place.geometry.location);
              mapInstance.setZoom(17);
              onLocationSelect({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || "",
                placeId: place.place_id || "",
              });
            }
          }
        });
      }
    };

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCYqI1JXMwqrFXxIBd2doBV14VSevQzUM0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Update marker when location changes
  useEffect(() => {
    if (map && selectedLocation) {
      if (marker) {
        marker.setMap(null);
      }

      const newMarker = new window.google.maps.Marker({
        position: { lat: selectedLocation.lat, lng: selectedLocation.lng },
        map: map,
        animation: window.google.maps.Animation.DROP,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#6366f1",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      setMarker(newMarker);
      map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
  }, [map, selectedLocation]);

  // Add building markers
  useEffect(() => {
    if (map && buildings.length > 0) {
      buildings.forEach((building) => {
        new window.google.maps.Marker({
          position: { lat: building.latitude, lng: building.longitude },
          map: map,
          title: building.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#10b981",
            fillOpacity: 0.8,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
        });
      });
    }
  }, [map, buildings]);

  return (
    <Card className="overflow-hidden border-border bg-card">
      <div className="p-4 border-b border-border bg-card/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="pl-10 bg-background"
          />
        </div>
        {selectedLocation && (
          <div className="mt-3 flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-foreground">Selected Location</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                {selectedLocation.address}
              </p>
              <p className="text-muted-foreground text-xs font-mono mt-1">
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        )}
      </div>
      <div ref={mapRef} className="w-full h-[500px] bg-muted" />
    </Card>
  );
}
