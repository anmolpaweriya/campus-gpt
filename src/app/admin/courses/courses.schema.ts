import { z } from "zod";

export const courseSchema = z.object({
  name: z.string().min(3, "Course name is required"),
  code: z.string().min(2, "Course code is required"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
