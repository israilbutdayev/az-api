import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import tokenController from "../controllers/cert.js";

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
    const { token, access_token, asanMob, asanId, userId, password2, password1 } = body;
    let loggedin = false;
    if (token) {
      const validToken = await tokenController(token);
      if (validToken) {
        loggedin = true;
      }
    } 
    let session;
    if(!loggedin && access_token){
      session = sessions.find(s => s.access_token === access_token)
    }
    if(session){
      token = session.token
    }
    
    if (!loggedIn) {
      if (true)
        userLogin(userId, password2, password1)
    }
    if (!loggedIn){
      asanLogin(asanMob, asanId)
    }
    next();
  } catch (error) {}
};

export default auth;
