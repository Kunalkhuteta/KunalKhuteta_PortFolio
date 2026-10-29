import type { z } from "zod";
import type { contactSchema } from "@/data/contact-schema";

/**
 * Placeholder submit handler — connect this to a backend / email service next.
 * Resolve it with a real API call (e.g. a createServerFn or an email provider).
 */
export async function submitContact(
  _values: z.infer<typeof contactSchema>,
): Promise<void> {
  // Simulate network latency so UI states (loading / success / error) are visible.
  await new Promise((resolve) => setTimeout(resolve, 900));
}
