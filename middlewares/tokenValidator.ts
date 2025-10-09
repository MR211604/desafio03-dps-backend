import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { Payload } from "../types/jwt";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("x-token");
    if (!token)
      return res.status(401).json({
        ok: false,
        message: "Token is required",
      });

    const { id } = <Payload>jwt.verify(token, process.env.JWT_KEY as string);
    req.body.id = id;
    next();
  } catch (error: unknown) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      content: error,
    });
  }
};
