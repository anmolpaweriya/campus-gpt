"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockTimetable } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentNav } from "../dashboard/partials/student-nav";
import { getCourseTimeTable } from "./timetable.api";
import { useAxios } from "@/services/axios/axios.hooks";
import { useEffect, useState } from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetablePage() {
  const { axios } = useAxios();
  const [timetable, setTimetable] = useState<any[]>([]);
  const todayIndex = new Date().getDay();
  const todayName = todayIndex === 0 ? "Sunday" : days[todayIndex - 1];
  console.log("anisole", todayIndex, todayName);
  const getTypeColor = (type: string) => {
    switch (type) {
      case "lecture":
        return "bg-primary/10 text-primary border-primary/20";
      case "lab":
        return "bg-accent/10 text-accent border-accent/20";
      case "tutorial":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  async function fetchCourseTimeTable() {
    const data = await getCourseTimeTable(axios);
    setTimetable(data);
  }

  useEffect(() => {
    fetchCourseTimeTable();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Weekly Timetable</h1>
          <p className="text-muted-foreground">
            Your complete class schedule for the week
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {days.map((day) => {
            const classes = timetable[day as any];
            const isToday = day == todayName;
            return (
              <Card
                key={day}
                className={cn(
                  "border-border/50",
                  isToday && "ring-2 ring-primary/50",
                )}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    {day}
                    {isToday && (
                      <Badge variant="default" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {classes?.length ?? 0} classes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 overflow-y-scroll max-h-[300px]">
                  {!classes?.length ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No classes scheduled
                    </div>
                  ) : (
                    classes.map((slot, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-secondary/50 border border-border/50 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-tight text-foreground">
                            {slot?.subject?.name}
                          </h4>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs flex-shrink-0",
                              getTypeColor(slot?.course?.code),
                            )}
                          >
                            {slot?.course?.code}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{slot.room}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                          {slot.faculty?.name}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Legend */}
        <Card className="mt-6 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Class Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor("lecture")}>
                  Lecture
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Theory classes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor("lab")}>
                  Lab
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Practical sessions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getTypeColor("tutorial")}>
                  Tutorial
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Problem solving
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
