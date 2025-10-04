"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/lib/mock-data";
import { Search, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { AdminNav } from "../partials/admin-nav";
import { useEventContext } from "./events.provider";
import { EventFormData, eventSchema } from "./events.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createNewEvent } from "./events.api";

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { events, isLoadingEvents, handleCreateEvent, handleDeleteEvent } =
    useEventContext();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema) as any,
  });

  const onSubmit = (data: EventFormData) => {
    startTransition(async () => {
      await handleCreateEvent(data);
      setTimeout(() => {
        setIsDialogOpen(false);
        reset();
      }, 1000); // Simulate a 1s delay
    });
  };
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-primary/10 text-primary border-primary/20";
      case "cultural":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "sports":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "workshop":
        return "bg-accent/10 text-accent border-accent/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  function getEventTime(isoDate: string) {
    const date = new Date(isoDate);

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  }
  if (isLoadingEvents)
    return (
      <div className="w-full h-full text-2xl text-gray-400 flex justify-center items-center">
        Loading ...
      </div>
    );
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Event Management</h1>
          <p className="text-muted-foreground">View and manage campus events</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, description, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add Event</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                      Add New Event
                    </DialogTitle>
                    <DialogDescription>
                      Enter the event’s details
                    </DialogDescription>
                  </DialogHeader>

                  {/* ✅ Form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Dr. John Doe"
                        {...register("name")}
                        className="bg-secondary/50"
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="some details about the event"
                        {...register("description")}
                        className="bg-secondary/50"
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Timing</Label>
                      <Input
                        id="time"
                        placeholder="Enter the event location"
                        {...register("time")}
                        className="bg-secondary/50"
                        type="datetime-local"
                      />
                      {errors.time && (
                        <p className="text-sm text-red-500">
                          {errors.time.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Location</Label>
                      <Input
                        id="phone"
                        placeholder="Enter the event location"
                        {...register("location")}
                        className="bg-secondary/50"
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          reset();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1">
                        Add Event
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="border-border/50 hover:border-chart-4/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getEventTypeColor(event.type))}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {event.type}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {new Date(event.time).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {getEventTime(event.time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.location}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50 flex gap-2">
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    variant="destructive"
                    size="sm"
                    className="flex-1 "
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No events found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
