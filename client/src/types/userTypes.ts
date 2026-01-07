import type { ResponseProfPicSchema, RespPayCngEmailSchema, RespPayCngUsernameSchema } from "../schemas/userSchemas"

export interface PayloadProfPic {
   profile_pic: number
}

export interface PayloadUsername {
   old_name: string
   new_name: string
}

export interface ResponseUsername {
   is_success: boolean
   msg: string
   old_name?: RespPayCngUsernameSchema["old_name"]
   new_name?: RespPayCngUsernameSchema["new_name"]
}

export interface PayloadEmail {
   old_email: string
   new_email: string
}

export interface ResponseEmail {
   is_success: boolean
   msg: string
   old_email?: RespPayCngEmailSchema["old_email"]
   new_email?: RespPayCngEmailSchema["new_email"]
}

export interface ResponseProfPic {
   is_success: boolean
   msg: string
   profile_pic?: ResponseProfPicSchema["profile_pic"]
}

export const avatarsOptions: { img: string; code: number }[] = [
   {
      img: "/avatars/1.png",
      code: 1,
   },
   {
      img: "/avatars/2.png",
      code: 2,
   },
   {
      img: "/avatars/3.png",
      code: 3,
   },
   {
      img: "/avatars/4.png",
      code: 4,
   },
   {
      img: "/avatars/5.png",
      code: 5,
   },
   {
      img: "/avatars/6.png",
      code: 6,
   },
   {
      img: "/avatars/7.png",
      code: 7,
   },
   {
      img: "/avatars/8.png",
      code: 8,
   },
   {
      img: "/avatars/9.png",
      code: 9,
   },
   {
      img: "/avatars/10.png",
      code: 10,
   },
   {
      img: "/avatars/11.png",
      code: 11,
   },
];
