import jwt from "jsonwebtoken";
import { Payload } from "../types/jwt";

interface GenerateJWTParams {
  id: string;
  rol: string;
  username: string;
  email: string;
}

export const generateJWT = ({
  id,
  rol,
  username,
  email,
}: GenerateJWTParams) => {
  return new Promise((resolve, reject) => {
    const payload = { id, rol, username, email };
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
      },
    );
  });
};

export const verifyJWT = (token: string | "") => {
  try {
    const { id, rol, username, email } = <Payload>(
      jwt.verify(token, process.env.JWT_KEY as string)
    );
    return {
      success: true,
      id: id,
      rol: rol,
      username: username,
      email: email,
    };
  } catch (error) {
    return { success: false, error };
  }
};
