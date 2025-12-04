import { create } from "zustand";
import { SignIn, SignUp } from "../services/authServices";
import type { ResponseLogRes, UserLogReg } from "../types/authTypes";

type AuthType = true | false//true Login, false register

interface AuthState {
     token_jwt: string | null;
     username: string | null;
     login: (data: UserLogReg, is_login: AuthType) => Promise<{
          message: string, is_success: boolean
     }>;
     logout: () => void
}

export const authStore = create<AuthState>((set) => ({
     token_jwt: getTokenJWT(),
     username: getUsername(),
     login: async (data: UserLogReg, is_login: AuthType) => {
          const response: ResponseLogRes = is_login ? await SignIn(data) : await SignUp(data);//Hacemos la peticion de inicio se sesion
          if (response.statusCode === 200 || response.statusCode === 201) {//Si el registro o login fueron exitosos
               //Guardamos los datos de token y username
               sessionStorage.setItem("token_jwt_url", response.access_token)
               sessionStorage.setItem("username", response.name)
               //Actualizamos el estado
               set({ token_jwt: response.access_token, username: response.name })

               return {
                    message: response.message
                    , is_success: true
               }
          }
          return {
               message: response.message
               , is_success: false
          }


     }, logout: () => {
          //Guardamos los datos de token y username
          sessionStorage.removeItem("token_jwt_url")
          sessionStorage.removeItem("username")
          //Actualizamos el estado
          set({ token_jwt: "", username: "" })
     }
}));

function getTokenJWT(): string | null {
     return sessionStorage.getItem("token_jwt_url") ?? null
}

function getUsername(): string | null {
     return sessionStorage.getItem("username") ?? null
}

