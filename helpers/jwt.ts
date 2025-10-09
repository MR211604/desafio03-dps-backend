import jwt from "jsonwebtoken";
import { Payload } from "../types/jwt";

export const generateJWT = (id: string) => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    console.log("payload", payload);
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
    const { id } = <Payload>jwt.verify(token, process.env.JWT_KEY as string);
    return {
      success: true,
      id: id,
    };
  } catch (error) {
    return { success: false, error };
  }
};
