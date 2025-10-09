import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string({
      error: "El nombre de usuario es obligatorio",
    })
    .min(3, {
      error: "El nombre tiene que ser de al menos 3 caracteres",
    }),
  email: z.email({
    error: "Por favor ingrese un correo valido",
  }),
  password: z
    .string({
      error: "La contraseña es obligatoria",
    })
    .min(8, { error: "La contraseña debe tener al menos 8 caracteres." })
    .regex(/[A-Z]/, {
      error: "La contraseña debe contener al menos una letra mayúscula.",
    })
    .regex(/[a-z]/, {
      error: "La contraseña debe contener al menos una letra minúscula.",
    })
    .regex(/[0-9]/, {
      error: "La contraseña debe contener al menos un número.",
    })
    .regex(/[!@#$%^&*]/, {
      error:
        "La contraseña debe contener al menos un carácter especial (!@#$%^&*).",
    }),
});

export const loginSchema = z.object({
  email: z.email({
    error: "Por favor ingrese un correo valido",
  }),
  password: z.string({
    error: "La contraseña es obligatoria",
  }),
});
