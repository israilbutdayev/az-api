import { Router } from "express";
import cbar_router from "../cbar/routers/index.js";
import tax_router from "../tax/routes/index.js";
const api = Router();
api.use("/cbar", cbar_router);
api.use("/tax", tax_router);
export default api;
