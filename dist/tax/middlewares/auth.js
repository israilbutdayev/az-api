import crypto from "crypto";
import token_controller from "../controllers/token.js";
import user_login from "../controllers/userLogin.js";
import asan_login from "../controllers/asanLogin.js";
const sessions = [];
const auth = async (req, res, next) => {
    try {
        let logged_in = false;
        const body = req.body;
        const { token, access_token, asanMob, asanId, userId, password2, password1, } = body;
        if (token) {
            const data = await token_controller(token);
            if (data.valid) {
                req.user_data = data;
                req.user_data.token_provided = true;
                logged_in = true;
                next();
            }
        }
        if (!logged_in && access_token) {
            let session = sessions.find((s) => s.access_token === access_token);
            if (session) {
                let t_token = session.token;
                if (t_token) {
                    const data = await token_controller(t_token);
                    if (data.valid) {
                        req.user_data = data;
                        req.user_data.token_provided = true;
                        logged_in = true;
                        next();
                    }
                }
                else if (session.oid && asanMob && asanId) {
                    const response = await asan_login(asanMob, asanId, false, session.oid);
                    if (response.token) {
                        session.token = response.token;
                        const data = await token_controller(response.token);
                        if (data.valid) {
                            req.user_data = data;
                            req.user_data.token_provided = true;
                            logged_in = true;
                            next();
                        }
                    }
                    else {
                        const resp = await asan_login(asanMob, asanId, false, session.oid);
                        if (resp.valid && resp.retry) {
                            res.json({
                                success: true,
                                error: false,
                                retry: true,
                                access_token: session.access_token,
                                token: null,
                                data: {},
                            });
                        }
                        else if (resp.valid && !resp.retry && resp.token) {
                            const data = await token_controller(resp.token);
                            if (data.valid) {
                                req.user_data = data;
                                req.user_data.token_provided = true;
                                logged_in = true;
                                next();
                            }
                        }
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
                const access_token = crypto.randomBytes(20).toString("hex");
                const session = {
                    access_token,
                    oid,
                    code,
                };
                sessions.push(session);
                res.json({
                    success: true,
                    error: false,
                    retry: true,
                    access_token,
                    code,
                });
            }
        }
        else if (!logged_in) {
            res.json({
                retry: false,
                success: false,
                error: true,
                message: "Səhv baş verdi.",
            });
        }
    }
    catch (error) {
        res.json({
            retry: false,
            success: false,
            error: true,
            message: "Xəta baş verdi.",
        });
    }
};
export default auth;
