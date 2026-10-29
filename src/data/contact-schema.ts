import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Tell me a little more about the project."),
});

export type ContactValues = z.infer<typeof contactSchema>;
