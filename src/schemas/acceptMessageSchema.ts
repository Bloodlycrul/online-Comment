import { z } from "zod";

export const accpectMessageSchema = z.object({
  accpectMessage: z.boolean(),
});
