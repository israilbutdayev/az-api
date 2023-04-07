import { Router } from "express";
import get_currencies from "../controllers/index.js";
const api = Router();
api.post("/currencies", get_currencies);
export default api;
