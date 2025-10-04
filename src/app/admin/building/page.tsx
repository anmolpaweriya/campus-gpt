import { AdminNav } from "../partials/admin-nav";
import { LocationManager } from "./partials/location-manager";

export default function BuildingLocationPage() {
  return (
    <div className="min-h-screen bg-white">
      <AdminNav />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-balance mb-2">
            Building Location Management
          </h1>
          <p className="text-muted-foreground text-lg">
            Add and manage building locations with interactive map selection
          </p>
        </div>
        <LocationManager />
      </main>
    </div>
  );
}
