import { create } from "zustand";
import { SignIn, SignUp } from "../services/authServices";
import type { ResponseLogRes } from "../types/authTypes";
import type { AuthSchema } from "../schemas/authSchemas";

type AuthType = true | false//true Login, false register

interface AuthState {
     token_jwt: string | null;
     username: string | null;
     prof_pic: string | null;
     rol: number | null;
     login: (data: AuthSchema, is_login: AuthType) => Promise<{
          message: string, is_success: boolean
     }>;
     logout: (navigate?: (path: string) => void) => void;
     setProfPic: (avatar: number) => void;
     setUsername: (name: string) => void;
}

export const authStore = create<AuthState>((set) => ({
     token_jwt: getTokenJWT(),
     username: getUsername(),
     prof_pic: getProfPic(),
     rol: getRol(),
     login: async (data: AuthSchema, is_login: AuthType) => {
          const response: ResponseLogRes = is_login ? await SignIn(data) : await SignUp(data);//Hacemos la peticion de inicio se sesion
          if (response.statusCode === 200 || response.statusCode === 201) {//Si el registro o login fueron exitosos
               const prof_pic = response.profile_pic !== 0 ? `/avatars/${response.profile_pic}.png` : "/avatars/not_found.png";
               //Guardamos los datos de token y username
               sessionStorage.setItem("token_jwt_url", response.access_token ?? "")
               sessionStorage.setItem("username", response.name ?? "")
               sessionStorage.setItem("prof_pic", prof_pic)
               sessionStorage.setItem("rol", String(response.rol))
               //Actualizamos el estado
               set({ token_jwt: response.access_token, username: response.name, prof_pic, rol: response.rol })

               return {
                    message: response.message,
                    is_success: true
               }
          }
          return {
               message: response.message,
               is_success: false
          }


     },
     logout: (navigate?: (path: string) => void) => {
          //Guardamos los datos de token y username
          sessionStorage.removeItem("token_jwt_url")
          sessionStorage.removeItem("username")
          sessionStorage.removeItem("prof_pic")
          sessionStorage.removeItem("rol")
          //Actualizamos el estado
          set({
               token_jwt: "",
               username: "",
               prof_pic: "",
               rol: null
          })

          navigate?.("/login");
     },
     setProfPic: (avatar: number) => {
          const prof_pic = avatar !== 0 ? `/avatars/${avatar}.png` : "/avatars/not_found.png";
          sessionStorage.removeItem("prof_pic")
          sessionStorage.setItem("prof_pic", prof_pic)
          set({ prof_pic: prof_pic })
     },
     setUsername: (name: string) => {
          sessionStorage.removeItem("username")
          sessionStorage.setItem("username", name)
          set({ username: name })
     }
}));

function getTokenJWT(): string | null {
     return sessionStorage.getItem("token_jwt_url") ?? null
}

function getUsername(): string | null {
     return sessionStorage.getItem("username") ?? null
}

function getProfPic(): string | null {
     return sessionStorage.getItem("prof_pic") ?? null
}

function getRol(): number | null {
     const rolStr = sessionStorage.getItem("rol");
     if (rolStr) {
          return parseInt(rolStr)
     }
     return null
}

