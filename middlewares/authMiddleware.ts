import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Payload } from "../types/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        rol: string;
        email?: string;
        username?: string;
      };
    }
  }
}

/**
 * Middleware that verifies the JWT token from the "x-token" header.
 * On success it attaches `userId` and `userRol` to `req.body`
 * so downstream handlers / middlewares can use them.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("x-token");

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Token es requerido",
      });
    }

    const decoded = <Payload>jwt.verify(token, process.env.JWT_KEY as string);

    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      email: decoded.email,
      username: decoded.username,
    };

    next();
  } catch (error: unknown) {
    console.log("Error en autenticación", error);
    return res.status(401).json({
      ok: false,
      message: "Token inválido o expirado",
    });
  }
};

/**
 * Middleware factory that checks whether the authenticated user
 * has one of the allowed roles.
 *
 * Must be used **after** `authenticate` so that `req.body.userRol`
 * is already set.
 *
 * @example
 * router.post("/createResource", authenticate, authorize("admin"), createResource);
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRol: string | undefined = req.user?.rol;

    if (!userRol) {
      return res.status(401).json({
        ok: false,
        message: "No se pudo determinar el rol del usuario",
      });
    }

    // Case-insensitive comparison to be resilient to DB casing
    const hasRole = allowedRoles.some(
      (role) => role.toLowerCase() === userRol.toLowerCase(),
    );

    if (!hasRole) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};
