import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, {
      message: "Content length should be more than 10 characters",
    })
    .max(300, {
      message: "Content length should not be exceeding 300 characters",
    }),
});
