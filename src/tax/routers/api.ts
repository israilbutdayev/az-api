import { Router, Express, Request, Response } from "express";
import auth from "../middlewares/auth.js";
import list from "./list.js";
import doc from "./doc.js";
const api = Router();
api.use(auth);
api.use("/list", list);
api.use("/doc", doc);
export default api;
