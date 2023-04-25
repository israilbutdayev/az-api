import { Router } from "express";
import { print } from "../controllers/print";
const print_router = Router();
print_router.post("/", async (req, res) => {
    const body = req.body;
    const pdf = await print(body);
    res.sendFile(pdf);
});
export default print_router;
