"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/lib/mock-data";
import { Search, Clock, MapPin, BookOpen, Award, Plus } from "lucide-react";
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
import { AdminNav } from "../partials/admin-nav";
import { getAllCourses } from "./courses.api";
import { useAxios } from "@/services/axios/axios.hooks";
import { useCourses } from "./courses.provider";
import Link from "next/link";

// ✅ Zod schema for form
const courseSchema = z.object({
  name: z.string().min(3, "Course name is required"),
  code: z.string().min(2, "Course code is required"),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { courses, refetchCourses, createnewCourse } = useCourses();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      await createnewCourse(data);
      reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
      refetchCourses();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Course Management</h1>
          <p className="text-muted-foreground">View and manage all courses</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by course name, code, or faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary/50"
                />
              </div>
              <Button variant="outline">Filter</Button>

              {/* Add Course Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] border-chart-2/20">
                  <DialogHeader>
                    <DialogTitle className="text-2xl bg-gradient-to-r from-chart-2 to-primary bg-clip-text text-transparent">
                      Add New Course
                    </DialogTitle>
                    <DialogDescription>
                      Enter the course name and code
                    </DialogDescription>
                  </DialogHeader>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name">Course Name</Label>
                      <Input
                        id="name"
                        placeholder="Data Structures and Algorithms"
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
                      <Label htmlFor="code">Course Code</Label>
                      <Input
                        id="code"
                        placeholder="CS201"
                        {...register("code")}
                        className="bg-secondary/50"
                      />
                      {errors.code && (
                        <p className="text-sm text-red-500">
                          {errors.code.message}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Add Course"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="border-border/50 hover:border-chart-2/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="bg-chart-2/10 text-chart-2 border-chart-2/20"
                      >
                        {course.code}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="pt-3 border-t border-border/50 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                  >
                    Edit
                  </Button>
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex-1 bg-transparent"
                  >
                    View Details
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="border-border/50 mt-6">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No courses found matching your search.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
