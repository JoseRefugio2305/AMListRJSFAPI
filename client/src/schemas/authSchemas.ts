import * as z from "zod";

export const PasswordZ = z.string()
     .trim()
     .min(8, "La contraseña debe tener al menos 8 caracteres")
     .max(16, "La contraseña no puede tener más de 16 caracteres")
     .refine((s) => /[A-Z]/.test(s), {
          message: "Debe contener al menos una letra mayúscula",
     })
     .refine((s) => /[a-z]/.test(s), {
          message: "Debe contener al menos una letra minúscula",
     })
     .refine((s) => /\d/.test(s), {
          message: "Debe contener al menos un dígito",
     })
     .refine((s) => /[!@#_%-]/.test(s), {
          message: "Debe contener al menos uno de estos símbolos: ! @ # _ - %",
     })
     .refine((s) => /^[A-Za-z\d!@#_%-]+$/.test(s), {
          message: "Sólo se permiten letras, dígitos y los símbolos: ! @ # _ - %",
     });

export const NameZ = z
     .string()
     .trim()
     .default("")
     .superRefine((s, ctx) => {
          // allow empty (optional name) — do not validate when empty
          if (s === "") return;

          if (s.length < 8) {
               ctx.addIssue({ code: "custom", message: "El nombre debe tener al menos 8 caracteres" });
          }
          if (s.length > 16) {
               ctx.addIssue({ code: "custom", message: "El nombre no puede tener más de 16 caracteres" });
          }
          if (!/^[A-Za-z0-9_-]+$/.test(s)) {
               ctx.addIssue({ code: "custom", message: "Sólo se permiten letras minúsculas, mayúsculas, dígitos, guion bajo (_) y guion (-)" });
          }
     });

export const AuthZ = z.object({
     name: NameZ,
     email: z.email(),
     password: PasswordZ,
})

export const RegLogResZ = z.object({
     access_token: z.string().optional(),
     name: z.string().optional(),
     profile_pic: z.number().default(1).optional(),
     rol: z.union([z.literal(0), z.literal(1)]).optional(),
})

//Exports de tipos
export type AuthSchema = z.infer<typeof AuthZ>
export type RegLogResSchema = z.infer<typeof RegLogResZ>