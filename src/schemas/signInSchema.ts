import { z } from "zod";

export const signInSchema = z.object({
  // we use identifier here use this is the production
  identifier: z.string(),
  password: z.string(),
});
