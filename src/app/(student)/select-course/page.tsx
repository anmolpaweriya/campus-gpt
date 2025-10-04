"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";
import { useAxios } from "@/services/axios/axios.hooks";
import { useRouter } from "next/navigation";

interface Course {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseSelection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const { toast } = useToast();
  //
  const { axios } = useAxios();
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/education/courses");

        setCourses(res?.data?.data || []);
      } catch (error) {
        console.log("[v0] Error fetching courses:", error);
        // toast({
        //   title: "Error",
        //   description: "Failed to load courses. Please try again.",
        //   variant: "destructive",
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
  };

  const handleJoinCourse = async () => {
    if (!selectedCourse) return;

    setIsJoining(true);

    try {
      const response = await axios.post("/education/course/join", {
        courseId: selectedCourse,
      });
      if (response?.data?.data) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("[v0] Error joining course:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-accent">
            Select Your Course
          </h2>
          <p className="text-muted-foreground">
            Choose a course to join and start learning
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent"></div>
              <p className="text-muted-foreground">Loading courses...</p>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No courses available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {courses.map((course) => {
                const isSelected = selectedCourse === course.id;

                return (
                  <Card
                    key={course.id}
                    className={cn(
                      "group relative cursor-pointer border bg-card p-6 transition-all hover:shadow-md",
                      isSelected
                        ? "border-accent shadow-sm ring-2 ring-accent ring-offset-2"
                        : "border-border",
                    )}
                    onClick={() => handleCourseSelect(course.id)}
                  >
                    <div className="mb-3">
                      <span className="inline-block rounded bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                        {course.code}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-semibold text-card-foreground">
                      {course.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        Created:{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute right-4 top-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                          <svg
                            className="h-4 w-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                disabled={!selectedCourse || isJoining}
                onClick={handleJoinCourse}
                className="min-w-[200px] bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isJoining ? "Joining..." : "Join Course"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/*<Toaster />*/}
    </div>
  );
}
