"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StudentNav } from "./partials/student-nav";
import { mockEvents, mockTimetable } from "@/lib/mock-data";
import { useSupabaseContext } from "@/providers/supabse.provider";

export default function StudentDashboard() {
  const { user, isLoading } = useSupabaseContext();

  const todayClasses = mockTimetable
    .filter((slot) => slot.day === "Monday")
    .slice(0, 3);
  const upcomingEvents = mockEvents.slice(0, 2);

  if (isLoading) return <>Loading ...</>;
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 relative">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <h1 className="text-5xl font-bold mb-3 text-balance relative">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {user?.user_metadata?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-muted-foreground text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            Here&apos;s what&apos;s happening with your academics today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Current GPA</CardDescription>
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                3.8
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +0.2 from last semester
              </p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-card via-card to-accent/5 hover:border-accent/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Enrolled Courses</CardDescription>
                <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                  <BookOpen className="w-4 h-4 text-accent" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">6</div>
              <p className="text-xs text-muted-foreground mt-1">
                18 credits this semester
              </p>
            </CardContent>
          </Card>

          <Card className="border-chart-3/20 bg-gradient-to-br from-card via-card to-chart-3/5 hover:border-chart-3/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-chart-3/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Attendance</CardDescription>
                <div className="p-2 rounded-lg bg-chart-3/10 group-hover:bg-chart-3/20 transition-colors">
                  <Calendar className="w-4 h-4 text-chart-3" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-chart-3">92%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Above required 75%
              </p>
            </CardContent>
          </Card>

          <Card className="border-chart-4/20 bg-gradient-to-br from-card via-card to-chart-4/5 hover:border-chart-4/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-chart-4/20 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Pending Tasks</CardDescription>
                <div className="p-2 rounded-lg bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
                  <Clock className="w-4 h-4 text-chart-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-chart-4">4</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 due this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/50 bg-gradient-card backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Today&apos;s Schedule
                  </CardTitle>
                  <CardDescription>Your classes for today</CardDescription>
                </div>
                <Link href="/timetable">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {todayClasses.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/50 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0 w-20 text-center p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                    <div className="text-sm font-bold text-primary">
                      {slot.time.split(" - ")[0]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {slot.time.split(" - ")[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground text-lg">
                        {slot.subject}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-xs border-primary/30 text-primary"
                      >
                        {slot.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {slot.faculty}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {slot.room}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50 bg-gradient-card backdrop-blur-sm hover:border-accent/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Quick Actions</CardTitle>
                <CardDescription>Access key features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/chatbot">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:border-primary/40 hover:from-primary/20 hover:to-accent/20 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        AI Assistant
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ask questions, get help
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/timetable">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-auto py-4 bg-gradient-to-r from-accent/10 to-chart-3/10 border-accent/20 hover:border-accent/40 hover:from-accent/20 hover:to-chart-3/20 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        View Timetable
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Check your schedule
                      </div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-card backdrop-blur-sm hover:border-chart-3/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Upcoming Events</CardTitle>
                <CardDescription>Don&apos;t miss out</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl bg-gradient-to-br from-secondary/30 to-secondary/10 border border-border/50 hover:border-chart-3/30 hover:from-secondary/50 hover:to-secondary/20 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-chart-3/20 group-hover:bg-chart-3/30 transition-colors">
                        <Calendar className="w-4 h-4 text-chart-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground">
                          {event.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground ml-11">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
