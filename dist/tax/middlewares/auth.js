import tokenController from "../controllers/cert.js";
const sessions = [];
const auth = async (req, res, next) => {
    try {
        const body = req.body;
        const { token, access_token, asanMob, asanId, userId, password2, password1 } = body;
        let token_t;
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
            token_t = session.token;
        }
        if (!loggedin) {
            if (true)
                userLogin(userId, password2, password1);
        }
        if (!loggedin) {
            asanLogin(asanMob, asanId);
        }
        next();
    }
    catch (error) { }
};
async function asanLogin(asanMob, asanId) {
}
async function userLogin(userId, password2, password1) {
}
export default auth;
