import tokenController from "../controllers/cert.js";
const sessions = [];
const auth = async (req, res, next) => {
    try {
        const body = req.body;
        if (body.token) {
            const valid = await tokenController(body.token);
            if (!valid) {
            }
        }
        next();
    }
    catch (error) { }
};
export default auth;
