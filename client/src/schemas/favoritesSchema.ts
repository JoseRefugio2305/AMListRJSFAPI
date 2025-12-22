import * as z from "zod";

export const FavRespZ = z.object({
     active: z.boolean().optional(),
     statusView: z.number().optional()
});

//Exports de tipos
export type FavRespSchema = z.infer<typeof FavRespZ>