//Payload de login o registro de usuario
export interface UserLogReg {
     name?: string,
     email: string,
     password: string
}
//Rol de usuario, 0 base 1 admin
type RolType = 0 | 1;

//Respuesta de login o registro
export interface ResponseLogRes {
     statusCode: number,
     message: string,
     access_token?: string,
     name?: string
     profile_pic?: number
     rol?: RolType
}
