import type { RegLogResSchema } from "../schemas/authSchemas";

type RolType = 0 | 1;

//Respuesta de login o registro
export interface ResponseLogRes {
     statusCode: number,
     message: string,
     access_token?: RegLogResSchema["access_token"],
     name?: RegLogResSchema["name"]
     profile_pic?: RegLogResSchema["profile_pic"]
     rol?: RolType
}
