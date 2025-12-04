export interface UserLogReg {
     name: string | null,
     email: string,
     password: string
}

export interface ResponseLogRes {
     statusCode: number,
     message: string,
     access_token: string,
     name: string
}