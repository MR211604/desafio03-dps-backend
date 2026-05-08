import jwt from "jsonwebtoken";
import { Payload } from "../types/jwt";

export const generateJWT = (id: string, rol: string) => {
  return new Promise((resolve, reject) => {
    const payload = { id, rol };
    jwt.sign(
      payload,
      process.env.JWT_KEY as string,
      {
        expiresIn: "24h",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se ha podido generar el token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export const verifyJWT = (token: string | "") => {
  try {
    const { id, rol } = <Payload>jwt.verify(token, process.env.JWT_KEY as string);
    return {
      success: true,
      id: id,
      rol: rol,
    };
  } catch (error) {
    return { success: false, error };
  }
};
