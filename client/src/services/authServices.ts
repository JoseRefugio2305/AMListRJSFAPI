import axiosInstance from "../hooks/useAxios";
import type { ResponseLogRes, UserLogReg } from "../types/authTypes";
import { getMessageError } from "../utils/parse_error";

//Inicio de sesion
export async function SignIn(data: UserLogReg): Promise<ResponseLogRes> {
     const response: ResponseLogRes = await axiosInstance.post("/auth/login", { email: data.email, password: data.password }
     ).then((r) => {
          return {
               statusCode: r.status,
               message: "Login Exitoso",
               access_token: r.data.access_token,
               name: r.data.name,
               profile_pic: r.data.profile_pic ? r.data.profile_pic : 0,
               rol: r.data.rol
          }
     }).catch((error) => {
          return {
               statusCode: error.response.status,
               message: getMessageError(error)
          }
     })
     // console.log(response)
     return response
}
//Registro
export async function SignUp(data: UserLogReg): Promise<ResponseLogRes> {
     const response: ResponseLogRes = await axiosInstance.post("/auth/register", { name: data.name, email: data.email, password: data.password }
     ).then((r) => {
          return {
               statusCode: r.status,
               message: "Registro Exitoso",
               access_token: r.data.access_token,
               name: r.data.name,
               profile_pic: r.data.profile_pic ? r.data.profile_pic : 1,
               rol: r.data.rol
          }
     }).catch((error) => {
          return {
               statusCode: error.response.status,
               message: getMessageError(error),
               access_token: "",
               name: "",
               profile_pic: 0,
               rol: 0
          }
     })
     // console.log(response)
     return response
}