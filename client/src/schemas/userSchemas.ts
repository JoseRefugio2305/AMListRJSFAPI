import * as z from "zod";
import { NameZ, PasswordZ } from "./authSchemas";

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

export const RespPayCngEmailZ = z.object({
     new_email: z.email(),
     old_email: z.email(),
})

export const RespPayCngPassZ = z.object({
     new_pass: PasswordZ,
     old_pass: PasswordZ,
})

export type UserProfileSchema = z.infer<typeof UserProfileZ>
export type ResponseProfPicSchema = z.infer<typeof ResponseProfPicZ>
export type RespPayCngUsernameSchema = z.infer<typeof RespPayCngUsernameZ>
export type RespPayCngEmailSchema = z.infer<typeof RespPayCngEmailZ>
export type RespPayCngPassSchema = z.infer<typeof RespPayCngPassZ>