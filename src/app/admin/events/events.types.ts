import z from "zod";

export const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "description is required"),
  location: z.string(),
  time: z.coerce.date(),
});

export type EventFormData = z.infer<typeof eventSchema>;
