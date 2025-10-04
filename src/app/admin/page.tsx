"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  mockStudents,
  mockFaculty,
  mockClasses,
  mockEvents,
} from "@/lib/mock-data";
import {
  Users,
  UserCog,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  Building,
} from "lucide-react";
import { AdminNav } from "./partials/admin-nav";
import { useAdminDashboard } from "./admin.provider";

export default function AdminDashboard() {
  const { dashboardData, isLoadingAdminDashboard } = useAdminDashboard();
  const stats = [
    {
      title: "Total Students",
      value: dashboardData?.totalStudents ?? 0,
      description: "Active enrollments",
      icon: Users,
      gradient: "from-primary to-accent",
      glow: "glow-primary",
    },
    {
      title: "Faculty Members",
      value: dashboardData?.totalFaculty ?? 0,
      description: "Teaching staff",
      icon: UserCog,
      gradient: "from-accent to-chart-3",
      glow: "glow-accent",
    },
    {
      title: "Total Courses",
      value: dashboardData?.totalCourses ?? 0,
      description: "This Year",
      icon: BookOpen,
      gradient: "from-chart-3 to-chart-4",
      glow: "glow-primary",
    },
    {
      title: "Total Buildings",
      value: dashboardData?.totalBuildings ?? 0,
      description: "University buildings",
      icon: Building,
      gradient: "from-chart-4 to-primary",
      glow: "glow-accent",
    },
  ];

  if (isLoadingAdminDashboard)
    return (
      <div className="w-full h-full text-2xl text-gray-400 flex justify-center items-center">
        Loading ...
      </div>
    );
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 relative">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <h1 className="text-5xl font-bold mb-3 relative">
            <span className="bg-gradient-to-r from-primary via-accent to-chart-3 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            Manage your campus operations and view analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className={`border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-300 hover:scale-105 ${stat.glow} group`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardDescription className="text-base">
                      {stat.title}
                    </CardDescription>
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20 bg-gradient-card backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Recent Students
              </CardTitle>
              <CardDescription>Latest student enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.recentEnrollments?.map(
                  (student: any, index: number) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/30 to-secondary/10 border border-border/50 hover:border-primary/30 hover:from-secondary/50 hover:to-secondary/20 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div>
                        <p className="font-semibold text-foreground text-base">
                          Student enrolled in {student?.course?.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {student.id} • {student?.course?.code}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end w-full  gap-1.5 text-sm font-bold">
                          <div className="p-1.5 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                            <Award className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-primary">{student.gpa}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          enrolled at {student.createdAt?.split("T")?.[0]}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 bg-gradient-card backdrop-blur-sm hover:border-accent/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-accent" />
                Department Overview
              </CardTitle>
              <CardDescription>
                Student distribution by department
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {dashboardData?.departmentOverview
                  ?.sort((a: any, b: any) => b.studentCount - a.studentCount)
                  .map((course: any) => (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium">
                          {course.name}
                        </span>
                        <span className="font-bold text-primary">
                          {course.studentCount} students
                        </span>
                      </div>
                      <div className="h-3 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${(course.studentCount / 10) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-chart-3/20 bg-gradient-card backdrop-blur-sm hover:border-chart-3/30 transition-all duration-300 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-chart-3" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Campus activities and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="p-5 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border-2 border-border/50 hover:border-chart-3/30 hover:from-secondary/50 hover:to-secondary/20 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-foreground text-base">
                        {event.title}
                      </h4>
                      <div className="p-2 rounded-lg bg-chart-3/20 group-hover:bg-chart-3/30 transition-colors">
                        <Calendar className="w-4 h-4 text-chart-3" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {event.description}
                    </p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString()} •{" "}
                        {event.time}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
