import axiosInstance from "../hooks/useAxios";
import { RegLogResZ, type AuthSchema } from "../schemas/authSchemas";
import type { ResponseLogRes } from "../types/authTypes";
import { getMessageError } from "../utils/parse_error";

//Inicio de sesion
export async function SignIn(data: AuthSchema): Promise<ResponseLogRes> {
     const response: ResponseLogRes = await axiosInstance.post("/auth/login", { email: data.email, password: data.password }
     ).then((r) => {
          const parsed = RegLogResZ.safeParse(r.data)

          if (!parsed.success) {
               console.error("Datos invalidos desde el servidor.")
               return { statusCode: 500, message: "Datos invalidos desde el servidor." };
          }
          return {
               statusCode: r.status,
               message: "Login Exitoso",
               ...parsed.data,
          };
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
export async function SignUp(data: AuthSchema): Promise<ResponseLogRes> {
     const response: ResponseLogRes = await axiosInstance.post("/auth/register", { name: data.name, email: data.email, password: data.password }
     ).then((r) => {
          const parsed = RegLogResZ.safeParse(r.data)

          if (!parsed.success) {
               console.log(parsed.error)
               console.error("Datos invalidos desde el servidor.")
               return { statusCode: 500, message: "Datos invalidos desde el servidor." };
          }
          return {
               statusCode: r.status,
               message: "Login Exitoso",
               ...parsed.data,
          };
     }).catch((error) => {
          return {
               statusCode: error.response.status,
               message: getMessageError(error),
          }
     })
     // console.log(response)
     return response
}