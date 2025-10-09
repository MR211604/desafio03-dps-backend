import * as jwt from "jsonwebtoken";

export interface Payload extends jwt.JwtPayload {
  id: string;
}
