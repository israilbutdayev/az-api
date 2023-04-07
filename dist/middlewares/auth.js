import tokenController from "../controllers/cert.js";
const sessions = [];
const auth = async (req, res, next) => {
    try {
        const body = req.body;
        const { token, access_token, asanMob, asanId, userId, password2, password1 } = body;
        let loggedin = false;
        if (token) {
            const validToken = await tokenController(token);
            if (validToken) {
                loggedin = true;
            }
        }
        let session;
        if (!loggedin && access_token) {
            session = sessions.find(s => s.access_token === access_token);
        }
        if (session) {
            token = session.token;
        }
        if (!loggedIn) {
            if (true)
                userLogin(userId, password2, password1);
        }
        if (!loggedIn) {
            asanLogin(asanMob, asanId);
        }
        next();
    }
    catch (error) { }
};
export default auth;
