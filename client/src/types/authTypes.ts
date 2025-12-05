export interface UserLogReg {
     name?: string,
     email: string,
     password: string
}

type RolType = 0 | 1;

export interface ResponseLogRes {
     statusCode: number,
     message: string,
     access_token?: string,
     name?: string
     profile_pic?: number
     rol?: RolType
}
