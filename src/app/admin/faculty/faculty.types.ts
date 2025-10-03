import z from "zod";

export const facultySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  designation: z.string().min(1, "Designation is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
});

export type FacultyFormData = z.infer<typeof facultySchema>;
