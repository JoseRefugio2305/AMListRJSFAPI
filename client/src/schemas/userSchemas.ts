import * as z from "zod";
import { NameZ } from "./authSchemas";

export const UserProfileZ = z.object({
     id: z.string(),
     name: NameZ,
     email: z.email(),
     rol: z.union([z.literal(0), z.literal(1)]).optional(),
     is_active: z.boolean(),
     profile_pic: z.number().default(1),
     created_date: z.string()
})

export type UserProfileSchema = z.infer<typeof UserProfileZ>