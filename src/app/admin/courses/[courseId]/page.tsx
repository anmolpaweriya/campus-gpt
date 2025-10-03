"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation"; // if you're using app router
import { z } from "zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  MapPin,
  User,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { AdminNav } from "../../partials/admin-nav";
import { useSubjects } from "./subject.provider";
import { useFaculty } from "../../faculty/faculty.provider";

/* -----------------------
   Types and initial data
   ----------------------- */

type TimetableSlot = {
  day: string;
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  room: string;
};

type Course = {
  id: number;
  name: string; // subject name
  courseId?: string; // optional external course uuid (we'll read from params)
  teacherId?: string; // selected teacher uuid
  teacherName?: string; // kept for display convenience
  timetables: TimetableSlot[]; // updated shape
};

const initialCoursesData: Course[] = [
  {
    id: 1,
    name: "Database Management",
    teacherName: "Dr. Sarah Johnson",
    timetables: [
      { day: "Monday", startTime: "09:00", endTime: "10:30", room: "201" },
      { day: "Wednesday", startTime: "09:00", endTime: "10:30", room: "201" },
      { day: "Friday", startTime: "14:00", endTime: "15:30", room: "Lab 3" },
    ],
  },
  {
    id: 2,
    name: "Operating System",
    teacherName: "Prof. Michael Chen",
    timetables: [
      { day: "Tuesday", startTime: "11:00", endTime: "12:30", room: "305" },
      { day: "Thursday", startTime: "11:00", endTime: "12:30", room: "305" },
      { day: "Friday", startTime: "09:00", endTime: "10:30", room: "Lab 2" },
    ],
  },
  {
    id: 3,
    name: "Computer Networks",
    teacherName: "Dr. Emily Rodriguez",
    timetables: [
      { day: "Monday", startTime: "14:00", endTime: "15:30", room: "402" },
      { day: "Wednesday", startTime: "14:00", endTime: "15:30", room: "402" },
      { day: "Thursday", startTime: "15:30", endTime: "17:00", room: "Lab 5" },
    ],
  },
  {
    id: 4,
    name: "Java Programming",
    teacherName: "Prof. David Kumar",
    timetables: [
      { day: "Tuesday", startTime: "09:00", endTime: "10:30", room: "103" },
      { day: "Thursday", startTime: "09:00", endTime: "10:30", room: "103" },
      { day: "Friday", startTime: "11:00", endTime: "12:30", room: "Lab 1" },
    ],
  },
  {
    id: 5,
    name: "Software Engineering",
    teacherName: "Dr. Lisa Anderson",
    timetables: [
      { day: "Monday", startTime: "11:00", endTime: "12:30", room: "204" },
      { day: "Wednesday", startTime: "11:00", endTime: "12:30", room: "204" },
      { day: "Tuesday", startTime: "14:00", endTime: "15:30", room: "204" },
    ],
  },
];

/* -----------------------
   Zod schema + RHF types
   ----------------------- */

const timetableSlotSchema = z.object({
  day: z.string().min(1, "Day required"),
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM")
    .min(1),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "End time must be HH:MM")
    .min(1),
  room: z.string().min(1, "Room required"),
});

const courseFormSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  teacherId: z.string().uuid("Select a teacher"),
  timetables: z
    .array(timetableSlotSchema)
    .min(1, "At least one timetable slot"),
});

export type CourseForm = z.infer<typeof courseFormSchema>;

/* -----------------------
   small helper: uuid v4
   ----------------------- */
function uuidv4() {
  // small RFC4122 v4 compatible generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/* -----------------------
   Component
   ----------------------- */

export default function CoursesPage() {
  // try to get courseId from params (app router). If you provide via props change accordingly.
  const params = useParams?.() as { courseId?: string } | undefined;
  const courseIdFromParams = params?.courseId ?? undefined;

  const [courses, setCourses] = useState<Course[]>(initialCoursesData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);

  const { subjects, createSubject } = useSubjects();

  const { faculties } = useFaculty();
  /*
    Build teacher options from existing courses + timetable faculty (we have teacherName)
    Each unique teacherName gets a stable uuid assigned on first render (keeps mapping consistent).
  */

  const teacherOptions = useMemo(
    () => {
      const map = new Map<string, string>();
      for (const c of courses) {
        if (c.teacherName && !map.has(c.teacherName)) {
          map.set(c.teacherName, uuidv4());
        }
        // also we could read names from slot-specific data if available
      }
      // ensure there's at least one option
      if (map.size === 0) {
        map.set("Unassigned", uuidv4());
      }
      return Array.from(map.entries()).map(([name, id]) => ({ id, name }));
      // we intentionally do not depend on anything else so ids stay stable during this session
      // if you want persistent IDs from backend, use real teacher records.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      /* only create once per mount */
    ],
  );

  /* -----------------------
     RHF + Zod setup
     ----------------------- */

  // default values for the form (empty)
  const defaultValues: CourseForm = {
    name: "",
    teacherId: teacherOptions[0]?.id ?? uuidv4(),
    timetables: [{ day: "", startTime: "", endTime: "", room: "" }],
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CourseForm>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "timetables",
  });

  /* -----------------------
     Handlers
     ----------------------- */

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    setViewDialogOpen(true);
  };

  const handleAddCourse = () => {
    // reset form to defaults but use any default teacher id
    reset({
      ...defaultValues,
      teacherId: teacherOptions[0]?.id ?? uuidv4(),
      timetables: [{ day: "", startTime: "", endTime: "", room: "" }],
    });
    setSelectedCourse(null);
    setEditDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    // when editing we need to set teacherId (try to find teacherOptions by name)
    const tOption = teacherOptions.find((t) => t.name === course.teacherName);
    reset({
      name: course.name,
      teacherId: tOption?.id ?? teacherOptions[0]?.id ?? uuidv4(),
      timetables:
        course.timetables.length > 0
          ? course.timetables.map((s) => ({
              day: s.day,
              startTime: s.startTime,
              endTime: s.endTime,
              room: s.room,
            }))
          : [{ day: "", startTime: "", endTime: "", room: "" }],
    });
    // replace field array with course data
    replace(
      course.timetables.length > 0
        ? course.timetables.map((s) => ({
            day: s.day,
            startTime: s.startTime,
            endTime: s.endTime,
            room: s.room,
          }))
        : [{ day: "", startTime: "", endTime: "", room: "" }],
    );
    setSelectedCourse(course);
    setViewDialogOpen(false);
    setEditDialogOpen(true);
  };

  // returns an object matching the payload the user requested
  const onSubmit = async (data: CourseForm) => {
    const payload = {
      timetables: data.timetables.map((t) => ({
        day: t.day,
        startTime: t.startTime,
        endTime: t.endTime,
        room: t.room,
      })),
      name: data.name,
      courseId: courseIdFromParams ?? uuidv4(), // if you want strict courseId from params, ensure you're calling with params
      teacherId: data.teacherId,
    };

    // If editing existing (selectedCourse) update in local state; otherwise create new
    // if (selectedCourse) {
    //   setCourses((prev) =>
    //     prev.map((c) =>
    //       c.id === selectedCourse.id
    //         ? {
    //             ...c,
    //             name: payload.name,
    //             courseId: payload.courseId,
    //             teacherId: payload.teacherId,
    //             // keep teacherName from options
    //             teacherName:
    //               teacherOptions.find((t) => t.id === payload.teacherId)
    //                 ?.name ?? c.teacherName,
    //             timetables: payload.timetables,
    //           }
    //         : c,
    //     ),
    //   );
    // } else {
    //   const newCourse: Course = {
    //     id: Math.max(...courses.map((c) => c.id), 0) + 1,
    //     name: payload.name,
    //     courseId: payload.courseId,
    //     teacherId: payload.teacherId,
    //     teacherName:
    //       teacherOptions.find((t) => t.id === payload.teacherId)?.name ??
    //       "Unknown",
    //     timetables: payload.timetables,
    //   };
    //   setCourses((prev) => [...prev, newCourse]);
    // }

    await createSubject(payload);
    setEditDialogOpen(false);
    reset(defaultValues);
  };

  const handleDeleteCourse = (id: number) => {
    setCourseToDelete(id);
    setDeleteDialogOpen(true);
    setViewDialogOpen(false);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete));
      setCourseToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  /* -----------------------
     UI rendering
     ----------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <AdminNav />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-chart-2 to-chart-1 bg-clip-text text-transparent">
              My Subjects
            </h1>
            <p className="text-muted-foreground text-lg">
              {isAdmin
                ? "Manage subjects and timetables"
                : "View your enrolled subjects and class schedules"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleAddCourse} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((course) => (
            <Card
              key={course.id}
              className="border-border/50 hover:border-chart-2/50 transition-all duration-300 cursor-pointer hover:shadow-lg group"
              onClick={() => handleCardClick(course)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-chart-2/10 text-chart-2 border-chart-2/30 font-mono"
                      >
                        {course.name.split(" ").slice(0, 2).join(" ")}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-3 text-balance group-hover:text-chart-2 transition-colors">
                      {course.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">
                    {course.teacherName ?? "Unassigned"}
                  </span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {course.timetables.slice(0, 2).map((t: any, i: any) => (
                    <div key={i} className="flex items-center gap-3">
                      <Clock className="w-4 h-4" />
                      <span>
                        {t.day} · {t.startTime}-{t.endTime} · {t.room}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-gradient-to-br from-chart-2/10 to-chart-2/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-2/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {courses.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Subjects
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-chart-1/10 to-chart-1/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-1/20 rounded-lg">
                  <Clock className="w-6 h-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {courses.reduce(
                      (acc, course) => acc + course.timetables.length,
                      0,
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">Weekly Slots</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-chart-4/10 to-chart-4/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-chart-4/20 rounded-lg">
                  <User className="w-6 h-6 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {new Set(courses.map((c) => c.teacherName)).size}
                  </p>
                  <p className="text-sm text-muted-foreground">Instructors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl mb-2">
                      {selectedCourse.name}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-4 text-base">
                      <Badge
                        variant="outline"
                        className="bg-chart-2/10 text-chart-2 border-chart-2/30 font-mono"
                      >
                        {selectedCourse.courseId ?? "No Course ID"}
                      </Badge>
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {selectedCourse.teacherName ?? "Unassigned"}
                      </span>
                    </DialogDescription>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditCourse(selectedCourse)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteCourse(selectedCourse.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              </DialogHeader>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-chart-2" />
                  Weekly Timetable
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Day
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Start
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          End
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Room
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.timetables.map((slot, index) => (
                        <tr
                          key={index}
                          className="border-t hover:bg-secondary/50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium">{slot.day}</td>
                          <td className="py-3 px-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {slot.startTime}
                          </td>
                          <td className="py-3 px-4">{slot.endTime}</td>
                          <td className="py-3 px-4">
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              {slot.room}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / Add Dialog (RHF + Zod) */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent
          className=" max-h-[90vh] overflow-y-auto"
          style={{ maxWidth: "1000px" }}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedCourse ? "Edit Subject" : "Add Subject"}
            </DialogTitle>
            <DialogDescription>
              {selectedCourse
                ? "Update subject and timetable"
                : "Create a new subject with timetable"}
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6 py-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., Data Structures"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="teacher">Faculty</Label>
                {/* Using custom Select UI component - adapt to your project's select */}
                <Select
                  onValueChange={(val) => {
                    setValue("teacherId", val); // ✅ correct way
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Hidden native select synchronized with RHF so the value is actually stored */}
                <select {...register("teacherId")} className="hidden" />
                {errors.teacherId && (
                  <p className="text-sm text-destructive">
                    {errors.teacherId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Timetable Field Array */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Timetable</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ day: "", startTime: "", endTime: "", room: "" })
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-3 p-4 border rounded-lg"
                  >
                    <Controller
                      control={control}
                      name={`timetables.${index}.day`}
                      defaultValue={field.day}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    <Input
                      type="time"
                      placeholder="Start Time"
                      {...register(`timetables.${index}.startTime` as const)}
                      defaultValue={field.startTime}
                    />
                    <Input
                      type="time"
                      placeholder="End Time"
                      {...register(`timetables.${index}.endTime` as const)}
                      defaultValue={field.endTime}
                    />
                    <Input
                      placeholder="Room"
                      {...register(`timetables.${index}.room` as const)}
                      defaultValue={field.room}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {/* show validation errors per row if any */}
                    {errors.timetables && (errors.timetables as any)[index] && (
                      <div className="md:col-span-5 text-sm text-destructive mt-2">
                        {Object.values(
                          (errors.timetables as any)[index] as any,
                        ).map((m: any, i: number) => (
                          <div key={i}>{m?.message}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setEditDialogOpen(false);
                  reset(defaultValues);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedCourse ? "Update Subject" : "Add Subject"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              subject and its timetable.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
