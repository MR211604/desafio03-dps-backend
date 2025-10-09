import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const schemaValidator = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => issue.message);
        return res.status(400).json({ ok: false, message: errors });
      } else {
        return res
          .status(500)
          .json({ ok: false, message: "Internal server error" });
      }
    }
  };
};
