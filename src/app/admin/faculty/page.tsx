"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockFaculty } from "@/lib/mock-data";
import { Search, Mail, BookOpen, UserCog, Plus, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminNav } from "../partials/admin-nav";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FacultyFormData, facultySchema } from "./faculty.types";
import { useFaculty } from "./faculty.provider";

export default function FacultyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { addFaculty, faculties, refetchCourses, isLoadingCourses } =
    useFaculty();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
  });

  const filteredFaculty = faculties.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.designation.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = (data: FacultyFormData) => {
    startTransition(async () => {
      await addFaculty(data);
      setTimeout(() => {
        setIsDialogOpen(false);
        reset();
      }, 1000); // Simulate a 1s delay
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Faculty Management</h1>
          <p className="text-muted-foreground">
            View and manage teaching staff
          </p>
        </div>

        {/* Search & Actions */}
        <Card className="mb-6 border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, department, or designation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2" disabled={isPending}>
                    <Plus className="w-4 h-4" />
                    {isPending ? "Adding..." : "Add Faculty"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                      Add New Faculty
                    </DialogTitle>
                    <DialogDescription>
                      Enter the faculty member’s details
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@university.edu"
                        {...register("email")}
                        className="bg-secondary/50"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        placeholder="e.g., Assistant Professor"
                        {...register("designation")}
                        className="bg-secondary/50"
                      />
                      {errors.designation && (
                        <p className="text-sm text-red-500">
                          {errors.designation.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="9876543210"
                        {...register("phone")}
                        className="bg-secondary/50"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">
                          {errors.phone.message}
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
                        Add Faculty
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Faculty List */}

        {isLoadingCourses ? (
          <div className="w-full h-full text-2xl text-gray-400 flex justify-center items-center">
            Loading ...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map((faculty) => (
              <Card
                key={faculty.id}
                className="border-border/50 hover:border-accent/50 transition-colors shadow-sm"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-1">
                        {faculty.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-muted-foreground text-sm">
                        <UserCog className="w-4 h-4" />
                        {faculty.designation}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 justify-start bg-transparent text-foreground"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{faculty.email}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 justify-start bg-transparent text-foreground"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="truncate">{faculty.phone}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredFaculty.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No faculty members found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
