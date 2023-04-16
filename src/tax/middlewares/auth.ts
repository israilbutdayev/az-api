import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import token_controller from "../controllers/token.js";
import user_login from "../controllers/userLogin.js";
import asan_login from "../controllers/asanLogin.js";
import sleep from "../utils/sleep.js";
// import { filter_shape } from "../routes/list.js";

interface session {
  token?: string;
  oid?: string;
  code?: string;
  asanMob: string;
  asanId: string;
  running?: boolean;
  userId?: string;
  password2?: string;
  password1?: string;
}
export interface Request_extended extends Request {
  user_data?: {
    valid: boolean;
    userType?: string;
    loginType?: string;
    orgId?: string;
    token?: string;
    token_provided?: boolean;
  };
}

interface body {
  token: string | null;
  asanMob: string | null;
  asanId: string | null;
  userId: string | null;
  password2: string | null;
  password1: string | null;
  filters: string[];
}
const sessions: session[] = [];

const auth = async (
  req: Request_extended,
  res: Response,
  next: NextFunction
) => {
  try {
    let logged_in = false;
    const body: body = req.body;
    const { token, asanMob, asanId, userId, password2, password1, filters } =
      body;
    if (!filters || !filters?.length) {
      return res.json({
        success: false,
        error: true,
        message: "Axtarış parametrləri daxil edilməyib.",
      });
    }
    if (token) {
      const data = await token_controller(token);
      if (data.valid) {
        req.user_data = data;
        req.user_data.token_provided = true;
        logged_in = true;
        next();
      }
    }
    if (!logged_in) {
      let session = sessions.find(
        (s) => s.asanMob === asanMob && s.asanId === asanId
      );
      if (session) {
        let t_token = session.token;
        if (t_token) {
          const data = await token_controller(t_token);
          if (data.valid) {
            req.user_data = data;
            req.user_data.token_provided = true;
            logged_in = true;
            session.running = false;
            next();
          }
        } else if (session.oid && asanMob && asanId) {
          const response = await asan_login(
            asanMob,
            asanId,
            false,
            session.oid
          );
          if (response.token) {
            session.token = response.token;
            session.running = false;
            const data = await token_controller(response.token);
            if (data.valid) {
              req.user_data = data;
              req.user_data.token_provided = true;
              logged_in = true;
              session.running = false;
              return next();
            }
          } else if (response.valid) {
            if (response.retry) {
              return res.json({
                success: true,
                error: false,
                retry: true,
                asanMob,
                asanId,
              });
            }
          } else if (!response.valid) {
            const index = sessions.findIndex((s) => s === session);
            sessions.splice(index, 1);
          }
        }
      }
    }
    if (!logged_in && userId && password2 && password1) {
      const login = await user_login(userId, password2, password1);
      if (login.valid) {
        let token = login.token;
        if (token) {
          const data = await token_controller(token);
          if (data.valid) {
            req.user_data = data;
            req.user_data.token_provided = false;
            logged_in = true;
            next();
          }
        }
      }
    }
    if (!logged_in && asanMob && asanId) {
      const data = await asan_login(asanMob, asanId, true);
      if (data.valid) {
        const { oid, code } = data;
        const session: session = {
          oid,
          code,
          asanMob,
          asanId,
        };
        sessions.push(session);
        return res.json({
          success: true,
          error: false,
          retry: true,
          code,
        });
      }
    } else if (!logged_in) {
      res.json({
        retry: false,
        success: false,
        error: true,
        message: "Səhv baş verdi.",
      });
    }
  } catch (error) {
    res.json({
      retry: false,
      success: false,
      error: true,
      message: "Xəta baş verdi.",
    });
  }
};

export default auth;
