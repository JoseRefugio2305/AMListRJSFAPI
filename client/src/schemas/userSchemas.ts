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

export const ResponseProfPicZ = z.object({
     profile_pic: z.number().default(1),
})

export const RespPayCngUsernameZ = z.object({
     new_name: NameZ,
     old_name: NameZ
})

export type UserProfileSchema = z.infer<typeof UserProfileZ>
export type ResponseProfPicSchema = z.infer<typeof ResponseProfPicZ>
export type RespPayCngUsernameSchema = z.infer<typeof RespPayCngUsernameZ>