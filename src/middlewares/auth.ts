import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import tokenController from "../controllers/token.js";

interface session {
  access_token: string;
  token: string | null;
}
interface body {
  access_token: string | null;
  token: string | null;
  asanMob: string | null;
  asanId: string | null;
  userId: string | null;
  password2: string | null;
  password1: string | null;
}
const sessions: session[] = [];

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body: body = req.body;
    if (body.token) {
      const valid = await tokenController(body.token);
      if (!valid) {
      }
    }
    next();
  } catch (error) {
    
  }
};

export default auth;
