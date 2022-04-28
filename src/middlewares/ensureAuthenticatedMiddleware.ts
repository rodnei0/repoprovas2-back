import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userService from "../services/userService.js";
import { unauthorizedError } from "../utils/errorUtils.js";
dotenv.config();

export async function ensureAuthenticatedMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers["authorization"];
  // console.log(req.headers)
  if (!authorization) throw unauthorizedError("Missing authorization header");

  const token = authorization.replace("Bearer ", "");
  // console.log(token)
  if (!token) throw unauthorizedError("Missing token");

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: number;
    };
    const user = await userService.findById(userId);
    // console.log(user)
    res.locals.user = user;

    next();
  } catch {
    // console.log('aqui')
    throw unauthorizedError("Invalid token");
  }
}
